import { ReactNode } from 'react';

export type MarketsSidebarProps = {
  openPositions?: any;
  nftPrice: number;
  userAllowance: number;
  userDebt: number;
  loanToValue: number;
  fetchedReservePrice: number;
  calculatedInterestRate: number;
  currentMarketId: string;
  availableNFTS: any;
  isFetchingData?: boolean;
  executeDepositNFT: (
    mint: any,
    toast: any,
    name: string,
    creator: string,
    isLastItem: boolean,
  ) => Promise<void>;
  executeWithdrawNFT: (mint: any, toast: any, isLastItem: boolean,) => Promise<void>;
  executeBorrow: (val: any, toast: any) => void;
  executeRepay: (val: any, toast: any) => void;
  hideMobileSidebar?: () => void;
  collCount?: number;
  isLoadingNfts: Boolean;
};
