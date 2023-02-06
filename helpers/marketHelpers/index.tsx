/**
 * @descirption
 * This file is the config file for all the helper functions regarding the markets running on Honey
 * Whenever a new market is added - please add the values here for each function and the whole app
 * should be updated.
 */

import { PublicKey } from '@solana/web3.js';
import { MarketTableRow } from 'types/markets';
import { logoIcon } from 'styles/icons.css';

// type for open positions
export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
};

export const marketIDs = [
  '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3',
  'Bw77MGpg189EaATjN67WXcnp3c4544LhKoV4Ftmdg4C',
  'H2H2pJuccdvpET9A75ajB3GgdYdCUL4T3kiwUMA6DJ7q',
  'Bxk1JQCbVjpeFnjzvH5n9bepnZeHjRADUFwZiVC7L5Gq',
  'FTBLaLcrx1aXALW2UEpu8a6HLRVFATezkK12wCABPAiA',
  'GAqyPziKPwVpwKaeqPhEsxiy6MwQ2bvtodruWErpLVKo',
  '2dxJ4eMkhMxm1ZqpAhKsjunvyziuq1JRnuHaqKFRY8et'
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
    connection: undefined,
    user: undefined,
    debt: 0,
    utilizationRate: 0,
    openPositions: [],
    constants: {
      marketId: '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3',
      verifiedCreator: '6vRx1iVZo3xfrBHdpvuwArL2jucVj9j9nLpd2VUTTGMG',
      marketName: 'Honey Genesis Bee',
      marketImage:
        'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db',
      discountedMarket: false
    }
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
    connection: undefined,
    user: undefined,
    debt: 0,
    utilizationRate: 0,
    openPositions: [],
    constants: {
      marketId: 'Bw77MGpg189EaATjN67WXcnp3c4544LhKoV4Ftmdg4C',
      verifiedCreator: 'A6XTVFiwGVsG6b6LsvQTGnV5LH3Pfa3qW3TGz8RjToLp',
      marketName: 'Pesky Penguin',
      marketImage:
        'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png',
      discountedMarket: false
    }
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
    connection: undefined,
    user: undefined,
    debt: 0,
    utilizationRate: 0,
    openPositions: [],
    constants: {
      marketId: 'H2H2pJuccdvpET9A75ajB3GgdYdCUL4T3kiwUMA6DJ7q',
      verifiedCreator: 'EWyWxSkxWHWGzxfCd9kG7zGrKTUDbZGiV6VbFJF8YfqN',
      marketName: 'LIFINITY Flares',
      marketImage:
        'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8',
      discountedMarket: true
    }
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
    connection: undefined,
    user: undefined,
    debt: 0,
    utilizationRate: 0,
    openPositions: [],
    constants: {
      marketId: 'Bxk1JQCbVjpeFnjzvH5n9bepnZeHjRADUFwZiVC7L5Gq',
      verifiedCreator: '4pi2MRDQgGVFwV1Hv8ka7hSSu9TgdFmafk6jtQhrB9HN',
      marketName: 'OG Atadians',
      marketImage:
        'https://i.seadn.io/gae/O8GK9vCJ5Cdtjz9aP3x7M4Bc4Z5HNgcsP0AcZFRjhC8p8fU4icgv2ecfNfZhMBjcYycVgJ2gpvCae_1TfXdbGOg2d6pKCdXRPlSsfQ?auto=format&w=384',
      discountedMarket: true
    }
  },
  {
    id: 'FTBLaLcrx1aXALW2UEpu8a6HLRVFATezkK12wCABPAiA',
    key: 'Ukiyo',
    name: 'Ukiyo',
    verifiedCreator: '9dQhwT67yaTk3YKhTN7f4jKFEAYtNtMotyVmVswmAQKe',
    rate: 0,
    available: 0,
    value: 0,
    allowance: 0,
    connection: undefined,
    user: undefined,
    debt: 0,
    utilizationRate: 0,
    openPositions: [],
    constants: {
      marketId: 'FTBLaLcrx1aXALW2UEpu8a6HLRVFATezkK12wCABPAiA',
      verifiedCreator: '9dQhwT67yaTk3YKhTN7f4jKFEAYtNtMotyVmVswmAQKe',
      marketName: 'Ukiyo',
      marketImage:
        'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/ukiyo_pfp_1663178207810.jpeg',
      discountedMarket: false
    }
  },
  // {
  //   id: '5UKRRSxbi4PgPnQU2ZqtukUxd1fyN6ydn1hoxivP46A8',
  //   key: 'OLV',
  //   name: 'Elixir: Ovols',
  //   verifiedCreator: 'ovo1kT7RqrAZwFtgSGEgNfa7nHjeZoK6ykg1GknJEXG',
  //   rate: 0,
  //   available: 0,
  //   value: 0,
  //   allowance: 0,
  //   connection: undefined,
  //   user: undefined,
  //   debt: 0,
  //   utilizationRate: 0,
  //   openPositions: [],
  //   constants: {
  //     marketId: '5UKRRSxbi4PgPnQU2ZqtukUxd1fyN6ydn1hoxivP46A8',
  //     verifiedCreator: 'ovo1kT7RqrAZwFtgSGEgNfa7nHjeZoK6ykg1GknJEXG',
  //     marketName: 'Elixir: Ovols',
  //     marketImage:
  //       'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/elixir_ovols_pfp_1668964852701.png',
  //     discountedMarket: true
  //   }
  // }
  // {
  //   id: 'F8rZviSSuqgkTsjMeoyrTUSNSqh7yNDCAozJkxm7eujY',
  //   key: 'BURR',
  //   name: 'Burrito Boyz',
  //   verifiedCreator: '2UCkKjTHvz7qFjPZMjhWZiPmyTc6ZwZ44iYPbSpe3aVo',
  //   rate: 0,
  //   available: 0,
  //   value: 0,
  //   allowance: 0,
  //   connection: undefined,
  //   user: undefined,
  //   debt: 0,
  //   utilizationRate: 0,
  //   openPositions: [],
  //   constants: {
  //     marketId: 'F8rZviSSuqgkTsjMeoyrTUSNSqh7yNDCAozJkxm7eujY',
  //     verifiedCreator: '2UCkKjTHvz7qFjPZMjhWZiPmyTc6ZwZ44iYPbSpe3aVo',
  //     marketName: 'Burrito Boyz',
  //     marketImage:
  //       'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/burrito_boyz_pfp_1653394754301.png',
  //     discountedMarket: false
  //   }
  // },
  // {
  //   id: 'GrKPvcdHVb4cwR5a2CCgCTvdkSqhNDRgSUiUVzXRWLk6',
  //   key: 'Smyths',
  //   name: 'Blocksmith Labs',
  //   verifiedCreator: '8m2b8ar9BNZErJQgSBwY3eCe73yR4k9qHUxxGffxyw2d',
  //   rate: 0,
  //   available: 0,
  //   value: 0,
  //   allowance: 0,
  //   connection: undefined,
  //   user: undefined,
  //   debt: 0,
  //   utilizationRate: 0,
  //   openPositions: [],
  //   constants: {
  //     marketId: 'GrKPvcdHVb4cwR5a2CCgCTvdkSqhNDRgSUiUVzXRWLk6',
  //     verifiedCreator: '8m2b8ar9BNZErJQgSBwY3eCe73yR4k9qHUxxGffxyw2d',
  //     marketName: 'Blocksmith Labs',
  //     marketImage:
  //       'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafkreih3jh6bz4g5xegjz622ogjdnkwwwnx35opnenh2nzstqnczomo7ha.ipfs.dweb.link/',
  //     discountedMarket: false
  //   }
  // },
  // {
  //   id: 'D5qrmgTLJwarfkkqktguUp5uPfj83hFHuWKLvMNSWJ5w',
  //   key: 'Apes',
  //   name: 'Trippin ape tribe',
  //   verifiedCreator: 'EZcZTsLpvdisPgQy5TcCALYgmGKRMNvvyJ89t1LFWmum',
  //   rate: 0,
  //   available: 0,
  //   value: 0,
  //   allowance: 0,
  //   connection: undefined,
  //   user: undefined,
  //   debt: 0,
  //   utilizationRate: 0,
  //   openPositions: [],
  //   constants: {
  //     marketId: 'D5qrmgTLJwarfkkqktguUp5uPfj83hFHuWKLvMNSWJ5w',
  //     verifiedCreator: 'EZcZTsLpvdisPgQy5TcCALYgmGKRMNvvyJ89t1LFWmum',
  //     marketName: 'Trippin ape tribe',
  //     marketImage:
  //       'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/iFgvQva.png',
  //     discountedMarket: false
  //   }
  // },
  {
    id: 'GAqyPziKPwVpwKaeqPhEsxiy6MwQ2bvtodruWErpLVKo',
    key: 'Droids',
    name: 'Droid Capital',
    verifiedCreator: 'C88kKdEmTrCh43GC1w3BUFLsW3oKMEWWBGCyweQAaEYa',
    rate: 0,
    available: 0,
    value: 0,
    allowance: 0,
    connection: undefined,
    user: undefined,
    debt: 0,
    utilizationRate: 0,
    openPositions: [],
    constants: {
      marketId: 'GAqyPziKPwVpwKaeqPhEsxiy6MwQ2bvtodruWErpLVKo',
      verifiedCreator: 'C88kKdEmTrCh43GC1w3BUFLsW3oKMEWWBGCyweQAaEYa',
      marketName: 'Droid Capital',
      marketImage:
        'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/cdd57420adfe9323b725187414504608/645229ca',
      discountedMarket: false
    }
  },
  {
    id: '2dxJ4eMkhMxm1ZqpAhKsjunvyziuq1JRnuHaqKFRY8et',
    key: 'Vandals',
    name: 'Vandal City',
    verifiedCreator: '8wACNDCJiPVVxfrFJRUYkJx4hQgvcoZggMXKmNvjQ6R7',
    rate: 0,
    available: 0,
    value: 0,
    allowance: 0,
    connection: undefined,
    user: undefined,
    debt: 0,
    utilizationRate: 0,
    openPositions: [],
    constants: {
      marketId: '2dxJ4eMkhMxm1ZqpAhKsjunvyziuq1JRnuHaqKFRY8et',
      verifiedCreator: '8wACNDCJiPVVxfrFJRUYkJx4hQgvcoZggMXKmNvjQ6R7',
      marketName: 'Vandal City',
      marketImage:
        'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://cdn.discordapp.com/attachments/975048153843777577/1005302647491928124/unknown.png',
      discountedMarket: false
    }
  }
];

