import { PublicKey } from '@solana/web3.js';

export const HONEY_WADS = 1000000;

export const HONEY_MINT = new PublicKey(process.env.NEXT_PUBLIC_HONEY_MINT);

export const HONEY_DECIMALS = 6;

export const PHONEY_MINT = new PublicKey("PHnyhLEnsD9SiP9tk9kHHKiCxCTPFnymzPspDqAicMe");

export const WHITELIST_ENTRY = new PublicKey(process.env.NEXT_PUBLIC_WHITELIST_ENTRY);

export const PHONEY_DECIMALS = 6;
