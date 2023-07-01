import { ToastProps } from 'hooks/useToast';
import { BiddingPosition } from '../../types/liquidate';

export type LendSidebarProps = {
  collectionId?: string;
  userBalance: number;
  isFetchingBids: boolean;
  biddingArray: any;
  highestBiddingValue: number;
  currentUserBid?: number;
  fetchedReservePrice: number;
  currentMarketId: string;
  highestBiddingAddress: string;
  stringyfiedWalletPK?: string;
  isFetchingData?: boolean;
  handleRevokeBid: (
    type: string,
    toast: ToastProps['toast'],
    mID: string
  ) => void;
  handleIncreaseBid: (
    type: string,
    userBid: number,
    toast: ToastProps['toast'],
    mID: string
  ) => void;
  handlePlaceBid: (
    type: string,
    userBid: number,
    toast: ToastProps['toast'],
    mID: string
  ) => void;
  onCancel: Function;
  isLoadingWalletBalance: boolean;
  loanCurrency: string;
};
