export type BorrowProps = {
  isFetchingData?: boolean;
  collectionId?: string;
  availableNFTs?: any;
  openPositions?: any;
  nftPrice: number;
  userAllowance: number;
  userDebt: number;
  loanToValue: number;
  fetchedReservePrice: number;
  calculatedInterestRate: number;
  currentMarketId: string;
  isBulkLoan?: boolean;
  executeDepositNFT: (
    mint: string,
    toast: any,
    name: string,
    creator: string
  ) => void;
  executeWithdrawNFT: (mint: string, toast: any) => void;
  executeBorrow: (val: number, toast: any) => void;
  hideMobileSidebar?: () => void;
};
