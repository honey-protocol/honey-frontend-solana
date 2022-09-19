export type MarketsSidebarProps = {
  collectionId?: string;
  availableNFTs?: any;
  openPositions?: any;
  nftPrice: number;
  executeDepositNFT: (mint: any) => void;
};
