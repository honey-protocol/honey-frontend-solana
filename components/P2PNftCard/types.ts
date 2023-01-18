import { ReactNode } from 'react';
import { P2PLoan, P2PPosition } from '../../types/p2p';

export interface P2PNftCardProps extends NFT {
  footer?: ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

export interface P2PLoanCardProps extends P2PLoan {
  footer?: ReactNode;
  isActive?: boolean;
  onClick: () => void;
}
