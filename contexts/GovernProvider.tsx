import * as React from 'react';
import { createContext, Provider } from 'react';
import { PublicKey } from '@solana/web3.js';

import { PoolInfo, PoolUser } from 'helpers/sdk';
import config from 'config';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { useGovernSDK } from 'hooks/useGovernSDK';

export interface GovernContextValueProps {
  stakePoolInfo?: PoolInfo;
  stakePoolUser?: PoolUser;
}

const STAKE_POOL_ADDR = new PublicKey(config.NEXT_PUBLIC_STAKE_POOL_ADDRESS);
const LOCKER_ADDR = new PublicKey(config.NEXT_PUBLIC_LOCKER_ADDR);
const GOVERNOR_ADDR = new PublicKey(config.NEXT_PUBLIC_GOVERNOR_ADDRESS);

export const GovernContext = createContext<GovernContextValueProps>({});

const GovernProvider: React.FC<React.ReactNode> = ({ children }) => {
  const connection = useConnection();
  const wallet = useConnectedWallet();
  const { stakeClient, veHoneyClient, governClient } = useGovernSDK({
    governor: GOVERNOR_ADDR
  });

  return <GovernContext.Provider value={{}}>{children}</GovernContext.Provider>;
};
