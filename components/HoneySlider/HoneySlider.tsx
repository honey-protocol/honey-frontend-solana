import * as styles from './HoneySlider.css';
import { FC } from 'react';
import { Slider } from 'antd';
import { vars } from '../../styles/theme.css';
import c from 'classnames';
import { formatNumber } from '../../helpers/format';
import { getPositionedLabels } from './utlls';

// terms:
// value: absolute slider value [minValue, maxValue]
// position: slider position [0, 1]
interface HoneySliderProps {
  // current slider value
  currentValue: number;
  // start value of 'active' zone;
  // user cannot move lower that this
  minAvailableValue?: number;
  // max slider value
  maxValue: number;
  // if slider position goes bigger then this mark active zone as 'risky'
  maxSafePosition?: number;
  // max slder position user can set
  maxAvailablePosition?: number;
  // array of labels under the slider
  labels?: number[];
  // disable all user interactions and hide handels
  isReadonly?: boolean;
  // triggered if slider value changed
  onChange?: (value: number) => void;
}

const { formatPercent: fp, formatUsd: fu } = formatNumber;

export const HoneySlider: FC<HoneySliderProps> = ({
  maxValue,
  minAvailableValue = 0,
  currentValue,
  onChange,
  maxSafePosition = 1,
  maxAvailablePosition = 1,
  labels = [],
  isReadonly
}) => {
  const minAvailablePosition = minAvailableValue / maxValue;
  const unavailablePosition = 1 - maxAvailablePosition;
  const availablePosition = 1 - minAvailablePosition - unavailablePosition;

  const maxAvailable = maxValue * maxAvailablePosition;
  const currentSliderValue =
    (currentValue / (maxValue * maxAvailablePosition - minAvailableValue)) *
    100;

  const isRisky =
    (currentValue + minAvailableValue) / maxValue > maxSafePosition;

  const handleChange = (value: number) => {
    if (isReadonly) return;
    const newBorrowValue = ((maxAvailable - minAvailableValue) * value) / 100;
    if (typeof onChange === 'function') {
      onChange(newBorrowValue);
    }
  };

  const preparedLabels = isReadonly
    ? undefined
    : getPositionedLabels({
        lastLabelValue: maxAvailablePosition,
        maxLeftSliderValue: minAvailableValue,
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
          display: minAvailableValue ? 'inherit' : 'none'
        }}
      >
        {!isReadonly && (
          <div className={styles.sliderHeader.primary}>
            $ {minAvailableValue}
          </div>
        )}
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
        {!isReadonly && (
          <div className={styles.sliderHeader.secondary}>
            {fu(maxValue * maxAvailablePosition)}
          </div>
        )}
        <Slider
          tooltipVisible={false}
          className={styles.slider}
          trackStyle={{
            background: isRisky ? vars.colors.brownLight : vars.colors.green
          }}
          handleStyle={
            isReadonly
              ? { display: 'none' }
              : {
                  background: vars.colors.white,
                  borderColor: isRisky
                    ? vars.colors.brownLight
                    : vars.colors.green,
                  zIndex: 9
                }
          }
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
          {!isReadonly && (
            <div className={styles.sliderHeader.secondary}>{fu(maxValue)}</div>
          )}
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
