import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, Input, Stack, Text, Tag } from 'degen';
import { TokenAmount } from '@saberhq/token-utils';
import { BN } from '@project-serum/anchor';

import { useLocker } from 'hooks/useVeHoney';
import { useAccountByMint } from 'hooks/useAccounts';
import { calcMonthShift, convertToBN } from 'helpers/utils';

import * as styles from './HoneyModal.css';

const HoneyModal = () => {
  const [amount, setAmount] = useState<number>(0);
  const [vestingPeriod, setVestingPeriod] = useState<number>(12);

  const handleOnChange = (event: any) => {
    setAmount(event.target.value);
  };

  const vestingPeriodInSeconds = useMemo(() => {
    if ([1, 3, 6, 12, 48].includes(vestingPeriod)) {
      return calcMonthShift(vestingPeriod);
    }
    return 0;
  }, [vestingPeriod]);

  const { lock, unlock, escrow, lockedAmount, votingPower, govToken } =
    useLocker();
  const govTokenAccount = useAccountByMint(govToken?.mintAccount);

  const lockEndsTime = useMemo(() => {
    if (!escrow) return null;
    return new Date(escrow.data.escrowEndsAt.toNumber() * 1000);
  }, [escrow]);

  const honeyAmount = useMemo(() => {
    if (!govTokenAccount || !govToken) return null;

    return new TokenAmount(govToken, govTokenAccount.data.amount);
  }, [govTokenAccount, govToken]);

  const handleLock = useCallback(async () => {
    if (!amount || !vestingPeriodInSeconds || !govToken) return;

    await lock(
      convertToBN(amount, govToken.decimals),
      new BN(vestingPeriodInSeconds)
    );
  }, [lock, govToken, amount, vestingPeriodInSeconds]);

  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Lock HONEY
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Text align="center" weight="semiBold">
            Deposit HONEY and receive veHONEY
          </Text>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                $HONEY (locked)
              </Text>
              <Text variant="small">{lockedAmount}</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                veHoney (locked)
              </Text>
              <Text variant="small">{votingPower?.asNumber ?? '-'}</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Lock period ends
              </Text>
              <Text variant="small">
                {lockEndsTime?.toLocaleString(undefined, {
                  timeZoneName: 'short'
                }) ?? '-'}
              </Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Vesting period
              </Text>
              <Box>
                <select
                  name="vestingPeriod"
                  value={vestingPeriod}
                  className={styles.select}
                  onChange={event =>
                    setVestingPeriod(Number(event.target.value))
                  }
                >
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">1 year</option>
                  <option value="48">4 years</option>
                </select>
              </Box>
            </Stack>
          </Stack>
          <Input
            type="number"
            label="Amount"
            labelSecondary={<Tag>{honeyAmount?.asNumber ?? '-'} HONEY max</Tag>}
            max={honeyAmount?.asNumber ?? ''}
            min={0}
            value={amount || ''}
            disabled={!honeyAmount?.asNumber}
            hideLabel
            units="HONEY"
            placeholder="0"
            onChange={handleOnChange}
          />

          <Button
            onClick={handleLock}
            disabled={amount ? false : true}
            width="full"
          >
            {amount ? 'Deposit' : 'Enter amount'}
          </Button>
          <Button
            onClick={unlock}
            disabled={!!(lockEndsTime && lockEndsTime < new Date())}
            width="full"
          >
            Unlock
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HoneyModal;
