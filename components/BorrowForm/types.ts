export type BorrowProps = {
    collectionId?: string;
    availableNFTs?: any;
    openPositions?: any;
    nftPrice?: number;
    executeDepositNFT: (mint: any) => void;
    executeBorrow: (val: any) => void;
  };
  