// fees
export const COLLATERAL_FACTOR = 0.65;
export const BORROW_FEE = 0;

// Honey Program ID
export const HONEY_GENESIS_MARKET_ID =
  '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3';
export const HONEY_GENESIS_BEE_MARKET_NAME = 'Honey Genesis Bee';
export const HONEY_PROGRAM_ID = 'hNEYyRsRBVq2La65V1KjvdbTE39w36gwrdjkmcpvysk';

// import image from next
import Image from 'next/image';

/**
 * @description returns the image setup used for each market
 * @params name of the market in string format
 * @returns next.js image element with the image url && alt && style
 */
export const renderMarketImageByName = (marketName: string) => {
  const filteredMarket = marketCollections.filter(
    market => market.constants.marketName === marketName
  );
  return (
    <Image
      src={filteredMarket[0].constants.marketImage}
      alt={`${filteredMarket[0].constants.marketName} NFT image`}
      layout="fill"
    />
  );
};

/**
 * @description returns the image setup used for each market
 * @params id of the market in string format
 * @returns next.js image element with the image url && alt && style
 */
export const renderMarketImageByID = (marketId: string) => {
  const filteredMarket = marketCollections.filter(
    market => market.constants.marketId === marketId
  );
  return (
    <Image
      src={filteredMarket[0].constants.marketImage}
      alt={`${filteredMarket[0].constants.marketName} NFT image`}
      layout="fill"
    />
  );
};

