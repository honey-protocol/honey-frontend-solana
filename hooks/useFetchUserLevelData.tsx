import { useState, useEffect } from 'react';

import { HoneyUser, MarketBundle } from '@honey-finance/sdk';

import { roundTwoDecimalsUp } from 'helpers/math/math';
import { MarketTableRow } from 'types/markets';
export interface UserData {
  userDebt: number;
  userTotalDeposits: number;
  userAllowance: number;
  liquidationPrice: number;
  liquidationThreshold: number;
  loanToValue: number;
}

/**
 * @description fetches user level data for a specific market
 * @params honey user
 * @returns loading state | {userDebt, userAllowance, liquidationPrice, loanToValue, collateralValue} | errorObject?
 */
export const useFetchUserLevelData = (
  honeyUser: HoneyUser,
  currentCollection?: MarketTableRow
) => {
  const [status, setStatus] = useState<{
    loadingUserData: boolean;
    mID?: string;
    userData?: UserData;
    errorFetchingUserLevelData?: Error;
  }>({ loadingUserData: false });

  // fetches the users data of this specific market
  const fetchData = async () => {
    if (!honeyUser) return;
    if (!currentCollection) return;
    if (
      honeyUser &&
      honeyUser.market.address.toString() !== currentCollection.id
    )
      return setStatus({
        loadingUserData: false,
        mID: currentCollection.id
      });

    setStatus({ loadingUserData: true });

    try {
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

      return setStatus({
        loadingUserData: false,
        userData,
        mID: currentCollection.id
      });
    } catch (error) {
      return setStatus({
        loadingUserData: false,
        mID: currentCollection.id
      });
    }
  };

  // refetch the user level data values
  const refetchUserLevelData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [honeyUser]);

  return { ...status, refetchUserLevelData };
};
