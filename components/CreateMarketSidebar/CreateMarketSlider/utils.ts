import { formatNumber } from '../../../helpers/format';
import {SliderMarks} from "antd/es/slider";
const { formatPercentRounded: fpr } = formatNumber;

type PreparedLabelType = {
  [key: number]: SliderMarks
}

export interface GetPreparedLabelsProps {
  maxValue: number;
  minValue: number;
  minPosition: number;
  maxPosition: number;
  totalValue:number;
  labels: number[];
}

const getShiftPositionLabels = (label: number, minPosition: number, maxPosition: number) => {
  if ((maxPosition * 100) - label < 15) {
    return {transform: `translateX(-25px)`}
  } else if (label - minPosition * 100 < 10) {
    return {transform: `translateX(5px)`}
  }
  else return {}
}

export const getPreparedLabels = ({maxValue, minValue, minPosition, maxPosition, totalValue, labels} : GetPreparedLabelsProps) => {
  const preparedLabels: PreparedLabelType = {};
  preparedLabels[minValue] = {
    label : fpr(minPosition * 100, 0),
    style: {transform: 'translateX(1px)'}}

  preparedLabels[maxValue] = {
    label : fpr(maxPosition * 100, 0),
    style: {transform: 'translateX(-25px)'}}

  if (labels.length) {
    labels.map((label:number) => {
      const valueLabelPosition = label * totalValue / 100;
      preparedLabels[valueLabelPosition] = {
        label: fpr(label, 0),
        style: getShiftPositionLabels(label, minPosition, maxPosition)}
    })
  }
  return preparedLabels
}