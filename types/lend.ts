import { TimestampPoint } from "../components/HoneyChart/types";
import { MarketBundle } from '@honey-finance/sdk';
export type LendTableRow = {
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
  stats?: any;
  risk?: number;
  liquidationThreshold?: number;
  totalDebt?: number;
  tvl?: number;
  liqThreshold?: any;
  untilLiquidation?: number;
  verifiedCreator?: string;
  constants?: {
    marketId: string;
    verifiedCreator: string;
    marketName: string;
    marketImage: string;
    discountedMarket: boolean;
  }
  marketData?: Array<MarketBundle>;
};