import { PublicKey } from '@solana/web3.js';
import config from '../../config';

export const HONEY_WADS = 1000000;

export const HONEY_MINT = new PublicKey(
  'HonyeYAaTPgKUgQpayL914P6VAqbQZPrbkGMETZvW4iN'
);

export const HONEY_DECIMALS = 6;

export const PHONEY_MINT = new PublicKey(
  'PHnyhLEnsD9SiP9tk9kHHKiCxCTPFnymzPspDqAicMe'
);

export const WHITELIST_ENTRY = new PublicKey(
  'EAc9qa3DXCgBwSEjRkXGZxPUmvuNTV56zfYzbjihbiYv'
);

export const PHONEY_DECIMALS = 6;

export const PROPOSAL_TITLE_MAX_LEN = 140;

export const GOVERNOR_ADDRESS = new PublicKey(
  config.NEXT_PUBLIC_GOVERNOR_ADDRESS
);

export const HONEY_MINT_WRAPPER = new PublicKey(
  config.NEXT_PUBLIC_HONEY_MINT_WRAPPER
);
