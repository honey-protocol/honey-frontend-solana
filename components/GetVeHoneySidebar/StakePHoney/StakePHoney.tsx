import React, { FC, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { PublicKey } from '@solana/web3.js';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import { BN } from '@project-serum/anchor';

import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import SectionTitle from 'components/SectionTitle/SectionTitle';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HoneyFormattedNumericInput from 'components/HoneyFormattedNumericInput/HoneyFormattedInput';
import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { HoneyCheckbox } from 'components/HoneyCheckbox/HoneyCheckbox';
import { InputsBlock } from 'components/InputsBlock/InputsBlock';
import { useAccountByMint, useAccounts } from 'hooks/useAccounts';
import { useStake, useLocker } from 'hooks/useVeHoney';
import { formatNumber } from 'helpers/format';
import { convert, convertToBN, isNil } from 'helpers/utils';

import honeyGenesisBee from 'public/images/imagePlaceholder.png';
import * as styles from '../LockHoneyForm/LockHoneyForm.css';
import { hAlign } from 'styles/common.css';
import { TokenAmount } from '@saberhq/token-utils';
import { calculateVotingPowerWithParams } from 'helpers/sdk';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const PERIODS = [
  { name: '3 M', slug: '3' },
  { name: '6 M', slug: '6' },
  { name: '1 Y', slug: '12' }
] as const;

type LockPeriod = typeof PERIODS[number]['slug'];

const StakePHoney = (props: { onCancel: Function }) => {
  const [lockPeriod, setLockPeriod] = useState<LockPeriod>('3');
  const [phoneyValue1, setPHoneyValue1] = useState<number>();
  const [phoneyValue2, setPHoneyValue2] = useState<number>();
  const [honeyValue, setHoneyValue] = useState<number>();
  const [veHoneyValue, setVeHoneyValue] = useState<number>();
  const honeyPrice = lockPeriod === '3' ? 2 : lockPeriod === '6' ? 5 : 10;

  const { preToken, govToken, user, claimableAmount, deposit, vest, claim } =
    useStake();
  const { escrow, votingPower, locker } = useLocker();
  const pHoneyAccount = useAccountByMint(preToken?.mintAccount);

  const pHoneyAmount = useMemo(() => {
    if (!preToken || !pHoneyAccount) return null;
    return new TokenAmount(preToken, pHoneyAccount.data.amount);
  }, [preToken, pHoneyAccount]);

  const depositedAmount = useMemo(() => {
    if (!preToken || !user) return null;
    return new TokenAmount(preToken, user.data.depositAmount);
  }, [preToken, user]);

  const claimedAmount = useMemo(() => {
    if (!govToken || !user) return null;
    return new TokenAmount(govToken, user.data.claimedAmount);
  }, [govToken, user]);

  const lockedAmount = useMemo(() => {
    if (!escrow || !govToken) return null;
    return new TokenAmount(govToken, escrow.data.amount);
  }, [escrow, govToken]);

  const lockEndsTime = useMemo(() => {
    if (!escrow) return null;
    return new Date(escrow.data.escrowEndsAt.toNumber() * 1000);
  }, [escrow]);

  const defaultInputFormatted = (value: ValueType | undefined) => {
    // TODO: pass decimals as props if needed
    return value ? formatNumber.formatTokenInput(String(value), 9) : '';
  };

  const handlePHoneyValueChange1 = (value: ValueType | null) => {
    if (isNil(value)) {
      setPHoneyValue1(undefined);
    } else {
      setPHoneyValue1(Number(value));
    }
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
                new BN(Number(lockPeriod) * 10),
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

  const handleDeposit = useCallback(async () => {
    if (phoneyValue1 && preToken) {
      await deposit(convertToBN(phoneyValue1, preToken.decimals));
      setPHoneyValue1(undefined);
    }
  }, [phoneyValue1, preToken]);

  const handleVest = useCallback(async () => {
    if (phoneyValue2 && preToken && lockPeriod) {
      await vest(
        convertToBN(phoneyValue2, preToken.decimals),
        new BN(Number(lockPeriod) * 10)
      );
      setPHoneyValue2(undefined);
      setHoneyValue(undefined);
      setVeHoneyValue(undefined);
    }
  }, [phoneyValue2, preToken, lockPeriod]);

  return (
    <SidebarScroll>
      <div className={styles.depositForm}>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={f(pHoneyAmount?.asNumber)}
              title={<span className={hAlign}>$pHONEY balance</span>}
            />
          </div>
        </div>
        <SectionTitle title="Deposit pHONEY and receive HONEY" />
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning message="Deposit and burn $pHoney tokens to claim the same amount of $Honey daily basis for 21 days." />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={f(depositedAmount?.asNumber)}
              title={<span className={hAlign}>$pHONEY deposited</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={f(claimedAmount?.asNumber)}
              title={<span className={hAlign}>$HONEY claimed</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={f(claimableAmount?.asNumber)}
              title={<span className={hAlign}>$HONEY claimable today</span>}
            />
          </div>
        </div>
        <div>
          <HoneyFormattedNumericInput
            placeholder="0.00"
            decimalSeparator="."
            formatter={defaultInputFormatted}
            onChange={handlePHoneyValueChange1}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyButton
              variant="primary"
              disabled={
                !phoneyValue1 || phoneyValue1 > (pHoneyAmount?.asNumber ?? 0)
              }
              block
              onClick={handleDeposit}
            >
              Deposit
            </HoneyButton>
          </div>
          <div className={styles.col}>
            <HoneyButton
              variant="primary"
              disabled={!claimableAmount?.asNumber}
              block
              onClick={claim}
            >
              Claim
            </HoneyButton>
          </div>
        </div>
        <SectionTitle title="Deposit pHONEY and receive veHONEY" />
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning message="Deposit and burn $pHoney tokens to step to lock $Honey (multiplied by locking period) and get $veHoney to hold voting power of the governance." />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={f(votingPower?.asNumber)}
              title={<span className={hAlign}>$veHoney balance</span>}
            />
          </div>
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
        <div>
          $pHONEY
          <HoneyFormattedNumericInput
            placeholder="0.00"
            decimalSeparator="."
            value={phoneyValue2}
            formatter={defaultInputFormatted}
            onChange={handlePHoneyValueChange2}
          />
        </div>
        <div>
          $HONEY
          <HoneyFormattedNumericInput
            placeholder="0.00"
            decimalSeparator="."
            value={honeyValue}
            formatter={defaultInputFormatted}
            disabled
          />
        </div>
        <div>
          $veHONEY
          <HoneyFormattedNumericInput
            placeholder="0.00"
            decimalSeparator="."
            value={veHoneyValue}
            formatter={defaultInputFormatted}
            disabled
          />
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
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
      </div>
    </SidebarScroll>
  );
};

export default StakePHoney;
