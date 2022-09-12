export type PeriodName = 'all' | 'six_month' | 'three_month' | 'one_month'
type PeriodNameConst = Record<string, PeriodName>;
export const PERIOD: PeriodNameConst = {
  one_month: 'one_month',
  three_month: 'three_month',
  six_month: 'six_month',
  all: 'all',
} as const;

export const HOUR = 1000 * 60 * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = MONTH * 12;
