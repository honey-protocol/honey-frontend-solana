import { P2PLoan, P2PLoans, P2PPosition } from '../../types/p2p';

export interface P2PLendingMainListProps {
  isFilterOpened?: boolean;
  data: P2PLoans;
  onSelect?: (loan: P2PLoan) => void;
  selected?: P2PLoan;
}
