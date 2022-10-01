import React, { FC, useState } from 'react';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { HoneySlider } from '../../HoneySlider/HoneySlider';
import * as styles from './LockHoneyForm.css';
import { formatNumber } from '../../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { HoneyButtonTabs } from '../../HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';
import slug = Mocha.utils.slug;
import { InputsBlock } from '../../InputsBlock/InputsBlock';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const PERIODS = [
  { name: '1 M', slug: '1m' },
  { name: '3 M', slug: '3m' },
  { name: '6 M', slug: '6m' },
  { name: '1 Y', slug: '1y' },
  { name: '4 Y', slug: '4y' }
] as const;

type PeriodType = typeof PERIODS[number]['slug'];

const LockHoneyForm: FC = () => {
  const [period, setPeriod] = useState<PeriodType>('1m');
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueUSDC, setValueUSDC] = useState<number>(0);
  const usdcPrice = 0.95;
  const maxValue = 1000;

  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue) {
      setValueUSD(0);
      setValueUSDC(0);
      return;
    }
    setValueUSD(usdValue);
    setValueUSDC(usdValue / usdcPrice);
  };

  const handleUsdcInputChange = (usdcValue: number | undefined) => {
    if (!usdcValue) {
      setValueUSD(0);
      setValueUSDC(0);
      return;
    }

    setValueUSD(usdcValue * usdcPrice);
    setValueUSDC(usdcValue);
  };

  // Put your validators here
  const isRepayButtonDisabled = () => {
    return false;
  };

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary">Close</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={isRepayButtonDisabled()}
              isFluid={true}
            >
              Lock
            </HoneyButton>
          </div>
        </div>
      }
    >
      <div className={styles.depositForm}>
        <div className={styles.tabTitle}>Deposit HONEY and receive veHONEY</div>
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message="Instruction: Bla-bla when depositing USDC to the dYdX Layer 2 exchange, the funds are held in a bridge contract"
              link="https://google.com"
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock title="$HONEY locked" value="30,102.22" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock title="veHONEY locked" value="4,102.22" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock title="Lock period ends" value="3y 12m 19d" />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <HoneyButtonTabs
            items={PERIODS.map(period => ({
              name: period.name,
              slug: period.slug
            }))}
            activeItemSlug={period}
            onClick={itemSlug => setPeriod(itemSlug as PeriodType)}
            isFullWidth
          />
        </div>

        <InputsBlock
          valueUSD={p(f(valueUSD))}
          valueSOL={p(f(valueUSDC))}
          onChangeUSD={handleUsdInputChange}
          onChangeSOL={handleUsdcInputChange}
          maxValue={maxValue}
        />
      </div>
    </SidebarScroll>
  );
};

export default LockHoneyForm;
