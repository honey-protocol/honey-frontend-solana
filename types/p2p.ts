import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export enum P2PBorrowSidebarMode {
  NEW_BORROW = 'new_borrow',
  BORROW = 'borrow'
}

export enum PageMode {
  INITIAL_STATE = 'initial_state',
  CATEGORY_SELECTED = 'category_selected',
  COLLECTION_SELECTED = 'collection_selected'
}

export enum BorrowPageMode {
  NEW_BORROW = 'new_borrow',
  REPAY_BORROWED = 'repay_borrowed'
}

export interface P2PCollection {
  name: string;
  imageUrl: string;
  total: number;
  items: number;
  requested: number;
  tag: string;
  verified?: boolean;
  id: string;
  verifiedCreator: string;
}

export interface P2PPosition {
  name: string;
  imageUrl: string;
  collectionName: string;
  request: number;
  ir: number;
  total: number;
  end: number;
  start: number;
  walletAddress: string;
  verified?: boolean;
  borrowerTelegram?: string;
  borrowerDiscord?: string;
  tag?: string;
  address: string;
}

export type P2PLoan = {
  id: string;
  borrower: PublicKey;
  borrowerNftAccount: PublicKey;
  borrowerTokenAccount: PublicKey;
  bump: number;
  createdAt: BN;
  interest: BN;
  lender: PublicKey;
  lenderNftAccount: PublicKey;
  lenderTokenAccount: PublicKey;
  loanStartTime: BN;
  nftMetadata: PublicKey;
  nftMint: PublicKey;
  nftVault: PublicKey;
  nftVerifiedCreator: string;
  paidBackAt: BN;
  period: BN;
  requestedAmount: BN;
  status: boolean;
  tokenMint: PublicKey;
  vaultAuthority: PublicKey;
  vaultAuthorityBump: number;
  withdrewAt: BN;
};

export type P2PLoans = P2PLoan[];
