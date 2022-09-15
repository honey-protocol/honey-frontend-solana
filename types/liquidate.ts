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
  riskLvl: number;
  untilLiquidation: number;
  debt: number;
  estimatedValue: number;
};