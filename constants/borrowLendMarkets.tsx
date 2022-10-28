import { Connection, PublicKey } from '@solana/web3.js';
import { MarketTableRow } from 'types/markets';

export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
};

// export type Market = {
//     id: string;
//     key: string;
//     // imageUrl: string;
//     name: string;
//     rate: number;
//     available: number;
//     value: number;
//     allowance: number;
//     positions: Array<OpenPositions>;
//     connection?: any;
//     user?: any;
//     debt: number;
//     utilizationRate: number;
//     stats?: any;
//   };
  
  export const marketCollections: MarketTableRow[] = [
    {
      id: '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3',
      key: 'HNYG',
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
    {
      id: 'Bw77MGpg189EaATjN67WXcnp3c4544LhKoV4Ftmdg4C',
      key: 'NOOT',
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
    },
    {
      id: 'H2H2pJuccdvpET9A75ajB3GgdYdCUL4T3kiwUMA6DJ7q',
      key: 'LIFINITY',
      name: 'Lifinity Flares',
      rate: 0,
      available: 0,
      value: 0,
      allowance: 0,
      positions: [],
      connection: undefined,
      user: undefined,
      debt: 0,
      utilizationRate: 0
    },
    {
      id: 'Bxk1JQCbVjpeFnjzvH5n9bepnZeHjRADUFwZiVC7L5Gq',
      key: 'ATD',
      name: 'OG Atadians',
      rate: 0,
      available: 0,
      value: 0,
      allowance: 0,
      positions: [],
      connection: undefined,
      user: undefined,
      debt: 0,
      utilizationRate: 0
    },
    {
      id: 'F8rZviSSuqgkTsjMeoyrTUSNSqh7yNDCAozJkxm7eujY',
      key: 'BURR',
      name: 'Burrito Boyz',
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
  ];
  // market names
  export const HONEY_GENESIS_BEE = 'Honey Genesis Bee';
  export const LIFINITY_FLARES = 'Lifinity Flares';
  export const OG_ATADIANS = 'OG Atadians';
  export const PESKY_PENGUINS = 'Pesky Penguin';
  export const BURRITO_BOYZ = 'Burrito Boyz';

  // fees
  export const LIQUIDATION_FEE = 0.65;
  export const BORROW_FEE = 0;