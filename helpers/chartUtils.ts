import { TimestampPoint } from '../components/HoneyChart/types';

export const generateMockHistoryData = (
  from: number,
  to: number,
  valMultiplier = 1
): TimestampPoint[] => {
  let current = from;
  const result = [];

  while (current <= to) {
    result.push({
      epoch: current,
      value: Math.random() * valMultiplier
    });
    current += 1 * 60 * 60 * 1000;
  }

  return result;
};
