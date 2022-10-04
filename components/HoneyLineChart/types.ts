import { SizeMeProps } from 'react-sizeme';

export type TimestampPoint = {
  epoch: number;
  value: number;
};

export type HoneyLineChartProps = {
  data: TimestampPoint[];
  size: SizeMeProps['size'];
  color?: string;
};
