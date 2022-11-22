import { P2PPosition } from '../../types/p2p';

export interface P2PBorrowingMainListProps {
  data: P2PPosition[];
  onSelect?: (address: string) => void;
  selected?: string | undefined;
}
