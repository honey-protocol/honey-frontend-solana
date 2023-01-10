import {
  SystemProgram,
  TransactionInstruction,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  AccountMeta
} from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { PublicKey, TransactionEnvelope } from '@saberhq/solana-contrib';
import { GovernorWrapper, TribecaSDK, VoteSide } from '@tribecahq/tribeca-sdk';
import {
  Metadata,
  Edition,
  MetadataProgram
} from '@metaplex-foundation/mpl-token-metadata';
import { programs as MetaplexPrograms } from '@metaplex/js';
import {
  getATAAddressSync,
  getOrCreateATA,
  TOKEN_PROGRAM_ID
} from '@saberhq/token-utils';

import { LockerData, LockerProgram } from '../../programs';
import { VeHoneySDK } from '../../sdk';
import {
  findEscrowAddress,
  findNFTReceiptAddress,
  findTreasuryAddress
} from './pda';
import { NFT_PROOF_ADDRESS, VEHONEY_ADDRESSES } from '../../constant';
import {
  calculateVotingPower,
  calculateNFTReceiptClaimableAmount
} from '../../utils';

export class LockerWrapper {
  readonly program: LockerProgram;
  readonly governor: GovernorWrapper;

  private _lockerData: LockerData | null = null;

  constructor(
    readonly sdk: VeHoneySDK,
    readonly locker: PublicKey,
    readonly governorKey: PublicKey
  ) {
    this.program = sdk.programs.Locker;
    const tribecaSDK = TribecaSDK.load({ provider: sdk.provider });
    this.governor = new GovernorWrapper(tribecaSDK, governorKey);
  }

  get walletKey(): PublicKey {
    return this.sdk.provider.wallet.publicKey;
  }

  static async load(
    sdk: VeHoneySDK,
    lockerKey: PublicKey,
    governorKey: PublicKey
  ): Promise<LockerWrapper> {
    const wrapper = new LockerWrapper(sdk, lockerKey, governorKey);
    await wrapper.data();
    return wrapper;
  }

  async reload(): Promise<LockerData> {
    return this.program.account.locker.fetch(this.locker);
  }

  async data(): Promise<LockerData> {
    if (!this._lockerData) {
      this._lockerData = await this.reload();
    }
    return this._lockerData;
  }

  async getOrCreateEscrow(authority: PublicKey = this.walletKey): Promise<{
    escrow: PublicKey;
    instruction: TransactionInstruction | null;
  }> {
    const [escrow] = await findEscrowAddress(this.locker, authority);
    const escrowData = await this.program.account.escrow.fetchNullable(escrow);
    if (escrowData) {
      return { escrow, instruction: null };
    } else {
      return { escrow, instruction: await this.initEscrowIx(authority) };
    }
  }

  async initEscrowIx(
    authority: PublicKey = this.walletKey
  ): Promise<TransactionInstruction> {
    const [escrow] = await findEscrowAddress(this.locker, authority);
    return this.program.instruction.initEscrow({
      accounts: {
        locker: this.locker,
        escrow,
        escrowOwner: authority,
        payer: this.walletKey,
        systemProgram: SystemProgram.programId
      }
    });
  }

  async lock(
    amount: BN,
    duration: BN,
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const { escrow, instruction: initEscrowIx } = await this.getOrCreateEscrow(
      authority
    );
    const { walletToken, lockedToken, instructions } =
      await this.getOrCreateGovTokenATA(authority, escrow);
    if (initEscrowIx) {
      instructions.push(initEscrowIx);
    }
    const lockerData = await this.reload();

    return this.sdk.provider.newTX([
      ...instructions,
      this.program.instruction.lock(amount, duration, {
        accounts: {
          locker: this.locker,
          escrow,
          escrowOwner: authority,
          lockedTokens: lockedToken,
          sourceTokens: walletToken,
          sourceTokensAuthority: authority,
          tokenProgram: TOKEN_PROGRAM_ID
        },
        remainingAccounts: lockerData.params.whitelistEnabled
          ? [
              {
                pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
                isSigner: false,
                isWritable: false
              },
              {
                pubkey: this.program.programId,
                isSigner: false,
                isWritable: false
              }
            ]
          : []
      })
    ]);
  }

