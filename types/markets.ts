import { ColumnType } from 'antd/lib/table';
import { PublicKey } from '@solana/web3.js';
import { MarketBundle } from '@honey-finance/sdk';

export type MarketTableRow = {
  allowance: number;
  available: number;
  connection: any;
  debt: number;
  id: string;
  key: string;
  name: string;
  currencyName: string;
  rate: number;
  user: any;
  utilizationRate: number;
  value: number;
  openPositions: Array<MarketTablePosition>; 
  positions: Array<MarketTablePosition>;
  stats?: any;
  risk?: number;
  liquidationThreshold?: number;
  totalDebt?: number;
  tvl?: number;
  liqThreshold?: any;
  untilLiquidation?: number;
  verifiedCreator: string;
  nftPrice?: number;
  userDebt?: number;
  ltv?: number;
  userTotalDeposits?: number;
  constants: {
    marketId: string;
    verifiedCreator: string;
    marketName: string;
    marketImage: string;
    discountedMarket: boolean;
  }
  marketData?: Array<MarketBundle>;
};

export type MarketTablePosition = {
  image?: string;
  mint?: PublicKey;
  name?: string;
  symbol?: string;
  updateAuthority?: PublicKey;
  uri?: string;
  nftPrice?: number;
  userDebt?: number;
  ltv?: number;
  allowance?: number;
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

// export type BorrowSidebarMode = 'market' | 'new_market';

export enum BorrowSidebarMode {
  MARKET = 'market',
  CREATE_MARKET = 'create_market'
}
