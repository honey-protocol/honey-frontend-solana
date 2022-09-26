export type LendSidebarProps = {
  collectionId?: string;
  userTotalDeposits: number;
  available: number;
  value: number;
  executeDeposit: (val: number) => void;
  executeWithdraw: (val: number) => void;
};
