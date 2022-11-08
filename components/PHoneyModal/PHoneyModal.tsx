import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Box, Button, Input, Stack, Text, Tag } from 'degen';
import { TokenAmount } from '@saberhq/token-utils';

import { useStake } from 'hooks/useVeHoney';
import { useAccountByMint } from 'hooks/useAccounts';
import { PHONEY_DECIMALS } from 'helpers/sdk/constant';
import { convertToBN } from 'helpers/utils';

// console.log("The stake pool address is : ", process.env.PUBLIC_NEXT_STAKE_POOL_ADDRESS)
const PHoneyModal = () => {
  const [amount, setAmount] = useState<number>(0);

  const { pool, user, deposit, claim, claimableAmount, preToken } = useStake();
  const pHoneyAccount = useAccountByMint(pool?.pTokenMint);

  const isClaimable = useMemo(() => {
    if (!claimableAmount) return false;

    return !claimableAmount.equalTo(0);
  }, [claimableAmount]);

  const depositedAmount = useMemo(() => {
    if (!user || !preToken) return null;

    return new TokenAmount(preToken, user.data.depositAmount);
  }, [user, preToken]);

  const pHoneyAmount = useMemo(() => {
    if (!pHoneyAccount || !preToken) return null;

    return new TokenAmount(preToken, pHoneyAccount.data.amount);
  }, [pHoneyAccount, preToken]);

  const handleOnChange = (event: any) => {
    // ideally we want to implement a debaunce here and not fire the function every second the user interacts with it

    setAmount(Number(event.target.value));
  };

  const handleDeposit = useCallback(async () => {
    if (!amount || !preToken) return;

    await deposit(convertToBN(amount, preToken.decimals));
  }, [deposit, amount, preToken]);

  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Get HONEY
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Text align="center" weight="semiBold">
            Deposit pHONEY and receive HONEY
          </Text>
          <Box
            marginX="auto"
            borderColor="accent"
            borderWidth="0.375"
            height="7"
            borderRadius="large"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3/4"
          >
            <Text variant="small" color="accent">
              1 pHONEY = 1 HONEY
            </Text>
          </Box>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHONEY deposited
              </Text>
              <Text variant="small">{depositedAmount?.asNumber ?? '-'}</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Claimable Amount
              </Text>
              <Text variant="small">{claimableAmount?.asNumber ?? '0'}</Text>
            </Stack>
          </Stack>
          <Input
            type="number"
            label="Amount"
            labelSecondary={
              <Tag>{pHoneyAmount?.asNumber ?? '-'} pHONEY max</Tag>
            }
            disabled={!pHoneyAmount?.asNumber}
            max={pHoneyAmount?.asNumber ?? ''}
            min={0}
            hideLabel
            value={amount || ''}
            units="pHONEY"
            placeholder="0"
            onChange={handleOnChange}
          />
          <Button onClick={handleDeposit} disabled={!amount} width="full">
            {amount ? 'Deposit' : 'Enter amount'}
          </Button>
          <Button onClick={claim} disabled={!isClaimable} width="full">
            Claim
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PHoneyModal;
