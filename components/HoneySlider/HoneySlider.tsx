import * as styles from './HoneySlider.css';
import { FC } from 'react';
import { Slider } from 'antd';
import { vars } from '../../styles/theme.css';
import c from 'classnames';
import { formatNumber } from '../../helpers/format';
import { getPositionedLabels } from './utlls';

interface HoneySliderProps {
  maxValue: number;
  minAvailable?: number;
  currentValue: number;
  onChange: (value: number) => void;
  maxSafePosition?: number;
  maxAvailablePosition?: number;
  labels?: number[];
  isReadonly?: boolean;
}

const { formatPercent: fp, formatUsd: fu } = formatNumber;

export const HoneySlider: FC<HoneySliderProps> = ({
  maxValue,
  minAvailable = 0,
  currentValue,
  onChange,
  maxSafePosition = 1,
  maxAvailablePosition = 1,
  labels = [],
  isReadonly
}) => {
  const minAvailablePosition = minAvailable / maxValue;
  const unavailablePosition = 1 - maxAvailablePosition;
  const availablePosition = 1 - minAvailablePosition - unavailablePosition;

  const maxAvailable = maxValue * maxAvailablePosition;
  const currentSliderValue =
    (currentValue / (maxValue * maxAvailablePosition - minAvailable)) * 100;

  const isRisky = (currentValue + minAvailable) / maxValue > maxSafePosition;

  const handleChange = (value: number) => {
    if (isReadonly) return
    const newBorrowValue = ((maxAvailable - minAvailable) * value) / 100;
    onChange(newBorrowValue);
  };

  const preparedLabels = isReadonly ? undefined : getPositionedLabels({
    lastLabelValue: maxAvailablePosition,
    maxLeftSliderValue: minAvailable,
    maxValue,
    labels
  });

  return (
    <div className={styles.rangeContainer}>
      <div
        className={styles.sliderWrapper}
        style={{
          width: `${fp(
            minAvailablePosition < 0.1 ? 10 : minAvailablePosition * 100
          )}`,
          display: minAvailable ? 'inherit' : 'none'
        }}
      >
        {!isReadonly && <div className={styles.sliderHeader.primary}>$ {minAvailable}</div>}
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
          marks={preparedLabels?.left}
        />
      </div>
      <div
        className={styles.sliderWrapper}
        style={{ width: `${availablePosition * 100}%` }}
      >
        {!isReadonly && <div className={styles.sliderHeader.secondary}>
          {fu(maxValue * maxAvailablePosition)}
        </div>}
        <Slider
          tooltipVisible={false}
          className={styles.slider}
          trackStyle={{
            background: isRisky ? vars.colors.brownLight : vars.colors.green
          }}
          handleStyle={isReadonly ? { display: 'none' } : {
            background: vars.colors.white,
            borderColor: isRisky ? vars.colors.brownLight : vars.colors.green,
            zIndex: 9
          }}
          value={currentSliderValue}
          onChange={handleChange}
          marks={preparedLabels?.center}
        />
      </div>
      {unavailablePosition > 0 && (
        <div
          className={styles.sliderWrapper}
          style={{ width: `${unavailablePosition * 100}%` }}
        >
          {!isReadonly && <div className={styles.sliderHeader.secondary}>{fu(maxValue)}</div>}
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
