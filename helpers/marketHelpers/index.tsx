/**
 * @descirption
 * This file is the config file for all the helper functions regarding the markets running on Honey
 * Whenever a new market is added - please add the values here for each function and the whole app
 * should be updated.
 */
// market IDs
export const HONEY_PROGRAM_ID = 'hNEYyRsRBVq2La65V1KjvdbTE39w36gwrdjkmcpvysk';
export const HONEY_GENESIS_MARKET_ID = '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3';
export const PESKY_PENGUINS_MARKET_ID = 'Bw77MGpg189EaATjN67WXcnp3c4544LhKoV4Ftmdg4C';
export const BURRITO_BOYZ_MARKET_ID = 'F8rZviSSuqgkTsjMeoyrTUSNSqh7yNDCAozJkxm7eujY'
export const OG_ATADIANS_MARKET_ID = 'Bxk1JQCbVjpeFnjzvH5n9bepnZeHjRADUFwZiVC7L5Gq';
export const LIFINITY_FLARES_MARKET_ID = 'H2H2pJuccdvpET9A75ajB3GgdYdCUL4T3kiwUMA6DJ7q';
export const BLOCKSMITH_LABS_MARKET_ID = 'GrKPvcdHVb4cwR5a2CCgCTvdkSqhNDRgSUiUVzXRWLk6';
// market verified creators
export const VERIFIED_CREATOR_HONEY_GENESIS_BEE = '6vRx1iVZo3xfrBHdpvuwArL2jucVj9j9nLpd2VUTTGMG';
export const VERIFIED_CREATOR_PESKY_PENGUINS = 'A6XTVFiwGVsG6b6LsvQTGnV5LH3Pfa3qW3TGz8RjToLp';
export const VERIFIED_CREATOR_OG_ATADIANS = '4pi2MRDQgGVFwV1Hv8ka7hSSu9TgdFmafk6jtQhrB9HN';
export const VERIFIED_CREATOR_LIFINITY_FLARES = 'EWyWxSkxWHWGzxfCd9kG7zGrKTUDbZGiV6VbFJF8YfqN';
export const VERIFIED_CREATOR_BURRITO_BOYZ = '2UCkKjTHvz7qFjPZMjhWZiPmyTc6ZwZ44iYPbSpe3aVo';
export const VERIFIED_CREATOR_BLOCKSMITH_LABS = '8m2b8ar9BNZErJQgSBwY3eCe73yR4k9qHUxxGffxyw2d';
// market names
export const HONEY_GENESIS_BEE_MARKET_NAME = 'Honey Genesis Bee';
export const LIFINITY_FLARES_MARKET_NAME = 'LIFINITY Flares';
export const OG_ATADIANS_MARKET_NAME = 'OG Atadians';
export const PESKY_PENGUINS_MARKET_NAME = 'Pesky Penguin';
export const BURRITO_BOYZ_MARKET_NAME = 'Burrito Boyz';
export const BLOCKSMITH_LABS_MARKET_NAME = 'Blocksmith Labs';
// import image from next
import Image from 'next/image';
// constants used for the below stated functions
const HONEY_IMAGE =
  'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db';
const PESKY_IMAGE =
  'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png';
const OG_ATADIANS_IMAGE =
  'https://i.seadn.io/gae/O8GK9vCJ5Cdtjz9aP3x7M4Bc4Z5HNgcsP0AcZFRjhC8p8fU4icgv2ecfNfZhMBjcYycVgJ2gpvCae_1TfXdbGOg2d6pKCdXRPlSsfQ?auto=format&w=384';
const LIFINITY_FLARES_IMAGE =
  'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8';
const BURRITO_BOYZ_IMAGE =
  'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/burrito_boyz_pfp_1653394754301.png';
const BLOCKSMITH_LABS_IMAGE = 
  'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafkreih3jh6bz4g5xegjz622ogjdnkwwwnx35opnenh2nzstqnczomo7ha.ipfs.dweb.link/';
/**
 * @description returns the image setup used for each market
 * @params name of the market in string format
 * @returns next.js image element with the image url && alt && style
 */
export const renderMarketImageByName = (marketName: string) => {
  switch (marketName) {
    case HONEY_GENESIS_BEE_MARKET_NAME:
      return <Image src={HONEY_IMAGE} alt="Honey NFT image" layout="fill" />;
    case LIFINITY_FLARES_MARKET_NAME:
      return (
        <Image
          src={LIFINITY_FLARES_IMAGE}
          alt="Lifinity NFT image"
          layout="fill"
        />
      );
    case OG_ATADIANS_MARKET_NAME:
      return (
        <Image
          src={OG_ATADIANS_IMAGE}
          alt="OG Atadians NFT image"
          layout="fill"
        />
      );
    case PESKY_PENGUINS_MARKET_NAME:
      return (
        <Image src={PESKY_IMAGE} alt="Pesky Penguins NFT image" layout="fill" />
      );
    case BURRITO_BOYZ_MARKET_NAME:
      return (
        <Image
          src={BURRITO_BOYZ_IMAGE}
          alt="Burrito Boys NFT image"
          layout="fill"
        />
      );
    case BLOCKSMITH_LABS_MARKET_NAME:
      return (
        <Image
          src={BLOCKSMITH_LABS_IMAGE}
          alt="Blocksmith Labs NFT image"
          layout="fill"
        />
      );
  }
};
/**
 * @description returns the image setup used for each market
 * @params id of the market in string format
 * @returns next.js image element with the image url && alt && style
 */