  async lockNFT(
    nft: PublicKey,
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const lockerData = await this.data();
    const duration = lockerData.params.nftStakeDurationUnit.muln(
      lockerData.params.nftStakeDurationCount
    );
    const { escrow, instruction: initEscrowIx } = await this.getOrCreateEscrow(
      authority
    );
    const { lockedToken, instructions } = await this.getOrCreateGovTokenATA(
      authority,
      escrow
    );
    if (initEscrowIx) {
      instructions.push(initEscrowIx);
    }
    const { address: wlDestination, instruction: createWlATAIx } =
      await getOrCreateATA({
        provider: this.sdk.provider,
        mint: lockerData.wlTokenMint,
        owner: authority,
        payer: this.walletKey
      });
    if (createWlATAIx) {
      instructions.push(createWlATAIx);
    }
    const receiptId = await this.newReceiptId();
    const [receipt] = await findNFTReceiptAddress(
      this.locker,
      authority,
      receiptId
    );
    const [treasury] = await findTreasuryAddress(
      this.locker,
      lockerData.tokenMint
    );
    const nftSource = getATAAddressSync({ mint: nft, owner: authority });
    const nftMetadata = await Metadata.getPDA(nft);
    const metadata = await MetaplexPrograms.metadata.Metadata.load(
      this.sdk.provider.connection,
      nftMetadata
    );
    const nftEdition = await Edition.getPDA(nft);

    const remainingAccounts: AccountMeta[] = [
      {
        pubkey: NFT_PROOF_ADDRESS,
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
        pubkey: nft,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: nftEdition,
        isSigner: false,
        isWritable: true
      }
    ];

    if (metadata.data.collection && metadata.data.collection.verified) {
      remainingAccounts.push({
        pubkey: new PublicKey(metadata.data.collection.key),
        isSigner: false,
        isWritable: true
      });
    }

    return this.sdk.provider.newTX([
      ...instructions,
      this.program.instruction.lockNft(duration, {
        accounts: {
          payer: this.walletKey,
          locker: this.locker,
          escrow,
          receipt,
          escrowOwner: authority,
          lockedTokens: lockedToken,
          lockerTreasury: treasury,
          nftSource,
          nftSourceAuthority: authority,
          wlTokenMint: lockerData.wlTokenMint,
          wlDestination,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID
        },
        remainingAccounts
      })
    ]);
  }

  async claim(
    receiptId: BN,
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const [receipt] = await findNFTReceiptAddress(
      this.locker,
      authority,
      receiptId
    );
    const [escrow] = await findEscrowAddress(this.locker, authority);
    const { walletToken, lockedToken, instructions } =
      await this.getOrCreateGovTokenATA(authority, escrow);

    return this.sdk.provider.newTX([
      ...instructions,
      this.program.instruction.claim({
        accounts: {
          locker: this.locker,
          escrow,
          escrowOwner: authority,
          lockedTokens: lockedToken,
          destinationTokens: walletToken,
          nftReceipt: receipt,
          tokenProgram: TOKEN_PROGRAM_ID
        }
      })
    ]);
  }

  async unlock(
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const [escrow] = await findEscrowAddress(this.locker, authority);
    const { walletToken, lockedToken, instructions } =
      await this.getOrCreateGovTokenATA(authority, escrow);

    return this.sdk.provider.newTX([
      ...instructions,
      this.program.instruction.unlock({
        accounts: {
          payer: this.walletKey,
          locker: this.locker,
          escrow,
          escrowOwner: authority,
          lockedTokens: lockedToken,
          destinationTokens: walletToken,
          tokenProgram: TOKEN_PROGRAM_ID
        }
      })
    ]);
  }

  async closeReceipt(
    receiptId: BN,
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const [escrow] = await findEscrowAddress(this.locker, authority);
    const [nftReceipt] = await findNFTReceiptAddress(
      this.locker,
      authority,
      receiptId
    );

    return this.sdk.provider.newTX([
      this.program.instruction.closeReceipt({
        accounts: {
          locker: this.locker,
          escrow,
          nftReceipt,
          escrowOwner: authority,
          fundsReceiver: this.walletKey
        }
      })
    ]);
  }

