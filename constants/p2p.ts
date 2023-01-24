import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { P2PCollection } from 'types/p2p';

export const ORDER_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PROCESSED: 'processed',
  DEFAULTED: 'defaulted'
};

export const ONE_DAY_MS = 86400000;
export const ONE_DAY_IN_SECONDS = 86400;
export const FOUR_HRS_IN_MS = 14400000;

export const METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

export const SOL_TOKEN = new PublicKey(
  'So11111111111111111111111111111111111111112'
);

export const USDC_TOKEN = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
);

export const LOAN_CURRENCY_TOKEN = new PublicKey(
  'So11111111111111111111111111111111111111112'
);

export const LOAN_CURRENCY_LAMPORTS =
  LOAN_CURRENCY_TOKEN.toBase58() === USDC_TOKEN.toBase58() // Set lamports/decimals for USDC
    ? 1000000
    : LAMPORTS_PER_SOL; // Default to SOL

//Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr

export const HONEY_P2P_PROGRAM = new PublicKey(
  'CdrpDgFwTYSzHzUXSVN2MMXyXwm7ESDAjyFPprNU77p4' // updated program id for fixed double borrow request
);

export const FEATURED_COLLECTIONS: P2PCollection[] = [
  {
    name: 'Honey Genesis',
    imageUrl: 'https://i.imgur.com/aDEvZgO.png',
    total: Math.random() * 1000,
    items: Math.random() * 1000,
    requested: Math.random(),
    tag: `#Utility`,
    verified: true,
    id: 'honeyGenBees',
    verifiedCreator: '6vRx1iVZo3xfrBHdpvuwArL2jucVj9j9nLpd2VUTTGMG'
  },
  {
    name: 'Honey Genesis',
    imageUrl: 'https://i.imgur.com/aDEvZgO.png',
    total: Math.random() * 1000,
    items: Math.random() * 1000,
    requested: Math.random(),
    tag: `#Utility`,
    verified: true,
    id: 'honeyGenBees',
    verifiedCreator: '6vRx1iVZo3xfrBHdpvuwArL2jucVj9j9nLpd2VUTTGMG'
  }
];
