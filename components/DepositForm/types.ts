export type DepositFormProps = {
  userTotalDeposits: number;
  value: number;
  available: number;
  userWalletBalance: number;
  fetchedReservePrice: number;
  marketImage: any;
  currentMarketId: string;
  activeInterestRate: number;
  executeDeposit: (val: number, toast: any) => void;
  onCancel: Function;
  isFetchingData?: boolean;
};
