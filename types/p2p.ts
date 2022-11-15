export enum P2PBorrowSidebarMode {
  NEW_BORROW = 'new_borrow',
  BORROW = 'borrow'
}

export enum PageMode {
  INITIAL_STATE = 'initial_state',
  CATEGORY_SELECTED = 'category_selected',
  COLLECTION_SELECTED = 'collection_selected'
}

export enum BorrowPageMode {
  INITIAL_STATE = 'initial_state',
  NFT_SELECTED = 'nft_selected'
}

export interface P2PCollection {
  name: string;
  imageUrl: string;
  total: number;
  items: number;
  requested: number;
  tag: string;
  verified?: boolean;
  id: string;
}

export interface P2PPosition {
  name: string;
  imageUrl: string;
  collectionName: string;
  request: number;
  ir: number;
  total: number;
  end: number;
  start: number;
  walletAddress: string;
  verified?: boolean;
  borrowerTelegram?: string;
  borrowerDiscord?: string;
  tag?: string;
  address: string;
}
