import {
  AccountMeta,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY
} from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import {
  Metadata,
  Edition,
  MetadataProgram
} from '@metaplex-foundation/mpl-token-metadata';
import { programs as MetaplexPrograms } from '@metaplex/js';
import {
  VoteSide,
  TRIBECA_ADDRESSES,
  getVoteAddress
} from '@tribecahq/tribeca-sdk';

import { ClientBase } from './base';
import { HONEY_MINT, WL_TOKEN_MINT, VOTER_PROGRAM_ID } from './constant';
import { VeHoney, IDL } from '../types/ve_honey';

const ESCROW_SEED = 'Escrow';
const WHITELIST_ENTRY_SEED = 'LockerWhitelistEntry';
const PROOF_SEED = 'Proof';
const TREASURY_SEED = 'Treasury';
const NFT_RECEIPT_SEED = 'Receipt';
const SYSTEM_PROGRAM_ID = SystemProgram.programId;

export class VeHoneyClient extends ClientBase<VeHoney> {
  constructor(connection: Connection, wallet: anchor.Wallet) {
    super(connection, wallet, IDL, VOTER_PROGRAM_ID);
  }

  get programId(): PublicKey {
    if (!this.program) {
      throw new Error('veHoney program undefined');
    }
    return this.program.programId;
  }

  get walletKey(): PublicKey {
    if (!this.wallet) {
      throw new Error('wallet undefined');
    }
    return this.wallet.publicKey;
  }

