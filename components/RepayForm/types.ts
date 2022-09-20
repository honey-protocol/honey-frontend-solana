export type RepayProps = {
    collectionId?: string;
    openPositions?: any;
    nftPrice?: number;
    executeWithdrawNFT: (mint: any) => void;
    executeRepay: (val: any) => void;
  };
  