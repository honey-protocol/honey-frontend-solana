import { BiddingPosition } from '../../types/liquidate';

export type LendSidebarProps = {
  collectionId?: string;
  userBalance: number;
  biddingArray: any;
  highestBiddingValue: number;
  currentUserBid: number;
  handleRevokeBid: (type: string) => void;
  handleIncreaseBid: (type: string, userBid: number) => void;
  handlePlaceBid: (type: string, userBid: number) => void;
};