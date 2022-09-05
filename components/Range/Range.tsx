import * as styles from './Range.css';
import { FC } from 'react';
import { Slider } from 'antd';
import { vars } from '../../styles/theme.css';
import c from 'classnames';
import { LTV } from '../../constants/loan';
import { formatNumber } from '../../helpers/format';

interface RangeProps {
  estimatedValue: number;
  borrowedValue: number;
  currentValue: number;
  onChange: (value: number) => void;
}

const MAX_SAFE_LTV = 1;
const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

export const Range: FC<RangeProps> = ({
  estimatedValue,
  borrowedValue,
  currentValue,
  onChange
}) => {
  const borrowedRatio = borrowedValue / estimatedValue;
  const unavailableRatio = 1 - LTV;
  const availableRatio = 1 - borrowedRatio - unavailableRatio;

  const isBeyondLimit = currentValue / estimatedValue > MAX_SAFE_LTV;
  const currentSliderValue =
    ((currentValue - borrowedValue) / (estimatedValue * LTV)) * 100;

  const handleChange = (value: number) => {
    const newBorrowValue =
      (estimatedValue * LTV - borrowedValue) * (value / 100) + borrowedValue;
    onChange(newBorrowValue);
  };

  return (
    <div className={styles.rangeContainer}>
      <div
        className={styles.sliderWrapper}
        style={{
          width: `${fp(borrowedRatio < 0.1 ? 10 : borrowedRatio * 100)}`,
          display: borrowedValue ? 'inherit' : 'none'
        }}
      >
        <div className={styles.sliderHeader.primary}>$ {borrowedValue}</div>
        <Slider
          className={c(
            styles.slider,
            isBeyondLimit
              ? styles.enabledWarningBackgroundSlider
              : styles.enabledBackgroundSlider
          )}
          handleStyle={{ display: 'none' }}
          trackStyle={{
            backgroundColor: isBeyondLimit
              ? vars.colors.brownLight
              : vars.colors.green
          }}
          value={100}
          marks={{ 0: '0%', 50: `${(borrowedRatio * 100) / 2}%` }}
        />
      </div>
      <div
        className={styles.sliderWrapper}
        style={{ width: `${availableRatio * 100}%` }}
      >
        <div className={styles.sliderHeader.secondary}>
          {fu(estimatedValue * LTV)}
        </div>
        <Slider
          tooltipVisible={false}
          className={styles.slider}
          trackStyle={{
            background: isBeyondLimit
              ? vars.colors.brownLight
              : vars.colors.green
          }}
          handleStyle={{
            background: vars.colors.white,
            borderColor: isBeyondLimit
              ? vars.colors.brownLight
              : vars.colors.green,
            zIndex: 9
          }}
          value={currentSliderValue}
          onChange={handleChange}
          marks={{ 0: `${borrowedRatio * 100}%`, 100: `${LTV * 100}%` }}
        />
      </div>
      <div
        className={styles.sliderWrapper}
        style={{ width: `${unavailableRatio * 100}%` }}
      >
        <div className={styles.sliderHeader.secondary}>
          {fu(estimatedValue)}
        </div>
        <Slider
          className={c(styles.slider, styles.disabledBackgroundSlider)}
          handleStyle={{ display: 'none' }}
          disabled
        />
      </div>
    </div>
  );
};
