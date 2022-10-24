import { PublicKey } from '@solana/web3.js';

export type LiquidateTableRow = {
  key: string;
  name: string;
  risk: number;
  liqThreshold: number;
  totalDebt: number;
  tvl: number;
  positions: Array<LiquidateTablePosition>;
};

export type LiquidateTablePosition = {
  name: string;
  healthLvl: number;
  untilLiquidation: number;
  debt: number;
  estimatedValue: number;
  nftMint: PublicKey;
  owner: PublicKey;
  obligation: string;
  highestBid: number;
};

export type BiddingPosition = {
  bid: string;
  bidLimit: string;
  bidder: string;
};
