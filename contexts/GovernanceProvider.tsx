import * as React from 'react';
import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction
} from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { SolanaProvider } from '@saberhq/solana-contrib';
import { Token } from '@saberhq/token-utils';
import {
  GovernorWrapper,
  TribecaSDK,
  ProposalData,
  ProposalMetaData,
  ProposalState,
  getProposalState,
  GovernorData
} from '@tribecahq/tribeca-sdk';

import config from '../config';
import {
  VeHoneySDK,
  StakeWrapper,
  LockerWrapper,
  PoolUser,
  PoolInfo,
  LockerData,
  EscrowData,
  ReceiptData
} from '../helpers/sdk';

const HARD_CODED_WALLET = Keypair.fromSecretKey(
  Uint8Array.from([
    22, 250, 163, 95, 161, 69, 162, 10, 92, 245, 229, 52, 145, 142, 125, 204,
    118, 129, 237, 65, 168, 196, 95, 210, 187, 79, 245, 146, 214, 20, 31, 251,
    199, 180, 17, 213, 243, 82, 106, 185, 58, 28, 142, 91, 245, 186, 253, 133,
    63, 237, 3, 126, 158, 100, 172, 185, 119, 189, 145, 130, 40, 246, 170, 102
  ])
);

export interface Proposal {
  pubkey: PublicKey;
  data: ProposalData;
  status: ProposalState;
  meta?: ProposalMetaData;
}

export interface StakePoolUser {
  pubkey: PublicKey;
  data: PoolUser;
}

export interface Escrow {
  pubkey: PublicKey;
  data: EscrowData;
  receipts: Map<number, ReceiptData>;
}

export interface GovernanceContextValueProps {
  stakeWrapper?: StakeWrapper;
  lockerWrapper?: LockerWrapper;
  governorWrapper?: GovernorWrapper;
  isLoading: boolean;
  proposals?: Proposal[];
  stakePoolInfo?: PoolInfo;
  stakePoolUser?: StakePoolUser;
  lockerInfo?: LockerData;
  governorInfo?: GovernorData;
  escrow?: Escrow;
  govToken?: Token;
  isProcessing: boolean;
  setIsProcessing?: Dispatch<SetStateAction<boolean>>;
  reload?: () => Promise<void>;
}

const STAKE_POOL_ADDR = new PublicKey(config.NEXT_PUBLIC_STAKE_POOL_ADDRESS);
const LOCKER_ADDR = new PublicKey(config.NEXT_PUBLIC_LOCKER_ADDR);
const GOVERNOR_ADDR = new PublicKey(config.NEXT_PUBLIC_GOVERNOR_ADDRESS);

const defaultGovernanceContextValue = {
  isLoading: false,
  isProcessing: false
};

export const GovernanceContext = createContext<GovernanceContextValueProps>(
  defaultGovernanceContextValue
);

export const GovernanceProvider: React.FC<React.ReactNode> = ({ children }) => {
  const connection = useConnection();
  const wallet = useConnectedWallet();

  const [stakeWrapper, setStakeWrapper] = useState<StakeWrapper>();
  const [lockerWrapper, setLockerWrapper] = useState<LockerWrapper>();
  const [governorWrapper, setGovernorWrapper] = useState<GovernorWrapper>();

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [proposals, setProposals] = useState<Proposal[]>();
  const [pool, setPool] = useState<PoolInfo>();
  const [locker, setLocker] = useState<LockerData>();
  const [governor, setGovernor] = useState<GovernorData>();
  const [user, setUser] = useState<StakePoolUser>();
  const [escrow, setEscrow] = useState<Escrow>();
  const [govToken, setGovToken] = useState<Token>();

  const sdk = useMemo(() => {
    const provider = SolanaProvider.init({
      connection,
      wallet: wallet ?? new Wallet(HARD_CODED_WALLET),
      opts: { commitment: 'confirmed' }
    });
    return VeHoneySDK.load({ provider });
  }, [connection, wallet]);

  async function load() {
    if (sdk) {
      setIsLoading(true);

      // Load wrappers
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

      // Load proposals
      const proposalDatas = await governorWrapper.program.account.proposal.all([
        {
          memcmp: {
            offset: 8,
            bytes: governorWrapper.governorKey.toBase58()
          }
        }
      ]);
      const fetchProposalMetasPromise = proposalDatas.map(p =>
        governorWrapper.fetchProposalMeta(p.publicKey)
      );
      const proposalMetas = await Promise.all(fetchProposalMetasPromise);

      const proposals: Proposal[] = proposalDatas.map(p => {
        const meta = proposalMetas.find(meta => meta.proposal === p.publicKey);
        return {
          pubkey: p.publicKey,
          data: p.account,
          status: getProposalState({ proposalData: p.account }),
          meta
        };
      });
      setProposals(proposals);

      // Load stake pool and locker infos
      const [pool, locker, governor] = await Promise.all([
        stakeWrapper.data(),
        lockerWrapper.data(),
        governorWrapper.data()
      ]);
      setPool(pool);
      setLocker(locker);
      setGovernor(governor);

      // Load stake pool user
      try {
        const user = await stakeWrapper.fetchPoolUser();
        setUser(user);
      } catch (e) {
        setUser(undefined);
      }

      try {
        const [escrow, receipts] = await Promise.all([
          lockerWrapper.fetchEscrowData(),
          lockerWrapper.fetchAllReceipts()
        ]);
        const receiptsMap = receipts.reduce((m, i) => {
          return m.set(i.account.receiptId.toNumber(), i.account);
        }, new Map<number, ReceiptData>());
        setEscrow({ ...escrow, receipts: receiptsMap });
      } catch (e) {
        setEscrow(undefined);
      }

      // Load gov token
      try {
        const token = await Token.load(connection, locker.tokenMint);
        setGovToken(token ?? undefined);
      } catch (e) {
        setGovToken(undefined);
      }

      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();

    const timer = setInterval(() => {
      load();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <GovernanceContext.Provider
      value={{
        stakeWrapper,
        lockerWrapper,
        governorWrapper,
        isLoading,
        proposals,
        stakePoolInfo: pool,
        stakePoolUser: user,
        lockerInfo: locker,
        governorInfo: governor,
        escrow,
        govToken,
        isProcessing,
        setIsProcessing,
        reload: load
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
};

export const useGovernanceContext = () => {
  const context = useContext(GovernanceContext);

  if (!context) {
    throw new Error('Govern context undefined');
  }

  return context;
};
