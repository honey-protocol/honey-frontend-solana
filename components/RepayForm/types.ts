export type RepayProps = {
    collectionId?: string;
    openPositions?: any;
    nftPrice?: number;
    userAllowance: number;
    userDebt: number;
    userUSDCBalance: number;
    loanToValue: number;
    executeWithdrawNFT: (mint: string) => void;
    executeRepay: (val: number) => void;
  };
  