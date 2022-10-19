export interface RiskLvlProps {
  riskLvl: number;
}

export enum RiskLvlPoint {
  Safe = 0,
  Warning = 30,
  Danger = 45,
  Max = 100,
}
