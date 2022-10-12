import { ColumnType } from 'antd/lib/table';

export type MarketTableRow = {
  key: string;
  name: string;
  rate: number;
  debt: number;
  allowance: number;
  available: number;
  value: number;
  positions: Array<MarketTablePosition>;
};

export type MarketTablePosition = {
  name: string;
  image?: string;
  riskLvl?: number;
  debt?: number;
  available?: number;
  value?: number;
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

export interface HoneyTableColumnType<RecordType>
  extends ColumnType<RecordType> {
  hidden?: boolean;
}
