import { SizeMeProps } from 'react-sizeme';

export type rawData = {
  x: number;
  y: number;
  label?: string;
};

export type HoneyLineChartProps = {
  data: rawData[];
  size: SizeMeProps['size'];
  color?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
};
