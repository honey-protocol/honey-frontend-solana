import { ToastProps } from 'hooks/useToast';
import { BiddingPosition } from '../../types/liquidate';

export type LendSidebarProps = {
  collectionId?: string;
  userBalance: number;
  biddingArray: any;
  highestBiddingValue: number;
  currentUserBid: number;
  fetchedSolPrice: number;
  handleRevokeBid: (type: string, toast: ToastProps['toast']) => void;
  handleIncreaseBid: (
    type: string,
    userBid: number,
    toast: ToastProps['toast']
  ) => void;
  handlePlaceBid: (
    type: string,
    userBid: number,
    toast: ToastProps['toast']
  ) => void;
  onCancel: Function;
};