export const renderMarketImageByID = (marketID: string) => {
  switch (marketID) {
    case HONEY_GENESIS_MARKET_ID:
      return <Image src={HONEY_IMAGE} alt="Honey NFT image" layout="fill" />;
    case LIFINITY_FLARES_MARKET_ID:
      return (
        <Image
          src={LIFINITY_FLARES_IMAGE}
          alt="Lifinity NFT image"
          layout="fill"
        />
      );
    case OG_ATADIANS_MARKET_ID:
      return (
        <Image
          src={OG_ATADIANS_IMAGE}
          alt="OG Atadians NFT image"
          layout="fill"
        />
      );
    case PESKY_PENGUINS_MARKET_ID:
      return (
        <Image 
          src={PESKY_IMAGE} 
          alt="Pesky Penguins NFT image" 
          layout="fill" 
        />
      );
    case BURRITO_BOYZ_MARKET_ID:
      return (
        <Image
          src={BURRITO_BOYZ_IMAGE}
          alt="Burrito Boys NFT image"
          layout="fill"
        />
      );
    case BLOCKSMITH_LABS_MARKET_ID:
      return (
        <Image
          src={BLOCKSMITH_LABS_IMAGE}
          alt="Blocksmith Labs NFT image"
          layout="fill"
        />
      );
  }
};
/**
 * @description this function returns the market name based on the market ID
 * @params id of the market
 * @returns string format of the market name
 */
export const renderMarketName = (marketID: string) => {
  switch (marketID) {
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
    case BLOCKSMITH_LABS_MARKET_ID:
      return BLOCKSMITH_LABS_MARKET_NAME;
  }
};
/**
 * @description sets the market ID
 * @params Honey table record - contains all info about a table (aka market)
 * @returns sets the market ID which re-renders page state and fetches market specific data
 */
export const renderMarket = (record: string) => {
  switch (record) {
    case HONEY_GENESIS_MARKET_ID:
      return {
        id: HONEY_GENESIS_MARKET_ID,
        name: HONEY_GENESIS_BEE_MARKET_NAME
      };
    case LIFINITY_FLARES_MARKET_ID:
      return {
        id: LIFINITY_FLARES_MARKET_ID,
        name: LIFINITY_FLARES_MARKET_NAME
      };
    case OG_ATADIANS_MARKET_ID:
      return {
        id: OG_ATADIANS_MARKET_ID,
        name: OG_ATADIANS_MARKET_NAME
      };
    case PESKY_PENGUINS_MARKET_ID:
      return {
        id: PESKY_PENGUINS_MARKET_ID,
        name: PESKY_PENGUINS_MARKET_NAME
      };
    case BURRITO_BOYZ_MARKET_ID:
      return {
        id: BURRITO_BOYZ_MARKET_ID,
        name: BURRITO_BOYZ_MARKET_NAME
      };
    case BLOCKSMITH_LABS_MARKET_ID:
      return {
        id: BLOCKSMITH_LABS_MARKET_ID,
        name: BLOCKSMITH_LABS_MARKET_NAME
      };
  }
};
/**
 * @description filters the nft array based on the market name being passed in
 * @params nft array market name
 * @returns filtered array of nfts scoped to specific market
 */
function filterNfts(nftArray: any, verifiedCreator: string, marketName: string) {
  const nameFilteredArray = nftArray.filter((nft: any) => nft.name.includes(marketName));
  const verifiedCreatorFilteredArray = nameFilteredArray.filter((nft: any) => {
    if (nft.creators) {
      return nft.creators.map((creator: any) => creator.address === verifiedCreator)
    }
  });

  return verifiedCreatorFilteredArray;
}
/**
 * @description see above
 * @params see above
 * @returns see above
 */
export const renderNftList = (marketID: string, nftArray: any) => {
  switch (marketID) {
    case HONEY_GENESIS_MARKET_ID:
      return filterNfts(nftArray, VERIFIED_CREATOR_HONEY_GENESIS_BEE, HONEY_GENESIS_BEE_MARKET_NAME);
    case LIFINITY_FLARES_MARKET_ID:
      return filterNfts(nftArray, VERIFIED_CREATOR_LIFINITY_FLARES, LIFINITY_FLARES_MARKET_NAME);
    case OG_ATADIANS_MARKET_ID:
      return filterNfts(nftArray, VERIFIED_CREATOR_OG_ATADIANS, OG_ATADIANS_MARKET_NAME);
    case PESKY_PENGUINS_MARKET_ID:
      return filterNfts(nftArray, VERIFIED_CREATOR_PESKY_PENGUINS, PESKY_PENGUINS_MARKET_NAME);
    case BURRITO_BOYZ_MARKET_ID:
      return filterNfts(nftArray, VERIFIED_CREATOR_BURRITO_BOYZ, BURRITO_BOYZ_MARKET_NAME);
    case BLOCKSMITH_LABS_MARKET_ID:
      return filterNfts(nftArray, VERIFIED_CREATOR_BLOCKSMITH_LABS, BLOCKSMITH_LABS_MARKET_NAME);
  }
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
    return openPositions.filter((pos: any) => pos.verifiedCreator === verifiedCreator)
  } else {
    return [];
  }
};
