import { FOUR_HRS_IN_MS, ONE_DAY_MS } from 'constants/p2p';

type chartData = {
  day: string;
  rate: string | null;
};

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const date = new Date().getTime();

export const dailyXIntervals = [
  {
    name: weekday[new Date(date - 2 * ONE_DAY_MS).getDay()],
    value: date - 2 * ONE_DAY_MS
  },
  {
    name: weekday[new Date(date - ONE_DAY_MS).getDay()],
    value: date - ONE_DAY_MS
  },
  {
    name: weekday[new Date(date).getDay()],
    value: date
  },
  {
    name: weekday[new Date(date + ONE_DAY_MS).getDay()],
    value: date + ONE_DAY_MS
  },
  {
    name: weekday[new Date(date + 2 * ONE_DAY_MS).getDay()],
    value: date + 2 * ONE_DAY_MS
  }
];

// get intervals for x axis for first day
const getFirstDayFourHourXIntervals = () => {
  let results = [];
  for (let i = 0; i < 7; i++) {
    results.push({
      name: new Date(date + i * FOUR_HRS_IN_MS).getHours() + ':00',
      value: date + i * FOUR_HRS_IN_MS
    });
  }
  return results;
};

// get intervals for x axis after first day
const getFourHourlyXIntervals = () => {
  let results = [];
  for (let i = 0; i < 7; i++) {
    results.push({
      name: new Date(date - (6 - i) * FOUR_HRS_IN_MS).getHours() + ':00',
      value: date - (6 - i) * FOUR_HRS_IN_MS
    });
  }
  return results;
};

export const firstDayFourHourXIntervals = getFirstDayFourHourXIntervals();
export const fourHourlyXIntervals = getFourHourlyXIntervals();

export const getChartData = (
  interest: number,
  period: number,
  loanStartTime: number,
  xIntervals: { name: string; value: number }[]
) => {
  const p = Number(period) * 1000;

  const results: chartData[] = xIntervals.map((a, i) => {
    const timeElapsed: any = a.value - Number(loanStartTime) * 1000;
    return {
      day: a.name,
      rate:
        timeElapsed < 0 || timeElapsed > p
          ? null
          : timeElapsed < ONE_DAY_MS
          ? (interest * 0.3).toFixed(2)
          : (Number(interest) * (0.3 + (0.7 * timeElapsed) / p)).toFixed(2)
    };
  });

  return results;
};
