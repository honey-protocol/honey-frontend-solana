import { PublicKey } from '@solana/web3.js';
import {
  GovernProgram,
  TRIBECA_ADDRESSES,
  GovernJSON as GovernIDL
} from '@tribecahq/tribeca-sdk';

import config from '../../config';
import { LockerProgram, StakeProgram } from './programs';
import { IDL as StakeIDL } from '../types/stake';
import { IDL as LockerIDL } from '../types/ve_honey';

export interface VeHoneyPrograms {
  Stake: StakeProgram;
  Locker: LockerProgram;
  Govern: GovernProgram;
}

export const VEHONEY_ADDRESSES = {
  Stake: new PublicKey(config.NEXT_PUBLIC_STAKE_PROGRAM_ID),
  Locker: new PublicKey(config.NEXT_PUBLIC_VOTER_PROGRAM_ID),
  Govern: TRIBECA_ADDRESSES.Govern
};

export const VEHONEY_IDLS = {
  Stake: StakeIDL,
  Locker: LockerIDL,
  Govern: GovernIDL
};

export const HONEY_WADS = 1000000;
export const HONEY_DECIMALS = 6;
export const PHONEY_DECIMALS = 6;
export const PROPOSAL_TITLE_MAX_LEN = 140;

export const HONEY_MINT = new PublicKey(config.NEXT_PUBLIC_HONEY_MINT);
export const PHONEY_MINT = new PublicKey(config.NEXT_PUBLIC_PHONEY_MINT);
export const WL_TOKEN_MINT = new PublicKey(config.NEXT_PUBLIC_WL_TOKEN_MINT);

export const WHITELIST_ENTRY = new PublicKey(
  config.NEXT_PUBLIC_WHITELIST_ENTRY
);
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
export const NFT_PROOF_ADDRESS = new PublicKey(
  config.NEXT_PUBLIC_NFT_PROOF_ADDRESS
);

export const POOL_USER_SEED = 'PoolUser';
export const TOKEN_VAULT_SEED = 'TokenVault';
export const VAULT_AUTHORITY_SEED = 'VaultAuthority';

export const ESCROW_SEED = 'Escrow';
export const WHITELIST_ENTRY_SEED = 'LockerWhitelistEntry';
export const PROOF_SEED = 'Proof';
export const TREASURY_SEED = 'Treasury';
export const NFT_RECEIPT_SEED = 'Receipt';
