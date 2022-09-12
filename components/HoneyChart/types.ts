import {CSSProperties} from "react";

export interface Data<X, Y> {
  x: X;
  y: Y;
}

export type AnyData = Data<any, any>;

export type TimestampPoint = {
  epoch: number,
  value: number
}

type Datum = {
  _x: number;
  _y: number;
  x: number;
  y: number;
  binnedData: Data<number, number>[];
  startAngle: number;
  endAngle: number;
  padAngle: number;
};

type BarDatum = Datum & {
  dateFrom: number;
  dateTo: number;
  isLast: boolean;
}

export type Label = {
  index: number;
  datum: Datum;
  innerRadius: number;
  radius: number;
  cornerRadius: number;
  style: CSSProperties;
  x: number;
  y: number;
};

export type ChartBarLabel = Label & {
  datum: BarDatum;
};
