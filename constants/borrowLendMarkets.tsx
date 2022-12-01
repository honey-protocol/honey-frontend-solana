import { Connection, PublicKey } from '@solana/web3.js';
import { MarketTableRow } from 'types/markets';
import { registry } from '../honey-market-registry/registry';

// type for open positions
export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
};
// collection structure for liquidations
export const liquidationCollections: MarketTableRow[] =
  registry as MarketTableRow[];

// collection structure for the markets
export const marketCollections: MarketTableRow[] = registry as MarketTableRow[];
// fees
export const COLLATERAL_FACTOR = 0.65;
export const BORROW_FEE = 0;
