import { Connection } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { SolanaProvider, PublicKey } from '@saberhq/solana-contrib';
import { TribecaSDK } from '@tribecahq/tribeca-sdk';

import { ClientBase } from './base';

export class GovernClient {
  provider!: SolanaProvider;
  sdk!: TribecaSDK;

  constructor(readonly connection: Connection, readonly wallet: anchor.Wallet) {
    this.provider = SolanaProvider.init({
      connection,
      wallet,
      opts: {
        commitment: 'confirmed'
      }
    });
    this.sdk = TribecaSDK.load({ provider: this.provider });
  }
}
