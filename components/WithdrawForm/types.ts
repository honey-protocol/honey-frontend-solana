export type WithdrawFormProps = {
  userTotalDeposits: number;
  value: number;
  available: number;
  fetchedSolPrice: number;
  executeWithdraw: (val: number, toast: any) => void;
  onCancel: Function;
};
