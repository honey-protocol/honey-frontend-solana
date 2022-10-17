export type DepositFormProps = {
  userTotalDeposits: number;
  value: number;
  available: number;
  userWalletBalance: number;
  fetchedSolPrice: number;
  executeDeposit: (val: number, toast: any) => void;
};
