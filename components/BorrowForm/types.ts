export type BorrowProps = {
    collectionId?: string;
    availableNFTs?: any;
    openPositions?: any;
    nftPrice?: number;
    executeDepositNFT: (mint: string) => void;
    executeBorrow: (val: number) => void;
  };
  