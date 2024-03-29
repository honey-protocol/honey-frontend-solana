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
    creator: string,
    isLastItem: boolean,
  ) => Promise <void>;
  executeWithdrawNFT: (mint: string, toast: any, isLastItem: boolean,) => Promise<void>;
  executeBorrow: (val: number, toast: any) => void;
  hideMobileSidebar?: () => void;
  collCount?: number;
};
