import * as anchor from '@project-serum/anchor';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { ClientBase } from './base';
import {
  HONEY_MINT,
  PHONEY_MINT,
  STAKE_PROGRAM_ID,
  POOL_USER_SEED,
  TOKEN_VAULT_SEED,
  VAULT_AUTHORITY_SEED
} from './constant';
import { Stake, IDL as stakeIdl } from '../types/stake';
import { VeHoneyClient } from './vehoney';
import { PoolInfo, PoolUser } from './types';

const SYSTEM_PROGRAM_ID = SystemProgram.programId;

export class StakeClient extends ClientBase<Stake> {
  constructor(connection: Connection, wallet: anchor.Wallet) {
    super(connection, wallet, stakeIdl, STAKE_PROGRAM_ID);
  }

  get walletKey(): PublicKey {
    if (!this.wallet) {
      throw new Error('wallet undefiend');
    }
    return this.wallet.publicKey;
  }

  get programId(): PublicKey {
    if (!this.program) {
      throw new Error('program undefined');
    }
    return this.program.programId;
  }

  private async initUserTx(pool: PublicKey, tx: Transaction) {
    const [user] = await this.getUserPDA(pool);

    const ix = await this.program.methods
      .initializeUser()
      .accounts({
        payer: this.walletKey,
        poolInfo: pool,
        userInfo: user,
        userOwner: this.walletKey,
        systemProgram: SYSTEM_PROGRAM_ID
      })
      .instruction();

    tx.add(ix);
  }

  private async depositTx(
    pool: PublicKey,
    user: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    tx: Transaction
  ) {
    const ix = await this.program.methods
      .deposit(amount)
      .accounts({
        poolInfo: pool,
        userInfo: user,
        userOwner: this.walletKey,
        pTokenMint: PHONEY_MINT,
        source,
        userAuthority: this.walletKey,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .instruction();

    tx.add(ix);
  }

  private async claimTx(
    pool: PublicKey,
    user: PublicKey,
    destination: PublicKey,
    tx: Transaction
  ) {
    const [authority] = await this.getPoolAuthorityPDA(pool);

    const ix = await this.program.methods
      .claim()
      .accounts({
        payer: this.walletKey,
        poolInfo: pool,
        authority,
        tokenMint: HONEY_MINT,
        userInfo: user,
        userOwner: this.walletKey,
        destination,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .instruction();

    tx.add(ix);
  }

  private async stakeTx(
    pool: PublicKey,
    locker: PublicKey,
    escrow: PublicKey,
    lockedTokens: PublicKey,
    whitelist: PublicKey | undefined,
    lockerProgramId: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    duration: anchor.BN,
    tx: Transaction
  ) {
    const [authority] = await this.getPoolAuthorityPDA(pool);
    const [tokenVault] = await this.getTokenVaultPDA();

    const remainingAccounts = whitelist
      ? [
          {
            pubkey: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: whitelist,
            isSigner: false,
            isWritable: false
          }
        ]
      : [];

    const ix = await this.program.methods
      .vest(amount, duration)
      .accounts({
        poolInfo: pool,
        tokenMint: HONEY_MINT,
        pTokenMint: PHONEY_MINT,
        pTokenFrom: source,
        userAuthority: this.walletKey,
        tokenVault,
        authority,
        locker,
        escrow,
        lockedTokens,
        lockerProgram: lockerProgramId,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .remainingAccounts(remainingAccounts)
      .instruction();

    tx.add(ix);
  }

  async initUser(pool: PublicKey) {
    const transaction = new Transaction();
    await this.initUserTx(pool, transaction);
    return this.sendAndConfirm(transaction);
  }

  async deposit(pool: PublicKey, source: PublicKey, amount: anchor.BN) {
    const transaction = new Transaction();
    const [userKey] = await this.getUserPDA(pool);
    const user = await this.getAccountInfo(userKey);
    if (!user) {
      await this.initUserTx(pool, transaction);
    }
    await this.depositTx(pool, userKey, source, amount, transaction);
    return this.sendAndConfirm(transaction);
  }

  async claim(pool: PublicKey) {
    const transaction = new Transaction();
    const [user] = await this.getUserPDA(pool);
    const { ata: destination, instruction: createATAIx } =
      await this.getOrCreateATA(HONEY_MINT);
    if (createATAIx) {
      transaction.add(createATAIx);
    }
    await this.claimTx(pool, user, destination, transaction);
    return this.sendAndConfirm(transaction);
  }

  async stake(
    pool: PublicKey,
    locker: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    duration: anchor.BN
  ) {
    const transaction = new Transaction();
    const veHoneyClient = new VeHoneyClient(
      this.provider.connection,
      this.wallet
    );
    const [escrowKey] = await veHoneyClient.getEscrowPDA(locker);
    const escrow = await this.getAccountInfo(escrowKey);
    if (!escrow) {
      await veHoneyClient.initEscrowTx(locker, transaction);
    }
    const lockerAcc = await veHoneyClient.fetchLocker(locker);
    let whitelist: PublicKey | undefined = undefined;
    if (lockerAcc?.params.whitelistEnabled) {
      [whitelist] = await veHoneyClient.getWhitelistEntryPDA(
        locker,
        this.programId,
        SYSTEM_PROGRAM_ID
      );
    }
    const lockedTokens = await veHoneyClient.getEscrowLockedTokenPDA(escrowKey);
    await this.stakeTx(
      pool,
      locker,
      escrowKey,
      lockedTokens,
      whitelist,
      veHoneyClient.programId,
      source,
      amount,
      duration,
      transaction
    );
    return this.sendAndConfirm(transaction);
  }

  async getUserPDA(pool: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_USER_SEED), pool.toBuffer(), this.walletKey.toBuffer()],
      this.programId
    );
  }

  async getPoolAuthorityPDA(pool: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(VAULT_AUTHORITY_SEED), pool.toBuffer()],
      this.programId
    );
  }

  async getTokenVaultPDA() {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(TOKEN_VAULT_SEED),
        HONEY_MINT.toBuffer(),
        PHONEY_MINT.toBuffer()
      ],
      this.programId
    );
  }

  async fetchPoolInfo(pool: PublicKey): Promise<PoolInfo | null> {
    return this.program.account.poolInfo.fetchNullable(pool);
  }

  async fetchPoolUser(user: PublicKey): Promise<PoolUser | null> {
    return this.program.account.poolUser.fetchNullable(user);
  }
}
