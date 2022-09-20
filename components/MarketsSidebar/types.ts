export type MarketsSidebarProps = {
  collectionId?: string;
  availableNFTs?: any;
  openPositions?: any;
  nftPrice: number;
  executeDepositNFT: (mint: any) => void;
  executeWithdrawNFT: (mint: any) => void;
  executeBorrow: (val: any) => void;
  executeRepay: (val: any) => void;
};
