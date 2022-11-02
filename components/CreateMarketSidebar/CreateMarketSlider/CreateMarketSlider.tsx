import * as styles from './CreateMarketSlider.css';
import { FC } from 'react';
import { Slider } from 'antd';
import { vars } from '../../../styles/theme.css';
import c from 'classnames';
import { formatNumber } from '../../../helpers/format';
import { getPreparedLabels } from './utils';

interface CreateMarketSliderProps {
  currentValue: number;
  maxValue: number;
  maxSafeValue?: number;
  dangerValue?: number;
  onChange: (value: number) => void;
  minValue: number;
}

export const CreateMarketSlider: FC<CreateMarketSliderProps> = ({
  currentValue,
  maxValue,
  maxSafeValue,
  dangerValue,
  onChange,
  minValue
}) => {
  let labels: number[] = [];
  const currentPosition = currentValue;
  const isRisky = maxSafeValue && currentValue >= maxSafeValue;
  const isDanger = dangerValue && currentValue >= dangerValue;
  if (dangerValue && maxSafeValue) {
    labels = [maxSafeValue, dangerValue];
  }

  const riskColor = isDanger
    ? vars.colors.red
    : isRisky
    ? vars.colors.brownLight
    : vars.colors.green;

  const handleChange = (value: number) => {
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  return (
    <div className={styles.rangeContainer}>
      <div className={styles.sliderWrapper} style={{ width: `100%` }}>
        <div className={styles.sliderHeader.primary}>
          {formatNumber.formatPercentRounded(currentPosition, 0)}
        </div>
        <Slider
          tooltipVisible={false}
          className={c(styles.slider)}
          trackStyle={{
            background: riskColor
          }}
          handleStyle={{
            background: vars.colors.white,
            borderColor: riskColor,
            zIndex: 9
          }}
          value={currentValue}
          min={minValue}
          max={maxValue}
          onChange={handleChange}
          marks={getPreparedLabels({
            maxValue: maxValue,
            minValue: minValue,
            minPosition: minValue / 100,
            maxPosition: maxValue / 100,
            totalValue: 1,
            labels
          })}
        />
      </div>
    </div>
  );
};
