export type WithdrawFormProps = {
  userTotalDeposits: number;
  value: number;
  available: number;
  fetchedReservePrice: number;
  marketImage: any;
  currentMarketId: string;
  activeInterestRate: number;
  executeWithdraw: (val: number, toast: any) => void;
  onCancel: Function;
  isFetchingData?: boolean;
};
