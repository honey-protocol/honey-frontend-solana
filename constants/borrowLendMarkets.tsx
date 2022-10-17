import { Connection, PublicKey } from '@solana/web3.js';

export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
};

export type Market = {
    id: string;
    key: string;
    // imageUrl: string;
    name: string;
    rate: number;
    available: number;
    value: number;
    allowance: number;
    positions: Array<OpenPositions>;
    connection?: any;
    user?: any;
    debt: number;
    utilizationRate: number;
  };
  
  export const marketCollections: Market[] = [
    {
      id: '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3',
      key: 'HNYG',
      // imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db',
      name: 'Honey Genesis Bee',
      rate: 0,
      available: 0,
      value: 0,
      allowance: 0,
      positions: [],
      connection: undefined,
      user: undefined,
      debt: 0,
      utilizationRate: 0,
    },
    // TODO: uncomment below stated markets when market ID exists 
    // {
    //   id: '',
    //   key: 'LIFINITY',
    //   // imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8',
    //   name: 'Lifinity Flares',
    //   rate: 0,
    //   available: 0,
    //   value: 0,
    //   allowance: 0,
    //   positions: [],
    //   debt: 0,
    // },
    // {
    //   id: '',
    //   key: 'ATD',
    //   // imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/atadians_pfp_1646721263627.gif',
    //   name: 'OG Atadians',
    //   rate: 0,
    //   available: 0,
    //   value: 0,
    //   allowance: 0,
    //   positions: [],
    //   debt: 0,
    // },
    {
      id: 'Bw77MGpg189EaATjN67WXcnp3c4544LhKoV4Ftmdg4C',
      key: 'NOOT',
      // imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png',
      name: 'Pesky Penguin',
      rate: 0,
      available: 0,
      value: 0,
      allowance: 0,
      positions: [],
      connection: undefined,
      user: undefined,
      debt: 0,
      utilizationRate: 0
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