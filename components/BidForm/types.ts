import { ToastProps } from 'hooks/useToast';

export type BidFormProps = {
  highestBiddingValue: number;
  userBalance: number;
  currentUserBid?: number;
  fetchedSolPrice: number;
  currentMarketId: string;
  highestBiddingAddress: string;
  stringyfiedWalletPK?: string;
  handleRevokeBid: (type: string, toast: ToastProps['toast'], mID: string) => void;
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
};
