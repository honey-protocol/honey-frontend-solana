export type LendSidebarProps = {
  collectionId?: string;
  executeDeposit: (val: number) => void;
  executeWithdraw: (val: number) => void;
};
