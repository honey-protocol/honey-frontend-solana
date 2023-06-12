import { useState, useEffect } from 'react';

import { HoneyUser } from '@honey-finance/sdk';

import { roundTwoDecimalsUp } from 'helpers/math/math';

/**
 * @description fetches user level data for a specific market
 * @params honey user
 * @returns loading state | {userDebt, userAllowance, liquidationPrice, loanToValue, collateralValue} | errorObject?
 */
export default function useFetchUserLevelData(honeyUser: HoneyUser) {
  const [status, setStatus] = useState<{
    loadingUserData: boolean;
    userData: {
      userDebt: number;
      userTotalDeposits: number;
      userAllowance: number;
      liquidationPrice: number;
      liquidationThreshold: number;
      loanToValue: number;
    };
    errorFetchingUserLevelData?: Error;
  }>({
    loadingUserData: false,
    userData: {
      userDebt: 0,
      userTotalDeposits: 0,
      userAllowance: 0,
      liquidationPrice: 0,
      liquidationThreshold: 0,
      loanToValue: 0
    }
  });
  // fetches the users data of this specific market
  const fetchData = async () => {
    try {
      setStatus({
        loadingUserData: true,
        userData: {
          userDebt: 0,
          userTotalDeposits: 0,
          userAllowance: 0,
          liquidationPrice: 0,
          liquidationThreshold: 0,
          loanToValue: 0
        }
      });

      let { allowance, debt, liquidationThreshold, ltv } =
        await honeyUser.fetchAllowanceAndDebt(0);
      // total deposits of user in market
      const userTotalDeposits = await honeyUser.fetchUserDeposits(0);
      // round debt
      debt ? roundTwoDecimalsUp(debt, 2) : 0;
      // set allowance to zero if it's < 1
      allowance = allowance < 0 ? 0 : allowance;

      const liquidationPrice = debt / liquidationThreshold;

      const userData = {
        userDebt: debt,
        userTotalDeposits,
        userAllowance: allowance,
        liquidationPrice,
        liquidationThreshold,
        loanToValue: ltv
      };

      return setStatus({ loadingUserData: false, userData });
    } catch (error) {
      return setStatus({
        loadingUserData: false,
        userData: {
          userDebt: 0,
          userTotalDeposits: 0,
          userAllowance: 0,
          liquidationPrice: 0,
          liquidationThreshold: 0,
          loanToValue: 0
        }
      });
    }
  };

  // refetch the user level data values
  const refetchUserLevelData = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (!honeyUser) {
      setStatus({
        loadingUserData: false,
        userData: {
          userDebt: 0,
          userTotalDeposits: 0,
          userAllowance: 0,
          liquidationPrice: 0,
          liquidationThreshold: 0,
          loanToValue: 0
        },
        errorFetchingUserLevelData: new Error('No honey user provided')
      });
      return;
    }

    fetchData();
  }, [honeyUser]);

  return { ...status, refetchUserLevelData };
}
