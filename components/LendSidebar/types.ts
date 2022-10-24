export type LendSidebarProps = {
  collectionId?: string;
  userTotalDeposits: number;
  available: number;
  value: number;
  userWalletBalance: number;
  fetchedSolPrice: number;
  marketImage: any;
  currentMarketId: string;
  executeDeposit: (val: number) => void;
  executeWithdraw: (val: number) => void;
};
