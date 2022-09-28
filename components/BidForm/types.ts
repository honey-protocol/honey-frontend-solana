export type BidFormProps = {
    highestBiddingValue: number;
    userBalance: number;
    currentUserBid: number;
    handleRevokeBid: (type: string) => void;
    handleIncreaseBid: (type: string, userBid: number) => void;
    handlePlaceBid: (type: string, userBid: number) => void;
  };
  