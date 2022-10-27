import { ColumnType } from 'antd/lib/table';
import { PublicKey } from '@solana/web3.js';

export type MarketTableRow = {
  allowance: number;
  available: number;
  connection: any;
  debt: number;
  id: string;
  key: string;
  name: string;
  rate: number;
  user: any;
  utilizationRate: number;
  value: number;
  positions: Array<MarketTablePosition>;
  stats?: any;
  risk?: number;
  liquidationThreshold?: number;
  totalDebt?: number;
  tvl?: number;
  openPositions?: any;
  liqThreshold?: any;
};

export type MarketTablePosition = {
  image?: string;
  mint?: PublicKey;
  name?: string;
  symbol?: string;
  updateAuthority?: PublicKey;
  uri?: string;
};

export type UserNFTs = {
  creators: [
    {
      address: string;
      share: number;
      verified: number;
    }
  ];
  image: string;
  mint: string;
  name: string;
  symbol: string;
  tokenId: string;
  updateAuthority: string;
};

export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
};

export interface HoneyTableColumnType<RecordType>
  extends ColumnType<RecordType> {
  hidden?: boolean;
}
