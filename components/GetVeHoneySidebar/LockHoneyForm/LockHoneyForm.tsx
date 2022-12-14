import React, { FC, useCallback, useMemo, useState } from 'react';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import * as styles from './LockHoneyForm.css';
import { formatNumber } from '../../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { HoneyButtonTabs } from '../../HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';
import { InputsBlock } from '../../InputsBlock/InputsBlock';
import { PublicKey } from '@solana/web3.js';
import config from '../../../config';
import { useStake } from 'hooks/useStake';
import { convertToBN } from 'helpers/utils';
import { HONEY_DECIMALS } from 'helpers/sdk';
import * as anchor from '@project-serum/anchor';
import { useGovernance } from 'contexts/GovernanceProvider';
import useToast from 'hooks/useToast';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import SectionTitle from '../../SectionTitle/SectionTitle';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const PERIODS = [
  { name: '1 M', slug: '1' },
  { name: '3 M', slug: '3' },
  { name: '6 M', slug: '6' },
  { name: '1 Y', slug: '12' },
  { name: '4 Y', slug: '48' }
] as const;

type LockPeriod = typeof PERIODS[number]['slug'];

const LockHoneyForm = (props: { onCancel: Function }) => {
  const [lockPeriod, setLockPeriod] = useState<LockPeriod>('1');
  const [valueHONEY, setValueHONEY] = useState<number>(0);
  const [valueVeHONEY, setValueVeHONEY] = useState<number>(0);
  const { toast, ToastComponent } = useToast();
  const veHoneyPrice =
    lockPeriod === '1'
      ? 1 / 50
      : lockPeriod === '3'
      ? 6.25 / 100
      : lockPeriod === '6'
      ? 12.5 / 100
      : lockPeriod === '12'
      ? 25 / 100
      : 1;
  const STAKE_POOL_ADDRESS = new PublicKey(
    config.NEXT_PUBLIC_STAKE_POOL_ADDRESS
  );
  const LOCKER_ADDRESS = new PublicKey(config.NEXT_PUBLIC_LOCKER_ADDR);

  const { lock, unlock, escrow } = useStake(STAKE_POOL_ADDRESS, LOCKER_ADDRESS);
  const {
    veHoneyAmount,
    lockedAmount,
    lockedPeriodEnd,
    honeyAmount,
    lockPeriodHasEnded
  } = useGovernance();
  const maxValue = honeyAmount;

  const handleHoneyInputChange = (honeyValue: number | undefined) => {
    if (!honeyValue) {
      setValueHONEY(0);
      setValueVeHONEY(0);
      return;
    }
    setValueHONEY(honeyValue);
    setValueVeHONEY(honeyValue * veHoneyPrice);
  };

  const handleVeHoneyInputChange = (veHoneyValue: number | undefined) => {
    if (!veHoneyValue) {
      setValueHONEY(0);
      setValueVeHONEY(0);
      return;
    }

    setValueHONEY(veHoneyValue / veHoneyPrice);
    setValueVeHONEY(veHoneyValue);
  };

  // console.log({
  //   veHoneyAmount,
  //   lockedAmount,
  //   lockedPeriodEnd,
  //   honeyAmount,
  //   lockPeriodHasEnded
  // });
  // Put your validators here
  const isLockButtonDisabled = () => {
    return false;
  };

  const vestingPeriodInSeconds = useMemo(() => {
    if (['1', '3', '6', '12', '48'].includes(lockPeriod)) {
      const date = new Date();
      const current = Math.floor(date.getTime() / 1000);
      date.setMonth(date.getMonth() + Number(lockPeriod));
      const nMonthsLater = Math.floor(date.getTime() / 1000);

      return nMonthsLater - current;
    }
    return 0;
  }, [lockPeriod]);

  const handleLock = useCallback(async () => {
    if (!valueHONEY || !vestingPeriodInSeconds) return;
    await lock(
      convertToBN(valueHONEY, HONEY_DECIMALS),
      new anchor.BN(vestingPeriodInSeconds),
      !!escrow,
      toast
    );
  }, [lock, escrow, valueHONEY, toast, vestingPeriodInSeconds]);

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton onClick={() => props.onCancel()} variant="secondary">
                Close
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={isLockButtonDisabled()}
                block
                onClick={handleLock}
              >
                Lock
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.depositForm}>
        <SectionTitle title="Deposit HONEY and receive veHONEY" />
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message="Vote escrowed HONEY (or veHONEY) represents governance in the Honey DAO. Learn more about the details in our docs."
              link="https://docs.honey.finance/tokenomics/vehoney"
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={f(honeyAmount)}
              title={
                <span className={hAlign}>
                  $HONEY balance
                  {/* <div className={questionIcon} /> */}
                </span>
              }
              // toolTipLabel={
              //   <span>
              //     Honey tokens can be bought on the open market or by staking
              //     Honey Gensis Bees on the farm page.
              //   </span>
              // }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={veHoneyAmount.toString()}
              title={
                <span className={hAlign}>
                  veHONEY balance
                  {/* <div className={questionIcon} /> */}
                </span>
              }
              // toolTipLabel={<span>place holder</span>}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={lockedAmount.toString()}
              title={
                <span className={hAlign}>
                  $HONEY locked
                  {/* <div className={questionIcon} /> */}
                </span>
              }
              // toolTipLabel={<span>place holder</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={lockedPeriodEnd.toString()}
              title={
                <span className={hAlign}>
                  Lock period ends
                  {/* <div className={questionIcon} /> */}
                </span>
              }
              // toolTipLabel={<span>place holder</span>}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <HoneyButtonTabs
            items={PERIODS.map(period => ({
              name: period.name,
              slug: period.slug
            }))}
            activeItemSlug={lockPeriod}
            onClick={itemSlug => {
              setLockPeriod(itemSlug as LockPeriod);
              handleHoneyInputChange(0);
            }}
            isFullWidth
          />
        </div>

        <InputsBlock
          firstInputValue={valueHONEY}
          secondInputValue={valueVeHONEY}
          onChangeFirstInput={handleHoneyInputChange}
          onChangeSecondInput={handleVeHoneyInputChange}
          maxValue={maxValue}
          delimiterIcon={
            <div className={styles.inputsDelimiter}>
              {1 / veHoneyPrice} to 1
            </div>
          }
          firstInputAddon="HONEY"
          secondInputAddon="veHONEY"
        />
      </div>
    </SidebarScroll>
  );
};

export default LockHoneyForm;
