import * as styles from './BorrowPositionCardSlider.css';
import { FC } from 'react';
import { Slider } from 'antd';
import { formatNumber } from '../../helpers/format';
import c from "classnames";
import { vars } from "../../styles/theme.css";

interface BorrowPositionCardSliderProps {
    debt: number;
    collateralValue: number;
    liquidationThreshold: number;
    maxLoanToValue: number;
}

export const BorrowPositionCardSlider: FC<BorrowPositionCardSliderProps> = ({
      debt,
      collateralValue,
      liquidationThreshold,
      maxLoanToValue,
  }) => {
    const riskLevel = debt / collateralValue
    const maxAvailableValue = maxLoanToValue - riskLevel
    const safeZone = liquidationThreshold - maxLoanToValue
    const liquidateZone = 1 - safeZone - maxAvailableValue - riskLevel

    const isLiquidate = riskLevel > liquidationThreshold

    const maxAvailablePrice = (collateralValue * maxLoanToValue) - debt

    return (
      <div className={styles.rangeContainer}>
        {isLiquidate ? (
          <>
            <div
              className={styles.sliderWrapper}
              style={{ width: `${riskLevel * 100}%`}}
            >
              <div className={styles.sliderHeader.primary} style={{color: vars.colors.red}}>
                {`${formatNumber.formatPercentRounded(riskLevel * 100, 0)}`}
              </div>
              <Slider
                className={c(
                  styles.slider, styles.disabledBackgroundSlider
                )}
                value={100}
                handleStyle={{display: 'none'}}
                trackStyle={{
                  backgroundColor: vars.colors.red
                }}
              />
            </div>

            <div
              className={styles.sliderWrapper}
              style={{ width: `${liquidateZone * 100}%` }}
            >
              <div className={styles.sliderHeader.primary}>{`${ formatNumber.formatPercentRounded(liquidationThreshold * 100, 0)}`}</div>
              <Slider
                className={c(
                  styles.slider, styles.disabledBackgroundSlider
                )}
                value={100}
                handleStyle={{display: 'none'}}
                disabled
              />
            </div>
          </>
          ) : (
            <>
              <div
                className={styles.sliderWrapper}
                style={{ width: `${riskLevel * 100}%`}}
              >
                <div className={styles.sliderHeader.primary} style={{color: vars.colors.green}}>
                  {`${formatNumber.formatPercentRounded(riskLevel * 100, 0)}`}
                </div>
                <Slider
                  className={c(
                    styles.slider, styles.disabledBackgroundSlider
                  )}
                  value={100}
                  handleStyle={{display: 'none'}}
                  trackStyle={{
                    backgroundColor: vars.colors.green
                  }}
                />
              </div>
              { maxAvailableValue > 0 &&
                  <div
                  className={styles.sliderWrapper}
                  style={{ width: `${maxAvailableValue * 100}%` }}
              >
                  <div className={styles.sliderHeader.availableValue}>
                    { formatNumber.formatUsd(maxAvailablePrice)}
                  </div>
                  <Slider
                      className={c(
                        styles.slider, styles.disabledBackgroundSlider
                      )}
                      value={100}
                      handleStyle={{display: 'none'}}
                      trackStyle={{
                        backgroundColor: vars.colors.black
                      }}
                  />
              </div> }

              <div
                className={styles.sliderWrapperSafeZone}
                style={{ width: `${safeZone * 100}%` }}
              >
                <div className={styles.sliderHeader.secondary}>
                  {' '}
                </div>
                <Slider
                  className={c(
                    styles.slider, styles.disabledBackgroundSlider
                  )}
                  value={100}
                  handleStyle={{display: 'none'}}
                  trackStyle={{
                    backgroundColor: vars.colors.grayMiddle
                  }}
                />
              </div>
              <div
                className={styles.sliderWrapper}
                style={{ width: `${liquidateZone * 100}%` }}
              >
                <div className={styles.sliderHeader.primary}>{`${formatNumber.formatPercentRounded(liquidationThreshold * 100, 0)}`}</div>
                <Slider
                  className={c(
                    styles.slider, styles.disabledBackgroundSlider
                  )}
                  value={100}
                  handleStyle={{display: 'none'}}
                  disabled
                />
              </div>
            </>
          )
        }
      </div>
    );
};
