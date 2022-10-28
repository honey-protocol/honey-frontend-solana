import { BN } from '@project-serum/anchor';
import { PublicKey, TransactionEnvelope } from '@saberhq/solana-contrib';
import { SystemProgram, TransactionInstruction } from '@solana/web3.js';

import { PoolInfo, StakeProgram } from '../../programs';
import { VeHoneySDK } from '../../sdk';
import { findPoolUserAddress } from './pda';

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

  async deposit(): Promise<TransactionEnvelope> {
    return this.sdk.provider.newTX();
  }

  async claim(): Promise<TransactionEnvelope> {
    return this.sdk.provider.newTX();
  }

  async vest(): Promise<TransactionEnvelope> {
    return this.sdk.provider.newTX();
  }

  async calculateClaimableAmount(now: Date = new Date()): Promise<BN> {
    return new BN(0);
  }
}
