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
    creator: string
  ) => void;
  executeWithdrawNFT: (mint: any, toast: any) => void;
  executeBorrow: (val: any, toast: any) => void;
  executeRepay: (val: any, toast: any) => void;
  hideMobileSidebar?: () => void;
  collCount?: number;
};
