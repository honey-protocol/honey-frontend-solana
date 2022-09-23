export type BorrowProps = {
    collectionId?: string;
    availableNFTs?: any;
    openPositions?: any;
    nftPrice: number;
    userAllowance: number;
    userDebt: number;
    loanToValue: number;
    executeDepositNFT: (mint: string) => void;
    executeBorrow: (val: number) => void;
  };
  