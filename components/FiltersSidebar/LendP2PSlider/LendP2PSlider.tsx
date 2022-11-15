import * as styles from './LendP2PSlider.css';
import { FC, useEffect, useState } from 'react';
import { Slider } from 'antd';
import { vars } from '../../../styles/theme.css';
import { formatNumber } from '../../../helpers/format';
import { getPositionedLabels } from '../../HoneySlider/utlls';
import { LendP2PSliderProps } from './types';

const { formatUsd: fusd, formatPercentRounded: fpr } = formatNumber;

export const LendP2PSlider: FC<LendP2PSliderProps> = ({
  currentValue,
  maxValue,
  onChange,
  minValue,
  labelsFormatter
}) => {
  const [handleValue, setHandleVale] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    onChange([
      maxValue * (handleValue[0] / 100),
      maxValue * (handleValue[1] / 100)
    ]);
  }, [handleValue]);

  const defaultFormatter = (value: number) => {
    return value.toString();
  };

  const formatLabel = (value: number): string => {
    if (typeof labelsFormatter === 'function') {
      return labelsFormatter(value);
    }
    return defaultFormatter(value);
  };

  const getLabels = () => {
    return {
      0: {
        label: formatLabel(minValue),
        style: { transform: 'translateX(-5%)' }
      },
      100: {
        label: formatLabel(maxValue),
        style: {
          transform: 'translateX(-90%)'
        }
      }
    };
  };
  return (
    <div className={styles.rangeContainer}>
      <div className={styles.sliderWrapper} style={{ width: `100%` }}>
        <div className={styles.sliderHeaderWrapper}>
          <div className={styles.sliderHeader.primary}>
            {formatLabel(currentValue[0])}
          </div>
          <div className={styles.sliderHeader.secondary}>
            {formatLabel(currentValue[1])}
          </div>
        </div>
        <Slider
          range
          tooltipVisible={false}
          className={styles.slider}
          trackStyle={[
            {
              background: vars.colors.green
            }
          ]}
          handleStyle={[
            {
              background: vars.colors.white,
              borderColor: vars.colors.green
            },
            {
              background: vars.colors.white,
              borderColor: vars.colors.green
            }
          ]}
          value={handleValue}
          onChange={setHandleVale}
          marks={getLabels()}
        />
      </div>
    </div>
  );
};
