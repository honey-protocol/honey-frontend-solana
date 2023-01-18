import { P2PLoan } from 'types/p2p';

export type LendingSidebarProps = {
  onCancel: Function;
  loan?: P2PLoan;
  collectionId: string;
  collectionName: string;
};
