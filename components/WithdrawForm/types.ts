export type WithdrawFormProps = {
  userTotalDeposits: number;
  value: number;
  available: number;
  executeWithdraw: (val: number, toast: any) => void;
};
