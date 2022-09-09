export type MarketTableRow = {
  key: string;
  name: string;
  rate: number;
  available: number;
  value: number;
  positions: Array<MarketTablePosition>;
};

export type MarketTablePosition = {
  name: string;
  riskLvl: number;
  debt: number;
  available: number;
  value: number;
};
