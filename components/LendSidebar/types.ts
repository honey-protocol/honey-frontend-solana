export type LendSidebarProps = {
  collectionId?: string;
  userTotalDeposits: number;
  available: number;
  value: number;
  userWalletBalance: number;
  fetchedSolPrice: number;
  marketImage: any;
  currentMarketId: string;
  activeInterestRate: number;
  executeDeposit: (val: number) => void;
  executeWithdraw: (val: number) => void;
  onCancel: Function;
  isFetchingData?: boolean;
};
