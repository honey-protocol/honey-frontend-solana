import { BN } from '@project-serum/anchor';
import { PublicKey, TransactionEnvelope } from '@saberhq/solana-contrib';
import {
  getATAAddressSync,
  getOrCreateATA,
  TOKEN_PROGRAM_ID
} from '@saberhq/token-utils';
import {
  SystemProgram,
  TransactionInstruction,
  SYSVAR_INSTRUCTIONS_PUBKEY
} from '@solana/web3.js';

import { PoolInfo, StakeProgram } from '../../programs';
import { VeHoneySDK } from '../../sdk';
import { calculateClaimableAmountFromStakePool } from '../../utils';
import { findWhitelistEntryAddress, LockerWrapper } from '../locker';
import {
  findPoolUserAddress,
  findTokenVaultAddress,
  findVaultAuthorityAddress
} from './pda';

export class StakeWrapper {
  readonly program: StakeProgram;

  private _poolData: PoolInfo | null = null;

  constructor(readonly sdk: VeHoneySDK, readonly pool: PublicKey) {
    this.program = sdk.programs.Stake;
  }

  get walletKey(): PublicKey {
    return this.sdk.provider.wallet.publicKey;
  }

  static async load(sdk: VeHoneySDK, pool: PublicKey): Promise<StakeWrapper> {
    const wrapper = new StakeWrapper(sdk, pool);
    await wrapper.data();
    return wrapper;
  }

  async reload(): Promise<PoolInfo> {
    return this.program.account.poolInfo.fetch(this.pool);
  }

  async data(): Promise<PoolInfo> {
    if (!this._poolData) {
      this._poolData = await this.reload();
    }
    return this._poolData;
  }

  async fetchPoolUser(authority: PublicKey = this.walletKey) {
    const [pubkey] = await findPoolUserAddress(this.pool, authority);
    const data = await this.program.account.poolUser.fetch(pubkey);
    return { pubkey, data };
  }

  async getOrCreatePoolUser(
    authority: PublicKey = this.walletKey
  ): Promise<{ user: PublicKey; instruction: TransactionInstruction | null }> {
    const [user] = await findPoolUserAddress(this.pool, authority);
    const userData = await this.program.account.poolUser.fetchNullable(user);
    if (userData) {
      return { user, instruction: null };
    } else {
      return { user, instruction: await this.initPoolUserIx(authority) };
    }
  }

  async initPoolUserIx(
    authority: PublicKey = this.walletKey
  ): Promise<TransactionInstruction> {
    const [user] = await findPoolUserAddress(this.pool, authority);
    return this.program.instruction.initializeUser({
      accounts: {
        payer: this.walletKey,
        poolInfo: this.pool,
        userInfo: user,
        userOwner: authority,
        systemProgram: SystemProgram.programId
      }
    });
  }

  async deposit(
    amount: BN,
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const { user, instruction: initUserIx } = await this.getOrCreatePoolUser(
      authority
    );
    const poolInfo = await this.data();
    const source = getATAAddressSync({
      mint: poolInfo.pTokenMint,
      owner: authority
    });

    const depositIx = this.program.instruction.deposit(amount, {
      accounts: {
        poolInfo: this.pool,
        userInfo: user,
        userOwner: authority,
        pTokenMint: poolInfo.pTokenMint,
        source,
        userAuthority: authority,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    });

    return this.sdk.provider.newTX(
      [initUserIx, depositIx].filter((ix): ix is TransactionInstruction => !!ix)
    );
  }

  async claim(
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const [user] = await findPoolUserAddress(this.pool, authority);
    const poolInfo = await this.data();
    const { address: destination, instruction: createATAIx } =
      await getOrCreateATA({
        provider: this.sdk.provider,
        mint: poolInfo.tokenMint,
        owner: authority,
        payer: this.walletKey
      });
    const [vaultAuthority] = await findVaultAuthorityAddress(this.pool);

    const claimIx = this.program.instruction.claim({
      accounts: {
        payer: this.walletKey,
        poolInfo: this.pool,
        authority: vaultAuthority,
        tokenMint: poolInfo.tokenMint,
        userInfo: user,
        userOwner: authority,
        destination,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    });

    return this.sdk.provider.newTX(
      [createATAIx, claimIx].filter((ix): ix is TransactionInstruction => !!ix)
    );
  }

  async vest(
    amount: BN,
    duration: BN,
    authority: PublicKey = this.walletKey,
    locker: PublicKey,
    governor: PublicKey
  ): Promise<TransactionEnvelope> {
    const lockerWrapper = await LockerWrapper.load(this.sdk, locker, governor);

    const poolInfo = await this.data();
    const lockerData = await lockerWrapper.data();

    const source = getATAAddressSync({
      mint: poolInfo.pTokenMint,
      owner: authority
    });
    const { escrow, instruction: initEscrowIx } =
      await lockerWrapper.getOrCreateEscrow(authority);
    const { lockedToken, instructions } =
      await lockerWrapper.getOrCreateGovTokenATA(authority, escrow);

    if (initEscrowIx) {
      instructions.push(initEscrowIx);
    }

    const [tokenVault] = await findTokenVaultAddress(
      poolInfo.pTokenMint,
      poolInfo.tokenMint
    );
    const [vaultAuthority] = await findVaultAuthorityAddress(this.pool);
    const [whitelist] = await findWhitelistEntryAddress(
      locker,
      this.program.programId,
      null
    );

    return this.sdk.provider.newTX([
      ...instructions,
      this.program.instruction.vest(amount, duration, {
        accounts: {
          poolInfo: this.pool,
          tokenMint: poolInfo.tokenMint,
          pTokenMint: poolInfo.pTokenMint,
          pTokenFrom: source,
          userAuthority: authority,
          tokenVault,
          authority: vaultAuthority,
          locker,
          escrow,
          lockedTokens: lockedToken,
          lockerProgram: lockerWrapper.program.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          payer: this.walletKey
        },
        remainingAccounts: lockerData.params.whitelistEnabled
          ? [
              {
                pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
                isSigner: false,
                isWritable: false
              },
              {
                pubkey: whitelist,
                isSigner: false,
                isWritable: false
              }
            ]
          : []
      })
    ]);
  }

  async calculateClaimableAmount(
    currentTimestamp: number = Math.floor(Date.now() / 1_000),
    authority: PublicKey = this.walletKey
  ): Promise<BN> {
    const user = await this.fetchPoolUser(authority);
    const params = (await this.data()).params;

    return calculateClaimableAmountFromStakePool(
      user.data,
      params,
      currentTimestamp
    );
  }
}
