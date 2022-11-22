export type WithdrawFormProps = {
  userTotalDeposits: number;
  value: number;
  available: number;
  fetchedSolPrice: number;
  marketImage: any;
  currentMarketId: string;
  executeWithdraw: (val: number, toast: any) => void;
  onCancel: Function;
};
