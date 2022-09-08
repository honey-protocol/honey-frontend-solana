export type MarketTableRow = {
  key: string;
  name: string;
  rate: number;
  available: number;
  value: number;
  tokens: Array<MarketTableToken>;
};

export type MarketTableToken = {
  name: string;
  riskLvl: number;
  debt: number;
  available: number;
  value: number;
};
