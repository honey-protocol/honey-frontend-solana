import { PublicKey } from '@solana/web3.js';
import config from '../../config';

export const HONEY_WADS = 1000000;

export const HONEY_MINT = new PublicKey(config.NEXT_PUBLIC_HONEY_MINT);

export const HONEY_DECIMALS = 6;

export const PHONEY_MINT = new PublicKey(config.NEXT_PUBLIC_PHONEY_MINT);

export const WHITELIST_ENTRY = new PublicKey(
  'G62oYbYUbchjHMRddcFaDqRQ5CuNV9KE36kfzyYvFuDy'
);

export const WL_TOKEN_MINT = new PublicKey(config.NEXT_PUBLIC_WL_TOKEN_MINT);

export const PHONEY_DECIMALS = 6;

export const PROPOSAL_TITLE_MAX_LEN = 140;

export const GOVERNOR_ADDRESS = new PublicKey(
  config.NEXT_PUBLIC_GOVERNOR_ADDRESS
);

export const HONEY_MINT_WRAPPER = new PublicKey(
  config.NEXT_PUBLIC_HONEY_MINT_WRAPPER
);

export const STAKE_PROGRAM_ID = new PublicKey(
  config.NEXT_PUBLIC_STAKE_PROGRAM_ID
);

export const VOTER_PROGRAM_ID = new PublicKey(
  config.NEXT_PUBLIC_VOTER_PROGRAM_ID
);
