export type RepayProps = {
    collectionId?: string;
    openPositions?: any;
    nftPrice?: number;
    userAllowance: number;
    userDebt: number;
    userUSDCBalance: number;
    loanToValue: number;
    executeWithdrawNFT: (mint: any) => void;
    executeRepay: (val: any) => void;
  };
  