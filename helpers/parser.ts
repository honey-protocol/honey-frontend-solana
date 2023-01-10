import { GOKI_CODERS } from '@gokiprotocol/client';
import { makeParserHooks, makeProgramParserHooks } from '@saberhq/sail';
import { SNAPSHOTS_CODERS } from '@saberhq/snapshots';
import { QUARRY_CODERS } from '@quarryprotocol/quarry-sdk';

// import { HONEY_DAO_CODERS } from './sdk';

const parserHooks = makeParserHooks({
  ...GOKI_CODERS.SmartWallet.accountParsers,
  ...QUARRY_CODERS.MintWrapper.accountParsers
});

export const {
  mintWrapper: {
    useData: useParsedMintWrappers,
    useSingleData: useParsedMintWrapper
  },
  transaction: { useData: useParsedTXByKeys, useSingleData: useParsedTXByKey }
} = parserHooks;

export const {
  subaccountInfo: {
    useData: useSubaccountInfosData,
    useBatchedData: useBatchedSubaccountInfos,
    useSingleData: useSubaccountInfoData
  },
  transaction: {
    useData: useGokiTransactionsData,
    useBatchedData: useBatchedGokiTransactions,
    useSingleData: useGokiTransactionData
  },
  smartWallet: { useSingleData: useGokiSmartWalletData }
} = makeProgramParserHooks(GOKI_CODERS.SmartWallet);

export const {
  lockerHistory: {
    useSingleData: useLockerHistoriesData,
    useData: useLockerHistoryData,
    useBatchedData: useBatchedLockerHistories
  },
  escrowHistory: {
    useSingleData: useEscrowHistoriesData,
    useData: useEscrowHistoryData,
    useBatchedData: useBatchedEscrowHistories
  }
} = makeProgramParserHooks(SNAPSHOTS_CODERS.Snapshots);
