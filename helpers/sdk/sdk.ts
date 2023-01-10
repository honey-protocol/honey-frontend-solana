import { Signer } from '@solana/web3.js';
import {
  AugmentedProvider,
  Provider,
  SolanaAugmentedProvider
} from '@saberhq/solana-contrib';
import { newProgramMap } from '@saberhq/anchor-contrib';

import { VeHoneyPrograms, VEHONEY_ADDRESSES, VEHONEY_IDLS } from './constant';

export class VeHoneySDK {
  constructor(
    readonly provider: AugmentedProvider,
    readonly programs: VeHoneyPrograms
  ) {}

  withSigner(signer: Signer): VeHoneySDK {
    return VeHoneySDK.load({ provider: this.provider.withSigner(signer) });
  }

  static load({ provider }: { provider: Provider }): VeHoneySDK {
    const programs: VeHoneyPrograms = newProgramMap<VeHoneyPrograms>(
      provider,
      VEHONEY_IDLS,
      VEHONEY_ADDRESSES
    );
    return new VeHoneySDK(new SolanaAugmentedProvider(provider), programs);
  }
}
