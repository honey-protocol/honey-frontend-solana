export interface HealthLvlProps {
  healthLvl: number;
}

export enum HealthLvlPoint {
  Safe = 100,
  Warning = 70,
  Danger = 40,
  Min = 0
}
