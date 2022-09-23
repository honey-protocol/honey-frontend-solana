export type LendSidebarProps = {
  collectionId?: string;
  userTotalDeposits: number;
  executeDeposit: (val: number) => void;
  executeWithdraw: (val: number) => void;
};
