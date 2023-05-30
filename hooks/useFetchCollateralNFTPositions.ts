import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
  MutableRefObject
} from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import { 
  HoneyUser,
  METADATA_PROGRAM_ID,
  getNFTAssociatedMetadata } from '@honey-finance/sdk';
import { ConnectedWallet } from '@saberhq/use-solana';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { ConfigureSDK } from 'helpers/loanHelpers';
// set default nft image for loading purposes
export const defaultNFTImageUrl = honeyGenesisBee.src;
interface NFTArrayType {
  [index: string]: Array<NFT>;
}
// init type for CollateralNFTPosition
export interface collateralNFTPosition {
  mint: String;
  updateAuthority: PublicKey;
  name: String;
  symbol: String;
  uri: String;
  image: String;
  verifiedCreator: String;
}

const defaultNFT: NFT = {
  name: '',
  updateAuthority: '',
  image: '',
  creators: [],
  tokenId: '',
  mint: ''
};

export type PDA = { publicKey: PublicKey; bump: number };

/**
 * @description fetches all collateralised positions of a user
 * @params honeyUser | wallet public key | current active market id
 * @returns array of collateral nft positions of user | isLoading: boolean
*/
export default function useFetchCollateralNFTPositions(
  currentMarketID: string,
  wallet: ConnectedWallet | null, 
  verified_creator?: string,
  connection?: Connection,
  honeyUser?: HoneyUser, 
): [Array<collateralNFTPosition>, Boolean, Dispatch<SetStateAction<{}>>] {
  // set state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(0);
  const [collateralNFTPositions, setCollateralNFTPositions] = useState<Array<collateralNFTPosition>>([]);
  // refetch
  const walletPublicKey = wallet?.publicKey?.toString() || '';

  const fetchData = async () => {
    // if required params are missing set return value to empty array
    if (!honeyUser || wallet == null || !currentMarketID || !connection || !verified_creator) {
      return setCollateralNFTPositions([]);
    } 
    // init boolean for function execution
    let didCancel = false;
      // set loading state
      setIsLoading(true);
      // get users obligation data
      const data = await honeyUser.getObligationData();
      // get the array of pub.keys presenting the obligations
      const collaternftmint = data.collateralNftMint;

      // validate if there are obligations
      if (collaternftmint.length && collaternftmint.length > 0) {
        // map through all pubkeys and start process of fetching data
        const promises = collaternftmint.map(
          async (key: PublicKey, index: number) => {
            if (!key.equals(PublicKey.default)) {
              const [nftMetadata, _] = await PublicKey.findProgramAddress(
                [
                  Buffer.from('metadata'),
                  METADATA_PROGRAM_ID.toBuffer(),
                  key.toBuffer()
                ],
                METADATA_PROGRAM_ID
              );

              const data = await getNFTAssociatedMetadata(
                connection,
                nftMetadata
              );
              
              if (!data) return;

              const tokenMetadata = await Metadata.fromAccountAddress(
                connection,
                nftMetadata
              );

              // TODO: validate if we can run it or need to catch
              // @ts-ignore
              const verifiedCreator = tokenMetadata.data.creators.filter(
                (creator: any) => creator.verified
              )[0].address;

              //   `(https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${tokenMetadata.data.uri})`

              // TODO: fetch via cloudinary
              const arweaveData = await (
                await fetch(tokenMetadata.data.uri)
              ).json();

              collateralNFTPositions.push({
                mint: nftMetadata.toString(),
                updateAuthority: new PublicKey(tokenMetadata?.updateAuthority),
                name: tokenMetadata?.data?.name,
                symbol: tokenMetadata?.data?.symbol,
                uri: tokenMetadata?.data?.uri,
                image: arweaveData?.image,
                verifiedCreator: verifiedCreator.toBase58(),
              });
            }
          }
        );

        await Promise.all(promises);

        if (collateralNFTPositions.length > 0) {
          // console.log('@@-- running', collateralNFTPositions.filter(position => position.verifiedCreator === verified_creator));
          setCollateralNFTPositions(collateralNFTPositions.filter(position => position.verifiedCreator === verified_creator));
        } else {
          setCollateralNFTPositions([]);
        }
    }
  }

  useEffect(() => {    
    fetchData();
  }, [honeyUser, currentMarketID, wallet, connection]);

   const refreshPositions = async () => {
    await fetchData();
  };

  return [collateralNFTPositions, isLoading, refreshPositions];
}