import { ToastProps } from 'hooks/useToast';

export type BidFormProps = {
  highestBiddingValue: number;
  userBalance: number;
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
  isFetchingBids: boolean;
};

export type Bid = {
  bid: string;
  bidder: string;
  bidLimit: string;
};
