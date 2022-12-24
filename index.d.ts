declare module '*.png';
declare module '*.svg';

type Creator = {
  address: string;
  verified: number;
  share: number;
};

//tokenAcc is same as pubkey,
type NFT = {
  name: string;
  symbol?: string;
  updateAuthority: string;
  image: string;
  creators: Array<Creator>;
  tokenId: string;
  mint: string;
};

declare global {
  interface Window {
    solana: any;
  }
}

declare var window: any;

type HoneyTheme = 'dark' | 'light';
