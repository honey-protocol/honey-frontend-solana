import { ReactNode } from 'react';
import { P2PLoans, P2PPosition } from '../../types/p2p';

export interface P2PBorrowMainListProps {
  data: NFT[];
  PageModeSwitchTab?: () => JSX.Element;
  onSelect?: (address: string) => void;
  selected?: string | undefined;
}

export interface P2PRepayMainListProps {
  data: P2PLoans;
  PageModeSwitchTab?: () => JSX.Element;
  onSelect?: (address: string) => void;
  selected?: string | undefined;
}
