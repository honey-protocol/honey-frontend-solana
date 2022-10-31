import * as React from 'react';
import { createContext, useMemo, useState, useEffect, useContext } from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { SolanaProvider } from '@saberhq/solana-contrib';
import { GovernorWrapper, TribecaSDK } from '@tribecahq/tribeca-sdk';

import config from '../config';
import { VeHoneySDK, StakeWrapper, LockerWrapper } from '../helpers/sdk';

const HARD_CODED_WALLET = Keypair.fromSecretKey(
  Uint8Array.from([
    22, 250, 163, 95, 161, 69, 162, 10, 92, 245, 229, 52, 145, 142, 125, 204,
    118, 129, 237, 65, 168, 196, 95, 210, 187, 79, 245, 146, 214, 20, 31, 251,
    199, 180, 17, 213, 243, 82, 106, 185, 58, 28, 142, 91, 245, 186, 253, 133,
    63, 237, 3, 126, 158, 100, 172, 185, 119, 189, 145, 130, 40, 246, 170, 102
  ])
);

export interface GovernanceContextValueProps {
  locker: PublicKey;
  stakePool: PublicKey;
  governor: PublicKey;
  stakeWrapper?: StakeWrapper;
  lockerWrapper?: LockerWrapper;
  governorWrapper?: GovernorWrapper;
}

const STAKE_POOL_ADDR = new PublicKey(config.NEXT_PUBLIC_STAKE_POOL_ADDRESS);
const LOCKER_ADDR = new PublicKey(config.NEXT_PUBLIC_LOCKER_ADDR);
const GOVERNOR_ADDR = new PublicKey(config.NEXT_PUBLIC_GOVERNOR_ADDRESS);

const defaultGovernanceContextValue = {
  locker: LOCKER_ADDR,
  stakePool: STAKE_POOL_ADDR,
  governor: GOVERNOR_ADDR
};

export const GovernanceContext = createContext<GovernanceContextValueProps>(
  defaultGovernanceContextValue
);

export const GovernanceProvider: React.FC<React.ReactNode> = ({ children }) => {
  const connection = useConnection();
  const wallet = useConnectedWallet();

  const sdk = useMemo(() => {
    const provider = SolanaProvider.init({
      connection,
      wallet: wallet ?? new Wallet(HARD_CODED_WALLET),
      opts: { commitment: 'confirmed' }
    });
    return VeHoneySDK.load({ provider });
  }, [connection, wallet]);

  const [stakeWrapper, setStakeWrapper] = useState<StakeWrapper>();
  const [lockerWrapper, setLockerWrapper] = useState<LockerWrapper>();
  const [governorWrapper, setGovernorWrapper] = useState<GovernorWrapper>();

  async function loadWrappers(sdk: VeHoneySDK) {
    const stakeWrapper = await StakeWrapper.load(sdk, STAKE_POOL_ADDR);
    const lockerWrapper = await LockerWrapper.load(
      sdk,
      LOCKER_ADDR,
      GOVERNOR_ADDR
    );
    const tribecaSDK = TribecaSDK.load({ provider: sdk.provider });
    const governorWrapper = new GovernorWrapper(tribecaSDK, GOVERNOR_ADDR);
    setStakeWrapper(stakeWrapper);
    setLockerWrapper(lockerWrapper);
    setGovernorWrapper(governorWrapper);
  }

  useEffect(() => {
    loadWrappers(sdk);

    const timer = setInterval(() => {
      loadWrappers;
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [sdk]);

  return (
    <GovernanceContext.Provider
      value={{
        ...defaultGovernanceContextValue,
        stakeWrapper,
        lockerWrapper,
        governorWrapper
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
};

export const useGovernanceContext = () => {
  const context = useContext(GovernanceContext);

  if (!context) {
    throw new Error('Govern context provided undefined');
  }

  return context;
};
