import { ReactNode } from 'react';

export type MarketsSidebarProps = {
  collectionId?: string;
  availableNFTs?: any;
  openPositions?: any;
  nftPrice: number;
  userAllowance: number;
  userDebt: number;
  loanToValue: number;
  fetchedSolPrice: number;
  calculatedInterestRate: number;
  executeDepositNFT: (mint: any, toast: any, name: string) => void;
  executeWithdrawNFT: (mint: any, toast: any) => void;
  executeBorrow: (val: any, toast: any) => void;
  executeRepay: (val: any, toast: any) => void;
  hideMobileSidebar?: () => void;
};
