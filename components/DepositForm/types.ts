export type DepositFormProps = {
  userTotalDeposits: number;
  value: number;
  available: number;
  executeDeposit: (val: number, toast: any) => void;
};
