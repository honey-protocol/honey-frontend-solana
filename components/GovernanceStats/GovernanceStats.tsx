import * as styles from './GovernanceStats.css';
import c from 'classnames';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import HoneyButton from '../HoneyButton/HoneyButton';
import { FC } from 'react';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { HoneyLineChart } from '../HoneyLineChart/HoneyLineChart';
import { vars } from 'styles/theme.css';
import { formatNumber } from '../../helpers/format';
import { GoveranceStatsProps } from './types';
import HoneyPeriod from '../HoneyPeriod/HoneyPeriod';

const { format: f, formatPercent: fp, formatShortName: fsn } = formatNumber;

export const GovernanceStats: FC<GoveranceStatsProps> = ({
  onGetVeHoneyClick
}) => {
  const isMock = true;
  const lockedPercent = 24;
  const honeyBalance = 10012.94;
  const veHoneyBalance = 12012.94;
  const honeySupply = 2_000_932;
  const lockedHoney = 100_500;
  const lockPeriodEnd = 1759488639952;

  const getChartData = () => {
    if (isMock) {
      const from = new Date()
        .setFullYear(new Date().getFullYear() - 1)
        .valueOf();
      const to = new Date().valueOf();
      return generateMockHistoryData(from, to, 10000);
    }
    return [];
  };

  return (
    <div className={styles.governanceGraphs}>
      <div className={c(styles.statBlock, styles.lockPeriodBlock)}>
        <div className={styles.blockTitle}>
          <div className={c(styles.title, styles.yellow)}>Lock period</div>
          <div className={c(styles.value, styles.lockPeriodValue)}>
            <HoneyPeriod from={Date.now()} to={lockPeriodEnd} />
          </div>
        </div>
        <div className={styles.sliderWrapper}>
          <div className={c(styles.title, styles.yellow)}>
            {fp(lockedPercent)}
          </div>
          <HoneySlider currentValue={200} maxValue={1000} isReadonly />
        </div>
      </div>

      <div className={styles.statBlock}>
        <div className={styles.blockTitle}>
          <div className={c(styles.title, styles.yellow)}>Honey balance</div>
          <div className={styles.value}>{f(honeyBalance)}</div>
        </div>

        <div className={styles.content}>
          <HoneyLineChart data={getChartData()} />
        </div>

        <div className={styles.buttonWrapper}>
          <HoneyButton variant="text">
            <div className={styles.buttonContent}>
              <span>Buy more</span>
              <div className={styles.buyMoreIcon} />
            </div>
          </HoneyButton>
        </div>
      </div>

      <div className={styles.statBlock}>
        <div className={styles.blockTitle}>
          <div className={styles.title}>veHoney or voting power</div>
          <div className={styles.value}>{f(veHoneyBalance)}</div>
        </div>

        <div className={styles.content}>
          <HoneyLineChart data={getChartData()} color={vars.colors.black} />
        </div>

        <div className={styles.buttonWrapper}>
          <HoneyButton variant="text" onClick={onGetVeHoneyClick}>
            <div className={styles.buttonContent}>
              <span>Get</span>
              <div className={styles.getIcon} />
            </div>
          </HoneyButton>
        </div>
      </div>

      <div className={styles.statBlock}>
        <div className={styles.lockedHoneyTitle}>
          <div className={styles.lockedLeft}>
            <div className={styles.title}>Locked Honey</div>
            <div className={styles.value}>{fsn(lockedHoney)}</div>
          </div>
          <div className={styles.lockedRight}>
            <div className={styles.title}>Circulating Honey supply</div>
            <div className={styles.value}>{fsn(honeySupply)}</div>
          </div>
        </div>
        <div className={styles.sliderWrapper}>
          <div className={c(styles.title, styles.yellow)}>
            {fp(lockedHoney / honeySupply)}
          </div>
          <HoneySlider
            currentValue={0}
            maxValue={honeySupply}
            minAvailableValue={lockedHoney}
            isReadonly
          />
        </div>
      </div>
    </div>
  );
};
