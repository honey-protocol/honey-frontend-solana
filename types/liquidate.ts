import { PublicKey } from '@solana/web3.js';
import { MarketTableRow } from './markets';

export type LiquidateTableRow = {
  key: string;
  name: string;
  loanCurrency: string;
  risk: number;
  liqThreshold: number;
  totalDebt: number;
  tvl: number;
  positions: Array<LiquidateTablePosition>;
  stats?: any;
  liquidationThreshold?: number;
  allowance?: number;
  available?: number;
  connection?: any;
  debt?: number;
  id?: string;
  rate?: number;
  user?: any;
  utilizationRate?: number;
  value?: number;
  openPositions: Array<MarketTableRow>;
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
  count: number;
};

export type BiddingPosition = {
  bid: string;
  bidLimit: string;
  bidder: string;
};
