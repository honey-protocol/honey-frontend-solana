import * as styles from './RepayP2PSlider.css';
import { FC } from 'react';
import { Slider } from 'antd';
import { vars } from '../../../styles/theme.css';
import { formatNumber } from '../../../helpers/format';
import { getPositionedLabels } from '../../HoneySlider/utlls';
import { RepayP2PSliderProps } from "../types";


const { formatUsd: fusd } = formatNumber;

export const RepayP2PSlider: FC<RepayP2PSliderProps> = ({
    currentValue,
    maxValue,
    onChange,
    minValue
  }) => {
  const handleChange = (value: number) => {
    console.log(value, 'value')
    onChange(value)
  };

  const preparedLabels =
    getPositionedLabels({
      lastLabelValue: 1,
      maxLeftSliderValue: minValue / 100,
      maxValue,
      step: 0.2
    });

  return (
    <div className={styles.rangeContainer}>
      <div
        className={styles.sliderWrapper}
        style={{ width: `100%` }}
      >
        <div className={styles.sliderHeaderWrapper}>
          <div className={styles.sliderHeader.primary}>
            {fusd(currentValue)}
          </div>
          <div className={styles.sliderHeader.secondary}>
            {fusd(maxValue)}
          </div>
        </div>
        <Slider
          tooltipVisible={false}
          className={styles.slider}
          trackStyle={{
            background: vars.colors.green
          }}
          handleStyle={
            {
              background: vars.colors.white,
              borderColor: vars.colors.green,
            }
          }
          max={maxValue}
          min={minValue}
          value={currentValue}
          onChange={handleChange}
          marks={preparedLabels?.center}
        />
      </div>
    </div>
  );
};
