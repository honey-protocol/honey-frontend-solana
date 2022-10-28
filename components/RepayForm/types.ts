export type RepayProps = {
  collectionId?: string;
  openPositions?: any;
  nftPrice?: number;
  userAllowance: number;
  userDebt: number;
  loanToValue: number;
  availableNFTs: any;
  fetchedSolPrice: number; 
  currentMarketId: string;
  executeWithdrawNFT: (mint: string, toast: any) => void;
  executeRepay: (val: number, toast: any) => void;
  hideMobileSidebar?: () => void;
  changeTab?: (tabKey: string) => void;
};
