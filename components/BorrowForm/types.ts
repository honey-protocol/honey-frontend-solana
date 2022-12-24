export type BorrowProps = {
  collectionId?: string;
  availableNFTs?: any;
  openPositions?: any;
  nftPrice: number;
  userAllowance: number;
  userDebt: number;
  loanToValue: number;
  fetchedSolPrice: number;
  calculatedInterestRate: number;
  currentMarketId: string;
  hasNFTDeposited: boolean;
  executeDepositNFT: (mint: string, toast: any, name: string, creator: string) => void;
  executeBorrow: (val: number, toast: any) => void;
  hideMobileSidebar?: () => void;
};
