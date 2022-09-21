import { formatNumber } from '../../helpers/format';
import {SliderMarks} from "antd/es/slider";
const { formatPercentRounded: fpr } = formatNumber;

type PreparedLabelType = {
  left: Record<number, SliderMarks>
  center: Record<number, SliderMarks>
}

export const getPositionedLabels = ({
  lastLabelValue,
  maxLeftSliderValue,
  maxValue,
  labels
}: {
  lastLabelValue: number;
  maxLeftSliderValue: number;
  maxValue: number;
  labels: number[]
}) => {
  const getLabelPosition = (globalPosition: number, max: number) => {
    return Math.round(globalPosition / max);
  };

  let renderLabels = labels;

  if (!labels.length) {
    const autoLabels = [];
    const labelsStep = 0.2;
    let currentLabel = 0;
    while (currentLabel < lastLabelValue) {
      autoLabels.push(currentLabel * 100);
      currentLabel += labelsStep;
    }
    autoLabels.push(lastLabelValue * 100)

    renderLabels = autoLabels
  }

  const leftSliderPart = maxLeftSliderValue / maxValue;

  const preparedLabels: PreparedLabelType = {
    left: {},
    center: {}
  };
  renderLabels.forEach(label => {
    const labelPart = label / 100;
    if (maxLeftSliderValue && labelPart <= leftSliderPart) {
      preparedLabels.left[getLabelPosition(label, leftSliderPart)] = {
        style: labelPart === 0 ? { transform: 'none !important' } : {},
        label: fpr(0)
      };
    }
    if (labelPart > leftSliderPart && labelPart <= lastLabelValue) {
      if (!maxLeftSliderValue) {
        preparedLabels.center[0] = {
          style: { left: '-6px', transform: 'none !important' },
          label: fpr(0)
        };
      }
      const labelWithShift = label - leftSliderPart * 100;
      const maxPositionWithShift = lastLabelValue - leftSliderPart;
      const labelPosition = getLabelPosition(
        labelWithShift,
        maxPositionWithShift
      );
      preparedLabels.center[labelPosition] = {
        style: labelPosition === 100 ? {
          left: 'initial',
          right: '0',
          transform: 'initial',
        } : {},
        label: fpr(label)
      };
    }
  });

  return preparedLabels;
};
