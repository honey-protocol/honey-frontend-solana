import { PublicKey } from '@solana/web3.js';

export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
};

export type Market = {
    key: string;
    // imageUrl: string;
    name: string;
    rate: number;
    available: number;
    value: number;
    allowance: number;
    positions: Array<OpenPositions>;
    debt: number;
  };
  
  export const marketCollections: Market[] = [
    {
      key: 'HNYG',
      // imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db',
      name: 'Honey Genesis Bee',
      rate: 0,
      available: 0,
      value: 0,
      allowance: 0,
      positions: [],
      debt: 0,
    },
    {
      key: 'LIFINITY',
      // imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8',
      name: 'Lifinity Flares',
      rate: 0,
      available: 0,
      value: 0,
      allowance: 0,
      positions: [],
      debt: 0,
    },
    {
      key: 'ATD',
      // imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/atadians_pfp_1646721263627.gif',
      name: 'OG Atadians',
      rate: 0,
      available: 0,
      value: 0,
      allowance: 0,
      positions: [],
      debt: 0,
    },
    {
      key: 'NOOT',
      // imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png',
      name: 'Pesky Penguins',
      rate: 0,
      available: 0,
      value: 0,
      allowance: 0,
      positions: [],
      debt: 0,
    }
  ];
  // market names
  export const HONEY_GENESIS_BEE = 'Honey Genesis Bee';
  export const LIFINITY_FLARES = 'Lifinity Flares';
  export const OG_ATADIANS = 'OG Atadians';
  export const PESKY_PENGUINS = 'Pesky Penguin';
  // fees
  export const LIQUIDATION_FEE = 0.65;
  export const BORROW_FEE = 0;