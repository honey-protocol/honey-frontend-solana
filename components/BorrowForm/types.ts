export type BorrowProps = {
  collectionId?: string;
  availableNFTs?: any;
  openPositions?: any;
  nftPrice: number;
  userAllowance: number;
  userDebt: number;
  loanToValue: number;
  executeDepositNFT: (mint: string, toast: any) => void;
  executeBorrow: (val: number, toast: any) => void;
  hideMobileSidebar?: () => void;
};
