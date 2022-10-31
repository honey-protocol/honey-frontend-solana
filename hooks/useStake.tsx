import { useCallback, useEffect, useMemo, useState } from 'react';
import { BN } from '@project-serum/anchor';

import { useGovernanceContext } from '../contexts/GovernanceProvider';
import {
  PoolInfo,
  PoolUser,
  calculateClaimableAmountFromStakePool
} from '../helpers/sdk';

export const useStake = () => {
  const { stakeWrapper, locker, governor } = useGovernanceContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<PoolUser>();
  const [pool, setPool] = useState<PoolInfo>();

  async function fetch() {
    if (stakeWrapper) {
      const [pool, user] = await Promise.all([
        stakeWrapper.data(),
        stakeWrapper.fetchPoolUser()
      ]);

      setPool(pool);
      setUser(user);
    }
  }

  useEffect(() => {
    fetch();

    const timer = setInterval(() => {
      fetch();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const deposit = useCallback(
    async (amount: BN) => {
      if (stakeWrapper) {
        const tx = await stakeWrapper.deposit(amount);
        setIsProcessing(true);
        const receipt = await tx.confirm();
        setIsProcessing(false);
        return {
          receipt
        };
      }
      return null;
    },
    [stakeWrapper]
  );

  const claim = useCallback(async () => {
    if (stakeWrapper) {
      const tx = await stakeWrapper.claim();
      setIsProcessing(true);
      const receipt = await tx.confirm();
      setIsProcessing(false);
      return {
        receipt
      };
    }
    return null;
  }, [stakeWrapper]);

  const vest = useCallback(
    async (amount: BN, duration: BN) => {
      if (stakeWrapper) {
        const tx = await stakeWrapper.vest(
          amount,
          duration,
          undefined,
          locker,
          governor
        );
        setIsProcessing(true);
        const receipt = await tx.confirm();
        setIsProcessing(false);
        return {
          receipt
        };
      }
      return null;
    },
    [stakeWrapper]
  );

  const claimableAmount = useMemo(() => {
    if (pool && user) {
      return calculateClaimableAmountFromStakePool(user, pool.params);
    }
    return null;
  }, [pool, user]);

  return {
    isProcessing,
    deposit,
    claim,
    vest,
    user,
    pool,
    claimableAmount
  };
};
