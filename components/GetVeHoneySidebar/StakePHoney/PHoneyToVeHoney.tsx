import React, { useState, useCallback, useMemo } from 'react';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import { BN } from '@project-serum/anchor';

import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import SectionTitle from 'components/SectionTitle/SectionTitle';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HoneyFormattedNumericInput from 'components/HoneyFormattedNumericInput/HoneyFormattedInput';
import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import { useAccountByMint, useAccounts } from 'hooks/useAccounts';
import { useStake, useLocker } from 'hooks/useVeHoney';
import { formatNumber } from 'helpers/format';
import { convert, convertToBN, isNil } from 'helpers/utils';
import * as styles from '../LockHoneyForm/LockHoneyForm.css';
import { hAlign } from 'styles/common.css';
import { TokenAmount } from '@saberhq/token-utils';
import { calculateVotingPowerWithParams } from 'helpers/sdk';
import useToast from 'hooks/useToast';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const PERIODS = [
  { name: '3 M', slug: '3' },
  { name: '6 M', slug: '6' },
  { name: '1 Y', slug: '12' }
] as const;

type LockPeriod = typeof PERIODS[number]['slug'];

const PHoneyToVeHoney = (_: { onCancel: Function }) => {
  const [lockPeriod, setLockPeriod] = useState<LockPeriod>('3');
  const [phoneyValue2, setPHoneyValue2] = useState<number>();
  const [honeyValue, setHoneyValue] = useState<number>();
  const [veHoneyValue, setVeHoneyValue] = useState<number>();
  const { toast, ToastComponent } = useToast();
  const honeyPrice = lockPeriod === '3' ? 2 : lockPeriod === '6' ? 5 : 10;

  const { preToken, govToken, deposit, vest } = useStake();
  const { escrow, votingPower, locker } = useLocker();
  const pHoneyAccount = useAccountByMint(preToken?.mintAccount);

  const pHoneyAmount = useMemo(() => {
    if (!preToken || !pHoneyAccount) return null;
    return new TokenAmount(preToken, pHoneyAccount.data.amount);
  }, [preToken, pHoneyAccount]);

  const lockedAmount = useMemo(() => {
    if (!escrow || !govToken) return null;
    return new TokenAmount(govToken, escrow.data.amount);
  }, [escrow, govToken]);

  const lockEndsTime = useMemo(() => {
    if (!escrow || escrow.data.escrowEndsAt.eqn(0)) return null;
    return new Date(escrow.data.escrowEndsAt.toNumber() * 1000);
  }, [escrow]);

  const defaultInputFormatted = (value: ValueType | undefined) => {
    // TODO: pass decimals as props if needed
    return value ? formatNumber.formatTokenInput(String(value), 9) : '';
  };

  const handlePHoneyValueChange2 = useCallback(
    (value: ValueType | null) => {
      if (isNil(value)) {
        setPHoneyValue2(undefined);
        setHoneyValue(undefined);
        setVeHoneyValue(undefined);
      } else {
        setPHoneyValue2(Number(value));
        setHoneyValue(Number(value) * honeyPrice);
        if (govToken && locker) {
          setVeHoneyValue(
            convert(
              calculateVotingPowerWithParams(
                convertToBN(Number(value) * honeyPrice, govToken.decimals),
                // devnet
                // new BN(Number(lockPeriod) * 10),
                // mainnet
                new BN(Number(lockPeriod) * 2_592_000),
                locker.params
              ),
              govToken.decimals
            )
          );
        }
      }
    },
    [locker, lockPeriod, govToken]
  );

  const handleVest = useCallback(async () => {
    if (phoneyValue2 && preToken && lockPeriod) {
      try {
        toast.processing();
        await vest(
          convertToBN(phoneyValue2, preToken.decimals),
          // devnet
          // new BN(Number(lockPeriod) * 10),
          // mainnet
          new BN(Number(lockPeriod) * 2_592_000)
        );
        setPHoneyValue2(undefined);
        setHoneyValue(undefined);
        setVeHoneyValue(undefined);
        toast.success('Vesting successful');
      } catch (error) {
        toast.error('Vesting failed');
      }
    }
  }, [phoneyValue2, preToken, lockPeriod, toast]);

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="secondary" onClick={() => {}}>
                Cancel
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={
                  !phoneyValue2 || phoneyValue2 > (pHoneyAmount?.asNumber ?? 0)
                }
                block
                onClick={handleVest}
              >
                Vest
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.depositForm}>
        <SectionTitle
          title="Deposit pHONEY and receive veHONEY"
          className={styles.mb10}
        />
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning message="Deposit and burn $pHoney tokens to step to lock $Honey (multiplied by locking period) and get $veHoney to hold voting power of the governance." />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={f(pHoneyAmount?.asNumber)}
              title={<span className={hAlign}>$pHoney balance</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={f(votingPower?.asNumber)}
              title={<span className={hAlign}>$veHoney balance</span>}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={f(lockedAmount?.asNumber)}
              title={<span className={hAlign}>$HONEY locked</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={
                lockEndsTime?.toLocaleString(undefined, {
                  timeZoneName: 'short'
                }) ?? '-'
              }
              title={<span className={hAlign}>Lock period ends</span>}
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
              handlePHoneyValueChange2(null);
            }}
            isFullWidth
          />
        </div>
        <div className={styles.mb10}>
          <HoneyFormattedNumericInput
            placeholder="0.00"
            decimalSeparator="."
            value={phoneyValue2}
            formatter={defaultInputFormatted}
            onChange={handlePHoneyValueChange2}
            addonAfter="PHONEY"
          />
        </div>
        <div className={styles.mb10}>
          <HoneyFormattedNumericInput
            placeholder="0.00"
            decimalSeparator="."
            value={honeyValue}
            formatter={defaultInputFormatted}
            disabled
            addonAfter="HONEY"
          />
        </div>
        <div>
          <HoneyFormattedNumericInput
            placeholder="0.00"
            decimalSeparator="."
            value={veHoneyValue}
            formatter={defaultInputFormatted}
            disabled
            addonAfter="VEHONEY"
          />
        </div>
      </div>
    </SidebarScroll>
  );
};

export default PHoneyToVeHoney;
