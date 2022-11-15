import { ReactNode } from 'react';
import { P2PPosition } from '../../types/p2p';

export interface P2PNftCardProps extends P2PPosition {
  footer?: ReactNode;
  isActive?: boolean;
  onClick: () => void;
}
