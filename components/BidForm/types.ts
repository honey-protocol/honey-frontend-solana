import { ToastProps } from 'hooks/useToast';

export type BidFormProps = {
  highestBiddingValue: number;
  userBalance: number;
  currentUserBid?: number;
  fetchedSolPrice: number;
  currentMarketId: string;
  highestBiddingAddress: string;
  stringyfiedWalletPK?: string;
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
