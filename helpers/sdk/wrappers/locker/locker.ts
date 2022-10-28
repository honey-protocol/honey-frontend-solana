import {
  SystemProgram,
  TransactionInstruction,
  SYSVAR_INSTRUCTIONS_PUBKEY
} from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { PublicKey, TransactionEnvelope } from '@saberhq/solana-contrib';
import { GovernorWrapper, TribecaSDK } from '@tribecahq/tribeca-sdk';

import { LockerData, LockerProgram } from '../../programs';
import { VeHoneySDK } from '../../sdk';
import { findEscrowAddress } from './pda';
import { getOrCreateATA, TOKEN_PROGRAM_ID } from '@saberhq/token-utils';

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
}
