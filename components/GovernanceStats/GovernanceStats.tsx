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
import { HoneyLockedStatus } from '../HoneyLockedStatus/HoneyLockedStatus';

const { format: f, formatPercent: fp, formatShortName: fsn } = formatNumber;

export const GovernanceStats: FC<GoveranceStatsProps> = ({
  onGetVeHoneyClick
}) => {
  const isMock = true;
  const lockedPercent = 24;

  const { govToken, lockedSupply } = useGovernor();
  const { data: govTokenData } = useTokenMint(govToken?.mintAccount);
  const { honeyAmount, veHoneyAmount, lockedPeriodEnd } = useGovernance();

  const lockTimeLeft =
    new Date(lockedPeriodEnd.toString()).getTime() - new Date().getTime();

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
  const lockedHoney = Number(lockedSupplyFmt?.toString().replaceAll(',', ''));

  console.log(Number(totalSupply), {
    lockedHoney,
    lockedSupplyFmt,
    lockedPeriodEnd
  });
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
      <div className={styles.statBlock}>
        <div className={styles.blockTitle}>
          <HoneyTooltip label="Honey tokens can be bought on the open market or earned by staking Honey Gensis Bees on the farm page.">
            <Space size="small" className={c(styles.title, styles.yellow)}>
              HONEY balance
              <div className={questionIconYellow} />
            </Space>
          </HoneyTooltip>
          <div className={styles.value}>{f(honeyAmount)}</div>
        </div>

        {/* <div className={styles.content}>
          <HoneyLineChart data={getChartData()} />
        </div> */}

        <div className={styles.buttonWrapper}>
          <a
            href="https://jup.ag/swap/SOL-$HONEY"
            target="_blank"
            rel="noreferrer"
          >
            <HoneyButton variant="text">
              <div className={styles.buttonContent}>
                <span>Buy</span>
                <div className={styles.buyMoreIcon} />
              </div>
            </HoneyButton>
          </a>
        </div>
      </div>

      <div className={styles.statBlock}>
        <div className={styles.blockTitle}>
          <HoneyTooltip label="veHONEY is the Governance token of the Honey Ecosystem. It is used to create and vote on DAO proposals.">
            <Space className={styles.title}>
              veHONEY || Voting power <div className={questionIcon} />
            </Space>
          </HoneyTooltip>
          <div className={styles.value}>{f(veHoneyAmount)}</div>
        </div>

        {/* <div className={styles.content}>
          <HoneyLineChart data={getChartData()} color={vars.colors.black} />
        </div> */}

        <div className={styles.buttonWrapper}>
          <HoneyButton variant="text" onClick={onGetVeHoneyClick}>
            <div className={styles.buttonContent}>
              <span>Get</span>
              <div className={styles.getIcon} />
            </div>
          </HoneyButton>
        </div>
      </div>

      <div className={c(styles.statBlock, styles.lockPeriodBlock)}>
        <div className={styles.blockTitle}>
          <HoneyTooltip label="A countdown until your veHONEY can be unlocked. When you unlock your veHONEY you will be able to claim your previously locked HONEY tokens. This countdown is pushed back each time more HONEY is vested.">
            <Space className={styles.title} size="small">
              Lock period <div className={questionIcon} />
            </Space>
          </HoneyTooltip>
          <div className={c(styles.value, styles.lockPeriodValue)}>
            {lockTimeLeft < 0 ? (
              '0'
            ) : (
              <HoneyPeriod
                from={new Date().getTime()}
                to={new Date(lockedPeriodEnd.toString()).getTime()}
              />
            )}
          </div>
        </div>
        {/* <div className={styles.sliderWrapper}>
          <div className={c(styles.title, styles.yellow)}>
            {fp(lockedPercent)}
          </div>
          <HoneySlider
            maxSafePosition={0}
            currentValue={200}
            maxValue={1000}
            isReadonly
          />
        </div> */}
      </div>

      <div className={styles.statBlock}>
        <div className={styles.lockedHoneyTitle}>
          <div className={styles.lockedLeft}>
            <div className={styles.title}>Total Locked HONEY</div>
            <div className={styles.value}>{fsn(lockedHoney)}</div>
          </div>
          <div className={styles.lockedRight}>
            <div className={styles.title}>Total Circulating HONEY</div>
            <div className={styles.value}>{fsn(totalSupply)}</div>
          </div>
        </div>
        {/* <div className={styles.sliderWrapper}>
          <HoneyLockedStatus
            circulatingHoneyTokens={0}
            lockedHoneyTokens={lockedHoney}
            totalHoneyTokens={totalSupply}
          />
        </div> */}
      </div>
    </div>
  );
};
