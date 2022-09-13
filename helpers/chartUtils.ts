import {TimestampPoint} from "../components/HoneyChart/types";


export const generateMockHistoryData = (from: number, to: number): TimestampPoint[] => {
  let current = from;
  const result = [];

  while (current <= to) {
    result.push({
      epoch: current,
      value: Math.random(),
    });
    current += 1 * 60 * 60 * 1000;
  }

  return result;
};

