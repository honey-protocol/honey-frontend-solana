import { Connection, PublicKey } from '@solana/web3.js';
import { MarketTableRow } from 'types/markets';
// type for open positions
export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
};
// collection structure for liquidations
export const liquidationCollections: MarketTableRow[] = [
  {
    id: '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3',
    key: 'HNYG',
    name: 'Honey Genesis Bee',
    verifiedCreator: '6vRx1iVZo3xfrBHdpvuwArL2jucVj9j9nLpd2VUTTGMG',
    rate: 0,
    available: 0,
    value: 0,
    allowance: 0,
    positions: [],
    connection: undefined,
    user: undefined,
    debt: 0,
    utilizationRate: 0,
  }
];
// collection strucutre for the markets 
export const marketCollections: MarketTableRow[] = [
  {
    id: '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3',
    key: 'HNYG',
    name: 'Honey Genesis Bee',
    verifiedCreator: '6vRx1iVZo3xfrBHdpvuwArL2jucVj9j9nLpd2VUTTGMG',
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
    verifiedCreator: 'A6XTVFiwGVsG6b6LsvQTGnV5LH3Pfa3qW3TGz8RjToLp',
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
    name: 'LIFINITY Flares',
    verifiedCreator: 'EWyWxSkxWHWGzxfCd9kG7zGrKTUDbZGiV6VbFJF8YfqN',
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
    verifiedCreator: '4pi2MRDQgGVFwV1Hv8ka7hSSu9TgdFmafk6jtQhrB9HN',
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
    verifiedCreator: '2UCkKjTHvz7qFjPZMjhWZiPmyTc6ZwZ44iYPbSpe3aVo',
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
// fees
export const LIQUIDATION_FEE = 0.65;
export const BORROW_FEE = 0;