  async closeEscrow(
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const lockerData = await this.data();
    const [escrow] = await findEscrowAddress(this.locker, authority);
    const lockedTokens = getATAAddressSync({
      mint: lockerData.tokenMint,
      owner: escrow
    });

    return this.sdk.provider.newTX([
      this.program.instruction.closeEscrow({
        accounts: {
          locker: this.locker,
          escrow,
          escrowOwner: authority,
          lockedTokens,
          fundsReceiver: this.walletKey,
          tokenProgram: TOKEN_PROGRAM_ID
        }
      })
    ]);
  }

  async castVote(
    proposal: PublicKey,
    side: VoteSide,
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const [escrow] = await findEscrowAddress(this.locker, authority);
    const { voteKey, instruction } = await this.governor.getOrCreateVote({
      proposal,
      voter: authority,
      payer: this.walletKey
    });
    return this.sdk.provider.newTX(
      [
        instruction,
        this.program.instruction.castVote(side, {
          accounts: {
            locker: this.locker,
            escrow,
            voteDelegate: authority,
            proposal,
            vote: voteKey,
            governor: this.governorKey,
            governProgram: VEHONEY_ADDRESSES.Govern
          }
        })
      ].filter((ix): ix is TransactionInstruction => !!ix)
    );
  }

  async activateProposal(
    proposal: PublicKey,
    authority: PublicKey = this.walletKey
  ): Promise<TransactionEnvelope> {
    const [escrow] = await findEscrowAddress(this.locker, authority);

    return this.sdk.provider.newTX([
      this.program.instruction.activateProposal({
        accounts: {
          locker: this.locker,
          governor: this.governorKey,
          proposal,
          escrow,
          escrowOwner: authority,
          governProgram: VEHONEY_ADDRESSES.Govern
        }
      })
    ]);
  }

  async calculateVotingPower(): Promise<BN> {
    const lockerData = await this.data();
    const escrowData = await this.fetchEscrowData();
    return calculateVotingPower(escrowData.data, lockerData.params);
  }

  async calculateClaimableAmount(
    receiptId: BN,
    currentTimestamp: number = Math.floor(Date.now() / 1_000),
    authority: PublicKey = this.walletKey
  ): Promise<BN> {
    const lockerData = await this.data();
    const receipt = await this.fetchReceipt(receiptId, authority);
    return calculateNFTReceiptClaimableAmount(
      receipt,
      lockerData.params,
      currentTimestamp
    );
  }

  async getOrCreateGovTokenATA(
    authority: PublicKey,
    escrow: PublicKey
  ): Promise<{
    walletToken: PublicKey;
    lockedToken: PublicKey;
    instructions: TransactionInstruction[];
  }> {
    const { provider } = this.sdk;
    const lockerData = await this.data();

    const { address: walletToken, instruction: ix1 } = await getOrCreateATA({
      provider,
      mint: lockerData.tokenMint,
      owner: authority,
      payer: authority
    });
    const { address: lockedToken, instruction: ix2 } = await getOrCreateATA({
      provider,
      mint: lockerData.tokenMint,
      owner: escrow,
      payer: authority
    });

    return {
      walletToken,
      lockedToken,
      instructions: [ix1, ix2].filter(
        (ix): ix is TransactionInstruction => !!ix
      )
    };
  }

  async fetchEscrowData(authority: PublicKey = this.walletKey) {
    const [pubkey] = await findEscrowAddress(this.locker, authority);
    const data = await this.program.account.escrow.fetch(pubkey);
    return { pubkey, data };
  }

  async fetchReceipt(receiptId: BN, authority: PublicKey = this.walletKey) {
    const [receipt] = await findNFTReceiptAddress(
      this.locker,
      authority,
      receiptId
    );
    return this.program.account.nftReceipt.fetch(receipt);
  }

  async fetchAllReceipts(authority: PublicKey = this.walletKey) {
    return this.program.account.nftReceipt.all([
      {
        memcmp: {
          offset: 16,
          bytes: this.locker.toBase58()
        }
      },
      {
        memcmp: {
          offset: 48,
          bytes: authority.toBase58()
        }
      }
    ]);
  }

  async newReceiptId(): Promise<BN> {
    const escrow = await this.fetchEscrowData();
    return escrow.data.receiptCount;
  }

  async fetchAllProofs() {
    return this.program.account.proof.all([
      {
        memcmp: {
          offset: 8,
          bytes: this.locker.toBase58()
        }
      }
    ]);
  }
}