/**
 * @description this function returns the market name based on the market ID
 * @params id of the market
 * @returns string format of the market name
 */
export const renderMarketName = (marketID: string) => {
  return marketCollections.map(market => {
    if (market.constants.marketId === marketID) {
      return market.constants.marketName;
    } else {
      return '';
    }
  });
};

/**
 * @description sets the market ID
 * @params Honey table record - contains all info about a table (aka market)
 * @returns sets the market ID which re-renders page state and fetches market specific data
 */
export const renderMarket = (marketId: string) => {
  return marketCollections.filter(
    market => market.constants.marketId === marketId
  );
};

interface NFT {
  creators: [
    {
      address: string;
      share: number;
      verified: number;
    }
  ];
  image: string;
  mint: string;
  name: string;
  symbol: string;
  tokenId: string;
  updateAuthority: string;
}
/**
 * @description filters the nft array based on the verifiedCreator
 * @params nft array verified creator
 * @returns filtered array of nfts scoped to active market
 */
function filterNfts(nftArray: any, verifiedCreator: string) {
  return nftArray.filter((nft: NFT) => {
    return nft.creators[0].address === verifiedCreator;
  });
}

/**
 * @description see above
 * @params see above
 * @returns see above
 */
export const renderNftList = (marketId: string, nftArray: any) => {
  const filteredMarket = marketCollections.filter(
    market => market.constants.marketId === marketId
  );
  return filterNfts(nftArray, filteredMarket[0].constants.verifiedCreator);
};

/**
 * @description filters out the open positions based on verified creator
 * @params collection id market id open positions array
 * @returns filtered array based on current active market
 */
export const handleOpenPositions = (
  verifiedCreator: string,
  openPositions: any
) => {
  if (openPositions) {
    return openPositions.filter(
      (pos: any) => pos.verifiedCreator === verifiedCreator
    );
  } else {
    return [];
  }
};