  private async initEscrowTx(locker: PublicKey, tx: Transaction) {
    const [escrow] = await this.getEscrowPDA(locker);
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    tx.add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        HONEY_MINT,
        lockedTokens,
        escrow,
        this.walletKey
      )
    ).add(
      await this.program.methods
        .initEscrow()
        .accounts({
          payer: this.walletKey,
          locker,
          escrow,
          escrowOwner: this.walletKey,
          systemProgram: SYSTEM_PROGRAM_ID
        })
        .instruction()
    );
  }

  private async lockTx(
    locker: PublicKey,
    escrow: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    duration: anchor.BN,
    tx: Transaction
  ) {
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    const ix = await this.program.methods
      .lock(new anchor.BN(amount), new anchor.BN(duration))
      .accounts({
        locker,
        escrow,
        lockedTokens,
        escrowOwner: this.walletKey,
        sourceTokens: source,
        sourceTokensAuthority: this.walletKey,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .remainingAccounts([
        {
          pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
          isSigner: false,
          isWritable: false
        },
        {
          pubkey: this.programId,
          isSigner: false,
          isWritable: false
        }
      ])
      .instruction();

    tx.add(ix);
  }

  private async lockNftTx(
    locker: PublicKey,
    escrow: PublicKey,
    nftSource: PublicKey,
    nftMint: PublicKey,
    nftCreator: PublicKey,
    wlDestination: PublicKey,
    receiptId: number,
    duration: anchor.BN,
    tx: Transaction
  ) {
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);
    const [receipt] = await this.getReceiptPDA(
      locker,
      new anchor.BN(receiptId)
    );
    const [treasury] = await this.getTreasuryPDA(locker);
    const [proof] = await this.getProofPDA(locker, nftCreator);
    const nftMetadata = await Metadata.getPDA(nftMint);
    const metadata = await MetaplexPrograms.metadata.Metadata.load(
      this.provider.connection,
      nftMetadata
    );
    const nftEdition = await Edition.getPDA(nftMint);

    const remainingAccounts: AccountMeta[] = [
      {
        pubkey: proof,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: MetadataProgram.PUBKEY,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: nftMetadata,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: nftMint,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: nftEdition,
        isSigner: false,
        isWritable: false
      }
    ];

    if (metadata.data.collection && metadata.data.collection.verified) {
      remainingAccounts.push({
        pubkey: new PublicKey(metadata.data.collection.key),
        isSigner: false,
        isWritable: true
      });
    }

    const ix = await this.program.methods
      .lockNft(duration)
      .accounts({
        payer: this.walletKey,
        locker,
        escrow,
        receipt,
        escrowOwner: this.walletKey,
        lockedTokens,
        lockerTreasury: treasury,
        nftSource,
        nftSourceAuthority: this.walletKey,
        wlTokenMint: WL_TOKEN_MINT,
        wlDestination,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .remainingAccounts(remainingAccounts)
      .instruction();

    tx.add(ix);
  }

  private async unlockTx(
    locker: PublicKey,
    escrow: PublicKey,
    destination: PublicKey,
    tx: Transaction
  ) {
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    const ix = await this.program.methods
      .unlock()
      .accounts({
        payer: this.walletKey,
        locker,
        escrow,
        escrowOwner: this.walletKey,
        lockedTokens,
        destinationTokens: destination,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .instruction();

    tx.add(ix);
  }

  private async claimNftRewardsTx(
    locker: PublicKey,
    escrow: PublicKey,
    destination: PublicKey,
    receiptId: number,
    tx: Transaction
  ) {
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);
    const [receipt] = await this.getReceiptPDA(
      locker,
      new anchor.BN(receiptId)
    );

    const ix = await this.program.methods
      .claim()
      .accounts({
        locker,
        escrow,
        escrowOwner: this.walletKey,
        lockedTokens,
        destinationTokens: destination,
        nftReceipt: receipt,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .instruction();

    tx.add(ix);
  }

  private async closeNftReceiptTx(
    locker: PublicKey,
    escrow: PublicKey,
    receiptId: number,
    tx: Transaction
  ) {
    const [receipt] = await this.getReceiptPDA(
      locker,
      new anchor.BN(receiptId)
    );

    const ix = await this.program.methods
      .closeReceipt()
      .accounts({
        locker,
        escrow,
        nftReceipt: receipt,
        escrowOwner: this.walletKey,
        fundsReceiver: this.walletKey
      })
      .instruction();

    tx.add(ix);
  }

  private async closeEscrowTx(
    locker: PublicKey,
    escrow: PublicKey,
    tx: Transaction
  ) {
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    const ix = await this.program.methods
      .closeEscrow()
      .accounts({
        locker,
        escrow,
        lockedTokens,
        escrowOwner: this.walletKey,
        fundsReceiver: this.walletKey,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .instruction();

    tx.add(ix);
  }

  private async activateProposalTx(
    locker: PublicKey,
    escrow: PublicKey,
    governor: PublicKey,
    proposal: PublicKey,
    tx: Transaction
  ) {
    const ix = await this.program.methods
      .activateProposal()
      .accounts({
        locker,
        escrow,
        governor,
        proposal,
        escrowOwner: this.walletKey,
        governProgram: TRIBECA_ADDRESSES.Govern
      })
      .instruction();

    tx.add(ix);
  }

  private async castVoteTx(
    locker: PublicKey,
    escrow: PublicKey,
    governor: PublicKey,
    proposal: PublicKey,
    vote: PublicKey,
    voteSide: VoteSide,
    tx: Transaction
  ) {
    const ix = await this.program.methods
      .castVote(voteSide)
      .accounts({
        locker,
        escrow,
        voteDelegate: this.walletKey,
        proposal,
        vote,
        governor,
        governProgram: TRIBECA_ADDRESSES.Govern
      })
      .instruction();

    tx.add(ix);
  }

  async createInitializeEscrowIx(locker: PublicKey) {
    const [escrow] = await this.getEscrowPDA(locker);
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    return [
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        HONEY_MINT,
        lockedTokens,
        escrow,
        this.wallet.publicKey
      ),
      await this.program.methods
        .initEscrow()
        .accounts({
          payer: this.wallet.publicKey,
          locker,
          escrow,
          escrowOwner: this.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .instruction()
    ];
  }

  async lock(
    locker: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    duration: anchor.BN
  ) {
    const transaction = new Transaction();
    const [escrowKey] = await this.getEscrowPDA(locker);
    const escrow = await this.getAccountInfo(escrowKey);
    if (!escrow) {
      await this.initEscrowTx(locker, transaction);
    }
    await this.lockTx(locker, escrowKey, source, amount, duration, transaction);

    return this.sendAndConfirm(transaction);
  }

  async lockNft(
    locker: PublicKey,
    nftSource: PublicKey,
    nftMint: PublicKey,
    nftCreator: PublicKey,
    duration: anchor.BN,
    receiptId?: number
  ) {
    const transaction = new Transaction();
    const [escrowKey] = await this.getEscrowPDA(locker);
    const escrow = await this.getAccountInfo(escrowKey);
    if (!escrow) {
      await this.initEscrowTx(locker, transaction);
    }
    const { ata: wlDestination, instruction: createATAIx } =
      await this.getOrCreateATA(WL_TOKEN_MINT);

    if (createATAIx) {
      transaction.add(createATAIx);
    }

    await this.lockNftTx(
      locker,
      escrowKey,
      nftSource,
      nftMint,
      nftCreator,
      wlDestination,
      receiptId ?? 0,
      duration,
      transaction
    );

    return this.sendAndConfirm(transaction);
  }

  async claimNFTRewards(locker: PublicKey, receiptId: number) {
    const transaction = new Transaction();
    const [escrow] = await this.getEscrowPDA(locker);
    const { ata: destination, instruction: createATAIx } =
      await this.getOrCreateATA(HONEY_MINT);

    if (createATAIx) {
      transaction.add(createATAIx);
    }
    await this.claimNftRewardsTx(
      locker,
      escrow,
      destination,
      receiptId,
      transaction
    );

    return this.sendAndConfirm(transaction);
  }

  async unlock(locker: PublicKey) {
    const transaction = new Transaction();
    const [escrow] = await this.getEscrowPDA(locker);
    const { ata: destination, instruction: createATAIx } =
      await this.getOrCreateATA(HONEY_MINT);

    if (createATAIx) {
      transaction.add(createATAIx);
    }
    await this.unlockTx(locker, escrow, destination, transaction);

    return this.sendAndConfirm(transaction);
  }

  async closeNFTReceipt(locker: PublicKey, receiptId: number) {
    const transaction = new Transaction();
    const [escrow] = await this.getEscrowPDA(locker);
    await this.closeNftReceiptTx(locker, escrow, receiptId, transaction);
    return this.sendAndConfirm(transaction);
  }

  async closeEscrow(locker: PublicKey) {
    const transaction = new Transaction();
    const [escrow] = await this.getEscrowPDA(locker);
    await this.closeEscrowTx(locker, escrow, transaction);
    return this.sendAndConfirm(transaction);
  }

  async activateProposal(locker: PublicKey, proposal: PublicKey) {
    const transaction = new Transaction();
    const [escrow] = await this.getEscrowPDA(locker);
    const lockerAccount = await this.fetchLocker(locker);
    if (!lockerAccount) {
      throw new Error('locker uninitialized');
    }

    await this.activateProposalTx(
      locker,
      escrow,
      lockerAccount.governor,
      proposal,
      transaction
    );
    return this.sendAndConfirm(transaction);
  }

  async castVote(locker: PublicKey, proposal: PublicKey, voteSide: VoteSide) {
    const transaction = new Transaction();
    const [escrow] = await this.getEscrowPDA(locker);
    const lockerAccount = await this.fetchLocker(locker);
    if (!lockerAccount) {
      throw new Error('locker uninitialized');
    }
    const vote = getVoteAddress(proposal, this.walletKey);
    await this.castVoteTx(
      locker,
      escrow,
      lockerAccount.governor,
      proposal,
      vote,
      voteSide,
      transaction
    );
    return this.sendAndConfirm(transaction);
  }

  async getEscrowPDA(locker: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ESCROW_SEED),
        locker.toBuffer(),
        this.wallet.publicKey.toBuffer()
      ],
      this.programId
    );
  }

  async getEscrowLockedTokenPDA(escrow: PublicKey) {
    return Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      HONEY_MINT,
      escrow,
      true
    );
  }

  async getWhitelistEntryPDA(
    locker: PublicKey,
    executableId: PublicKey,
    whitelistedOwner: PublicKey
  ) {
    return PublicKey.findProgramAddress(
      [
        Buffer.from(WHITELIST_ENTRY_SEED),
        locker.toBuffer(),
        executableId.toBuffer(),
        whitelistedOwner.toBuffer()
      ],
      this.programId
    );
  }

  async getProofPDA(locker: PublicKey, proofAddress: PublicKey) {
    return PublicKey.findProgramAddress(
      [Buffer.from(PROOF_SEED), locker.toBuffer(), proofAddress.toBuffer()],
      this.programId
    );
  }

  async getTreasuryPDA(locker: PublicKey) {
    return await PublicKey.findProgramAddress(
      [Buffer.from(TREASURY_SEED), locker.toBuffer(), HONEY_MINT.toBuffer()],
      this.programId
    );
  }

  async getReceiptPDA(locker: PublicKey, receiptId: anchor.BN) {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from(NFT_RECEIPT_SEED),
        locker.toBuffer(),
        this.wallet.publicKey.toBuffer(),
        receiptId.toBuffer('le', 8)
      ],
      this.programId
    );
  }

  async getAllEscrowAccounts() {
    return this.program.account.escrow.all();
  }

  async getAllLockerAccounts() {
    return this.program.account.locker.all();
  }

  async getAllNFTReceiptAccounts() {
    return this.program.account.nftReceipt.all();
  }

  async fetchLocker(locker: PublicKey) {
    return this.program.account.locker.fetchNullable(locker);
  }

  async fetchEscrow(escrow: PublicKey) {
    return this.program.account.escrow.fetchNullable(escrow);
  }
}
