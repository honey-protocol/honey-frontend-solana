import React, { useCallback, useMemo, useState } from 'react';
import { BN } from '@project-serum/anchor';
import { TokenAmount } from '@saberhq/token-utils';

import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import { InputsBlock } from 'components/InputsBlock/InputsBlock';
import SectionTitle from 'components/SectionTitle/SectionTitle';

import { useLocker } from 'hooks/useVeHoney';
import useToast from 'hooks/useToast';
import { useAccountByMint } from 'hooks/useAccounts';
import { formatNumber } from 'helpers/format';
import { convertToBN } from 'helpers/utils';

import * as styles from './LockHoneyForm.css';
import { hAlign } from 'styles/common.css';

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

  const {
    lock,
    unlock,
    escrow,
    votingPower,
    lockedAmount,
    govToken,
    closeEscrow
  } = useLocker();
  const honeyAccount = useAccountByMint(govToken?.mintAccount);

  const lockEndsTime = useMemo(() => {
    if (!escrow || escrow.data.escrowEndsAt.eqn(0)) return null;
    return new Date(escrow.data.escrowEndsAt.toNumber() * 1000);
  }, [escrow]);

  const honeyAmount = useMemo(() => {
    if (!govToken || !honeyAccount) return null;
    return new TokenAmount(govToken, honeyAccount.data.amount);
  }, [honeyAccount, govToken]);

  const unlockable = useMemo(() => {
    if (!escrow) return false;
    return new Date(escrow.data.escrowEndsAt.toNumber() * 1000) <= new Date();
  }, [escrow]);

  const closable = useMemo(() => {
    if (!escrow) return false;
    return (
      new Date(escrow.data.escrowEndsAt.toNumber() * 1000) <= new Date() &&
      escrow.data.amount.eqn(0)
    );
  }, [escrow]);

  const handleLock = useCallback(async () => {
    if (
      valueHONEY &&
      govToken &&
      ['1', '3', '6', '12', '48'].includes(lockPeriod)
    ) {
      // mainnet
      // const date = new Date();
      // const current = Math.floor(date.getTime() / 1000);
      // date.setMonth(date.getMonth() + Number(lockPeriod));
      // const nMonthsLater = Math.floor(date.getTime() / 1000);
      // const lockPeroidInSeconds = nMonthsLater - current;

      // testing on devnet
      const lockPeroidInSeconds = Number(lockPeriod) * 10;
      toast.processing();
      try {
        await lock(
          convertToBN(valueHONEY, govToken.decimals),
          new BN(lockPeroidInSeconds)
        );

        setValueHONEY(0);
        setValueVeHONEY(0);
        toast.success('Lock successful');
      } catch (error) {
        toast.error('Lock failed');
      }
    }
  }, [lock, valueHONEY, lockPeriod, govToken]);

  const handleUnlock = useCallback(async () => {
    try {
      toast.processing();
      await unlock;
      toast.success('Unlock successful');
    } catch (error) {
      toast.error('Unlock failed');
    }
  }, [toast, unlock]);

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

  // Put your validators here
  const lockable = useMemo(() => {
    if (!valueHONEY || (honeyAmount && valueHONEY > honeyAmount.asNumber)) {
      return false;
    }
    return true;
  }, [valueHONEY, honeyAmount]);

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton
                onClick={closeEscrow}
                disabled={!closable}
                variant="secondary"
              >
                Close
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={!lockable}
                block
                onClick={handleLock}
              >
                Lock
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={!unlockable}
                block
                onClick={handleUnlock}
              >
                Unlock
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.depositForm}>
        <SectionTitle
          title="Deposit HONEY and receive veHONEY"
          className={styles.mb10}
        />
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
              value={f(honeyAmount?.asNumber)}
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
              value={votingPower?.asNumber.toString() ?? '-'}
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
              value={lockedAmount?.asNumber.toString() ?? '-'}
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
              value={
                lockEndsTime?.toLocaleString(undefined, {
                  timeZoneName: 'short'
                }) ?? '-'
              }
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
          maxValue={honeyAmount?.asNumber ?? 0}
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
