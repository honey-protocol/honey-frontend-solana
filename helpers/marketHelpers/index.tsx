/**
 * @descirption 
 * This file is the config file for all the helper functions regarding the markets running on Honey
 * Whenever a new market is added - please add the values here for each function and the whole app
 * should be updated. 
*/
// import market IDs
import { 
  HONEY_PROGRAM_ID, 
  HONEY_GENESIS_MARKET_ID,
  PESKY_PENGUINS_MARKET_ID,
  OG_ATADIANS_MARKET_ID,
  LIFINITY_FLARES_MARKET_ID,
  BURRITO_BOYZ_MARKET_ID
} from 'constants/loan';

import Image from 'next/image';

// market names
export const HONEY_GENESIS_BEE_MARKET_NAME = 'Honey Genesis Bee';
export const LIFINITY_FLARES_MARKET_NAME = 'LIFINITY Flares';
export const OG_ATADIANS_MARKET_NAME = 'OG Atadians';
export const PESKY_PENGUINS_MARKET_NAME = 'Pesky Penguin';
export const BURRITO_BOYZ_MARKET_NAME = 'Burrito Boyz';

// constants used for the below stated functions
const HONEY_IMAGE = 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db';
const PESKY_IMAGE = 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png';
const OG_ATADIANS_IMAGE = 'https://i.seadn.io/gae/O8GK9vCJ5Cdtjz9aP3x7M4Bc4Z5HNgcsP0AcZFRjhC8p8fU4icgv2ecfNfZhMBjcYycVgJ2gpvCae_1TfXdbGOg2d6pKCdXRPlSsfQ?auto=format&w=384';
const LIFINITY_FLARES_IMAGE = 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8';
const BURRITO_BOYZ_IMAGE = 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/burrito_boyz_pfp_1653394754301.png';
/**
 * @description returns the image setup used for each market
 * @params name of the market in string format
 * @returns next.js image element with the image url && alt && style
*/
export const renderMarketImageByName = (marketName: string) => {
  switch(marketName) {
    case HONEY_GENESIS_BEE_MARKET_NAME:
      return <Image src={HONEY_IMAGE} alt='Honey NFT image' layout='fill' />;
    case LIFINITY_FLARES_MARKET_NAME:
      return <Image src={LIFINITY_FLARES_IMAGE} alt='Lifinity NFT image' layout='fill' />;
    case OG_ATADIANS_MARKET_NAME:
      return <Image src={OG_ATADIANS_IMAGE} alt='OG Atadians NFT image' layout='fill' />;
    case PESKY_PENGUINS_MARKET_NAME:
      return <Image src={PESKY_IMAGE} alt='Pesky Penguins NFT image' layout='fill' />;
    case BURRITO_BOYZ_MARKET_NAME:
      return <Image src={BURRITO_BOYZ_IMAGE} alt='Burrito Boys NFT image' layout='fill' />;
  }
}
/**
 * @description returns the image setup used for each market
 * @params id of the market in string format
 * @returns next.js image element with the image url && alt && style
*/
export const renderMarketImageByID = (marketID: string) => {
  switch(marketID) {
    case HONEY_GENESIS_MARKET_ID:
      return <Image src={HONEY_IMAGE} alt='Honey NFT image' layout='fill' />;
    case LIFINITY_FLARES_MARKET_ID:
      return <Image src={LIFINITY_FLARES_IMAGE} alt='Lifinity NFT image' layout='fill' />;
    case OG_ATADIANS_MARKET_ID:
      return <Image src={OG_ATADIANS_IMAGE} alt='OG Atadians NFT image' layout='fill' />;
    case PESKY_PENGUINS_MARKET_ID:
      return <Image src={PESKY_IMAGE} alt='Pesky Penguins NFT image' layout='fill' />;
    case BURRITO_BOYZ_MARKET_ID:
      return <Image src={BURRITO_BOYZ_IMAGE} alt='Burrito Boys NFT image' layout='fill' />;
  }
}
/**
 * @description this function returns the market name based on the market ID 
 * @params id of the market
 * @returns string format of the market name
*/
export const renderMarketName = (marketID: string) => {
  switch(marketID) {
    case HONEY_GENESIS_MARKET_ID:
      return HONEY_GENESIS_BEE_MARKET_NAME;
    case LIFINITY_FLARES_MARKET_ID:
      return LIFINITY_FLARES_MARKET_NAME;
    case OG_ATADIANS_MARKET_ID:
      return OG_ATADIANS_MARKET_NAME;
    case PESKY_PENGUINS_MARKET_ID:
      return PESKY_PENGUINS_MARKET_NAME;
    case BURRITO_BOYZ_MARKET_ID:
      return BURRITO_BOYZ_MARKET_NAME;
  }
}
/**
 * @description sets the market ID 
 * @params Honey table record - contains all info about a table (aka market)
 * @returns sets the market ID which re-renders page state and fetches market specific data
*/
export const renderMarket = (record: string) => {
  switch(record) {
    case HONEY_GENESIS_MARKET_ID:
      return {
        id: HONEY_GENESIS_MARKET_ID,
        name: HONEY_GENESIS_BEE_MARKET_NAME,
      };
    case LIFINITY_FLARES_MARKET_ID:
      return {
        id: LIFINITY_FLARES_MARKET_ID,
        name: LIFINITY_FLARES_MARKET_NAME,
      };
    case OG_ATADIANS_MARKET_ID:
      return {
        id: OG_ATADIANS_MARKET_ID,
        name: OG_ATADIANS_MARKET_NAME,
      };
    case PESKY_PENGUINS_MARKET_ID:
      return {
        id: PESKY_PENGUINS_MARKET_ID,
        name: PESKY_PENGUINS_MARKET_NAME,
      };
    case BURRITO_BOYZ_MARKET_ID:
      return {
        id: BURRITO_BOYZ_MARKET_ID,
        name: BURRITO_BOYZ_MARKET_NAME,
      };
  }
}
/**
 * @description filters the nft array based on the market name being passed in
 * @params nft array market name
 * @returns filtered array of nfts scoped to specific market
*/
async function filterNfts(nftArray: any, marketName: string) {
  console.log('the nfts', nftArray);
  return nftArray.filter((nft: any) => nft.name.includes(marketName))
}
/**
 * @description see above
 * @params see above
 * @returns see above
*/
export const renderNftList = async (marketID: string, nftArray: any) => {
  switch(marketID) {
    case HONEY_GENESIS_MARKET_ID:
      return await filterNfts(nftArray, HONEY_GENESIS_BEE_MARKET_NAME);
    case LIFINITY_FLARES_MARKET_ID:
      return await filterNfts(nftArray, LIFINITY_FLARES_MARKET_NAME);
    case OG_ATADIANS_MARKET_ID:
      return await filterNfts(nftArray, OG_ATADIANS_MARKET_NAME);
    case PESKY_PENGUINS_MARKET_ID:
      return await filterNfts(nftArray, PESKY_PENGUINS_MARKET_NAME);
    case BURRITO_BOYZ_MARKET_ID:
      return await filterNfts(nftArray, BURRITO_BOYZ_MARKET_NAME);
  }
}
/**
 * @description filters out the open positions according to the collection id | market id and open pos. array
 * @params collection id market id open positions array
 * @returns filtered array based on current active market
*/
export const handleOpenPositions = (collectionID: string, marketID: string, openPositions: any) => {
  if (collectionID == HONEY_GENESIS_MARKET_ID && marketID == HONEY_GENESIS_MARKET_ID) {
    return openPositions.filter((pos: any) => pos.name.includes('Honey'));
  } else if (collectionID == PESKY_PENGUINS_MARKET_ID && marketID == PESKY_PENGUINS_MARKET_ID) {
    return openPositions.filter((pos: any) => pos.name.includes('Pesky'));
  } else if (collectionID == LIFINITY_FLARES_MARKET_ID && marketID == LIFINITY_FLARES_MARKET_ID) {
    return openPositions.filter((pos: any) => pos.name.includes('LIFINITY'));
  } else if (collectionID == OG_ATADIANS_MARKET_ID && marketID == OG_ATADIANS_MARKET_ID) {
    return openPositions.filter((pos: any) => pos.name.includes('OG'));
  } else if (collectionID == BURRITO_BOYZ_MARKET_ID && marketID == BURRITO_BOYZ_MARKET_ID) {
    return openPositions.filter((pos: any) => pos.name.includes('Burrito'));
  } else {
    return [];
  }
}