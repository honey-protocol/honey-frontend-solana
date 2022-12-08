/**
 * @descirption
 * This file is the config file for all the helper functions regarding the markets running on Honey
 * Whenever a new market is added - please add the values here for each function and the whole app
 * should be updated.
 */

import { PublicKey } from '@solana/web3.js';
import { MarketTableRow } from 'types/markets';
import { logoIcon } from 'styles/icons.css';
import { registry } from '../../honey-market-registry/registry.js';

// type for open positions
export type OpenPositions = {
  image: string;
  mint: PublicKey;
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  uri: string;
};

// collection strucutre for the markets
export const marketCollections: MarketTableRow[] = registry as MarketTableRow[];

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
    market => market.name === marketName
  );
  return (
    <Image
      src={'/' + filteredMarket[0]?.imgPath}
      alt={`${filteredMarket[0]?.name} NFT image`}
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
    market => market.id === marketId
  );
  return (
    <Image
      src={'/' + filteredMarket[0]?.imgPath}
      alt={`${filteredMarket[0]?.name} NFT image`}
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
    if (market.id === marketID) {
      return market.name;
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
  return marketCollections.filter(market => market.id === marketId);
};

/**
 * @description filters the nft array based on the market name being passed in
 * @params nft array market name
 * @returns filtered array of nfts scoped to specific market
 */
function filterNfts(
  nftArray: any,
  verifiedCreator: string,
  marketName: string
) {
  const nameFilteredArray = nftArray.filter((nft: any) =>
    nft.name.includes(marketName)
  );
  const verifiedCreatorFilteredArray = nameFilteredArray.filter((nft: any) => {
    if (nft.creators) {
      return nft.creators.map(
        (creator: any) => creator.address === verifiedCreator
      );
    }
  });

  return verifiedCreatorFilteredArray;
}

/**
 * @description see above
 * @params see above
 * @returns see above
 */
export const renderNftList = (marketId: string, nftArray: any) => {
  const filteredMarket = marketCollections.filter(
    market => market.id === marketId
  );
  return filterNfts(
    nftArray,
    filteredMarket[0].verifiedCreator,
    filteredMarket[0].name
  );
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
