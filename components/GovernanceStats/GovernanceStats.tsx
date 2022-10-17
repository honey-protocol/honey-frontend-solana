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
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';
import { questionIcon, questionIconYellow } from 'styles/icons.css';
import { Space } from 'antd';
import { TokenAmount } from '@saberhq/token-utils';
import { useGovernance } from 'contexts/GovernanceProvider';
import { useTokenMint } from '@saberhq/sail';
import { useGovernor } from 'hooks/tribeca/useGovernor';

const { format: f, formatPercent: fp, formatShortName: fsn } = formatNumber;

export const GovernanceStats: FC<GoveranceStatsProps> = ({
  onGetVeHoneyClick
}) => {
  const isMock = true;
  const lockedPercent = 24;

  const { govToken, lockedSupply } = useGovernor();
  const { data: govTokenData } = useTokenMint(govToken?.mintAccount);

  const totalSupplyFmt =
    govTokenData && govToken
      ? new TokenAmount(govToken, govTokenData.account.supply).format({
          numberFormatOptions: {
            maximumFractionDigits: 0
          }
        })
      : govTokenData;

  const totalSupply = Number(totalSupplyFmt?.toString().replaceAll(',', ''));

  const lockedSupplyFmt = lockedSupply
    ? lockedSupply.format({
        numberFormatOptions: {
          maximumFractionDigits: 0
        }
      })
    : lockedSupply;
  const lockedHoney = Number(lockedSupplyFmt);

  const { honeyAmount, veHoneyAmount, lockedPeriodEnd } = useGovernance();
  console.log(Number(totalSupply), { lockedHoney, lockedSupplyFmt });
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
          <HoneyTooltip label="Placeholder tooltip label">
            <Space className={c(styles.title, styles.yellow)} size="small">
              Lock period <div className={questionIconYellow} />
            </Space>
          </HoneyTooltip>
          <div className={c(styles.value, styles.lockPeriodValue)}>
            <div>{lockedPeriodEnd.toString()}</div>
          </div>
        </div>
        <div className={styles.sliderWrapper}>
          <div className={c(styles.title, styles.yellow)}>
            {fp(lockedPercent)}
          </div>
          <HoneySlider
            maxSafePosition={0}
            currentValue={200}
            maxValue={1000}
            isReadonly
          />
        </div>
      </div>

      <div className={styles.statBlock}>
        <div className={styles.blockTitle}>
          <HoneyTooltip label="Placeholder tooltip lable">
            <Space size="small" className={c(styles.title, styles.yellow)}>
              Honey balance
              <div className={questionIconYellow} />
            </Space>
          </HoneyTooltip>
          <div className={styles.value}>{f(honeyAmount)}</div>
        </div>

        <div className={styles.content}>
          <HoneyLineChart data={getChartData()} />
        </div>

        <div className={styles.buttonWrapper}>
          <a
            href="https://jup.ag/swap/SOL-$HONEY"
            target="_blank"
            rel="noreferrer"
          >
            <HoneyButton variant="text">
              <div className={styles.buttonContent}>
                <span>Buy more</span>
                <div className={styles.buyMoreIcon} />
              </div>
            </HoneyButton>
          </a>
        </div>
      </div>

      <div className={styles.statBlock}>
        <div className={styles.blockTitle}>
          <HoneyTooltip label="Placeholder tooltip label">
            <Space className={styles.title}>
              veHoney or voting power <div className={questionIcon} />
            </Space>
          </HoneyTooltip>
          <div className={styles.value}>{f(veHoneyAmount)}</div>
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
            <div className={styles.value}>{fsn(totalSupply)}</div>
          </div>
        </div>
        <div className={styles.sliderWrapper}>
          <div className={c(styles.title, styles.yellow)}>
            {fp((lockedHoney / totalSupply) * 100)}
          </div>
          <HoneyTooltip label={`Total Honey supply: 1 billion`}>
            <HoneySlider
              minAvailableValue={lockedHoney}
              currentValue={0}
              maxValue={totalSupply}
              isReadonly
              minAvailableSliderClassName={styles.minAvailableSlider}
              currentValueSliderClassName={styles.currentValueSlider}
              maxUnavailableSliderClassName={styles.maxUnavailableSlider}
            />
          </HoneyTooltip>
        </div>
      </div>
    </div>
  );
};
