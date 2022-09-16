import { PublicKey } from '@solana/web3.js';

export type MarketTableRow = {
  key: string;
  name: string;
  rate: number;
  available: number;
  value: number;
  positions: Array<MarketTablePosition>;
};

export type MarketTablePosition = {
  name: string;
  image?: string;
  riskLvl?: number;
  debt?: number;
  available?: number;
  value?: number;
};

export type UserNFTs = {
  creators: [{
    address: string,
    share: number,
    verified: number
  }];
  image: string;
  mint: string;
  name: string;
  symbol: string;
  tokenId: string;
  updateAuthority: string;
}

export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
}
