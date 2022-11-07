import { FC, useMemo } from 'react';
import c from 'classnames';
import { Space } from 'antd';
import { useTokenMint } from '@saberhq/sail';
import { TokenAmount } from '@saberhq/token-utils';

import HoneyButton from '../HoneyButton/HoneyButton';
import { formatNumber } from '../../helpers/format';
import { GoveranceStatsProps } from './types';
import HoneyPeriod from '../HoneyPeriod/HoneyPeriod';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';
import { useGovernanceContext } from 'contexts/GovernanceProvider';
import { useLocker } from 'hooks/useVeHoney';
// import { generateMockHistoryData } from 'helpers/chartUtils';

import { questionIcon, questionIconYellow } from 'styles/icons.css';
import * as styles from './GovernanceStats.css';

const { format: f, formatShortName: fsn } = formatNumber;

export const GovernanceStats: FC<GoveranceStatsProps> = ({
  onGetVeHoneyClick
}) => {
  // const isMock = true;
  // const lockedPercent = 24;

  const { govToken, lockerInfo } = useGovernanceContext();
  const { escrow, votingPower } = useLocker();
  const { data: govTokenData } = useTokenMint(govToken?.mintAccount);

  const lockEndsTime = useMemo(() => {
    if (!escrow) return null;

    return escrow.data.escrowEndsAt.toNumber() * 1000;
  }, [escrow]);

  const totalSupplyFmt = useMemo(() => {
    if (govToken && govTokenData) {
      return new TokenAmount(govToken, govTokenData.account.supply).format({
        numberFormatOptions: {
          maximumFractionDigits: 0
        }
      });
    }
    return null;
  }, [govToken, govTokenData]);

  const totalSupply = Number(
    totalSupplyFmt?.toString().replaceAll(',', '') ?? 0
  );

  const lockedSupplyFmt = useMemo(() => {
    if (govToken && lockerInfo) {
      return new TokenAmount(govToken, lockerInfo.lockedSupply).format({
        numberFormatOptions: {
          maximumFractionDigits: 0
        }
      });
    }
    return null;
  }, [lockerInfo, govToken]);

  const lockedSupply = Number(
    lockedSupplyFmt?.toString().replaceAll(',', '') ?? 0
  );

  const lockedAmountFmt = useMemo(() => {
    if (escrow && govToken) {
      return new TokenAmount(govToken, escrow.data.amount).format({
        numberFormatOptions: {
          maximumFractionDigits: 0
        }
      });
    }
    return null;
  }, [govToken, escrow]);

  const lockedAmount = Number(
    lockedAmountFmt?.toString().replaceAll(',', '') ?? 0
  );

  // const getChartData = () => {
  //   if (isMock) {
  //     const from = new Date()
  //       .setFullYear(new Date().getFullYear() - 1)
  //       .valueOf();
  //     const to = new Date().valueOf();
  //     return generateMockHistoryData(from, to, 10000);
  //   }
  //   return [];
  // };

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
          <div className={styles.value}>{f(lockedAmount)}</div>
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
          <div className={styles.value}>{f(votingPower?.asNumber ?? 0)}</div>
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
            {lockEndsTime && lockEndsTime < Date.now() ? (
              '0'
            ) : (
              <HoneyPeriod from={Date.now()} to={lockEndsTime ?? 0} />
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
            <div className={styles.value}>{fsn(lockedSupply)}</div>
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
