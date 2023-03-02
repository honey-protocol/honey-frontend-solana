export type CurrentBidCardProps = {
  id: string;
  hasBorder?: boolean;
  date: number;
  walletAddress: string;
  usdcAmount: number;
  usdcValue: number;
  solAmount: number;
  solValue: number;
  fetchedReservePrice: number;
};
