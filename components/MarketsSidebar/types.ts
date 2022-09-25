import { ReactNode } from 'react';

export type MarketsSidebarProps = {
  collectionId?: string;
  availableNFTs?: any;
  openPositions?: any;
  nftPrice: number;
  userAllowance: number;
  userDebt: number;
  userUSDCBalance: number;
  loanToValue: number;
  executeDepositNFT: (mint: any, toast: any) => void;
  executeWithdrawNFT: (mint: any, toast: any) => void;
  executeBorrow: (val: any, toast: any) => void;
  executeRepay: (val: any, toast: any) => void;
};
