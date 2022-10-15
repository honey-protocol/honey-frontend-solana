import * as styles from './HoneyLockedStatus.css';
import { FC } from 'react';
import {Slider} from 'antd';
import { formatNumber } from '../../helpers/format';
import c from "classnames";
import { vars } from "../../styles/theme.css";

interface HoneyLockedStatusProps {
    totalHoneyTokens: number;
    circulatingHoneyTokens: number;
    lockedHoneyTokens: number;
}

export const HoneyLockedStatus: FC<HoneyLockedStatusProps> = ({
  totalHoneyTokens,
  circulatingHoneyTokens,
  lockedHoneyTokens,
}) => {
  const lockedHoneyTokensPercent = lockedHoneyTokens / totalHoneyTokens
  const circulatingHoneyTokensPercent = ( circulatingHoneyTokens / totalHoneyTokens ) - lockedHoneyTokensPercent
  const totalHoneyTokensPercent = 1 - circulatingHoneyTokensPercent - lockedHoneyTokensPercent;

  const isLabelHidden = false;

  return (
    <div className={styles.rangeContainer}>
      <div
          className={styles.statusWrapper}
          style={{ width: `${lockedHoneyTokensPercent * 100}%`}}
      >
          <div className={styles.statusHeader.primary} style={{color: vars.colors.brownLight}}>
              {`${formatNumber.formatPercentRounded(lockedHoneyTokensPercent * 100, 0)}`}
          </div>
          <Slider
              className={c(
                  styles.status, styles.disabledBackgroundstatus
              )}
              value={100}
              handleStyle={{display: 'none'}}
              trackStyle={{
                  backgroundColor: vars.colors.brownLight
              }}
          />
      </div>
      <div
          className={styles.statusWrapper}
          style={{ width: `${circulatingHoneyTokensPercent * 100}%` }}
      >
        { isLabelHidden && <div
          className={styles.statusHeader.primary}>{`${formatNumber.formatPercentRounded(circulatingHoneyTokensPercent * 100, 0)}`}</div>}
          <Slider
              className={c(
                  styles.status, styles.disabledBackgroundstatus
              )}
              value={100}
              handleStyle={{display: 'none'}}
              trackStyle={{
                backgroundColor: vars.colors.black
              }}
          />
      </div>
      <div
        className={styles.statusWrapper}
        style={{ width: `${totalHoneyTokensPercent * 100}%` }}
      >
        { isLabelHidden && <div
          className={styles.statusHeader.primary}>{`${formatNumber.formatPercentRounded(totalHoneyTokensPercent * 100, 0)}`}</div>}
        <Slider
          className={c(
            styles.status, styles.disabledBackgroundstatus
          )}
          value={100}
          handleStyle={{display: 'none'}}
          trackStyle={{
            backgroundColor: vars.colors.grayMiddle
          }}
        />
      </div>
    </div>
  );
};
