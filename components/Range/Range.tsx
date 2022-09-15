import * as styles from './Range.css';
import { FC } from 'react';
import { Slider } from 'antd';
import { vars } from '../../styles/theme.css';
import c from 'classnames';
import { formatNumber } from '../../helpers/format';

interface RangeProps {
  maxValue: number;
  borrowedValue: number;
  currentValue: number;
  onChange: (value: number) => void;
  maxSafePosition?: number;
  maxAvailablePosition?: number;
}

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

export const Range: FC<RangeProps> = ({
  maxValue,
  borrowedValue,
  currentValue,
  onChange,
  maxSafePosition,
  maxAvailablePosition = 1
}) => {
  const borrowedRatio = borrowedValue / maxValue;
  const unavailableRatio = 1 - maxAvailablePosition;
  const availableRatio = 1 - borrowedRatio - unavailableRatio;

  const isRisky = maxSafePosition && currentValue / maxValue > maxSafePosition;
  const currentSliderValue =
    ((currentValue - borrowedValue) / (maxValue * maxAvailablePosition)) * 100;

  const handleChange = (value: number) => {
    const newBorrowValue =
      (maxValue * maxAvailablePosition - borrowedValue) * (value / 100) +
      borrowedValue;
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
            isRisky
              ? styles.enabledWarningBackgroundSlider
              : styles.enabledBackgroundSlider
          )}
          handleStyle={{ display: 'none' }}
          trackStyle={{
            backgroundColor: isRisky
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
          {fu(maxValue * maxAvailablePosition)}
        </div>
        <Slider
          tooltipVisible={false}
          className={styles.slider}
          trackStyle={{
            background: isRisky ? vars.colors.brownLight : vars.colors.green
          }}
          handleStyle={{
            background: vars.colors.white,
            borderColor: isRisky ? vars.colors.brownLight : vars.colors.green,
            zIndex: 9
          }}
          value={currentSliderValue}
          onChange={handleChange}
          marks={{
            0: `${borrowedRatio * 100}%`,
            100: `${maxAvailablePosition * 100}%`
          }}
        />
      </div>
      {unavailableRatio > 0 && (
        <div
          className={styles.sliderWrapper}
          style={{ width: `${unavailableRatio * 100}%` }}
        >
          <div className={styles.sliderHeader.secondary}>{fu(maxValue)}</div>
          <Slider
            className={c(styles.slider, styles.disabledBackgroundSlider)}
            handleStyle={{ display: 'none' }}
            disabled
          />
        </div>
      )}
    </div>
  );
};
