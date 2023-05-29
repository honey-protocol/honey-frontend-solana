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

export type PDA = { publicKey: PublicKey; bump: number };

/**
 * @description fetches all collateralised positions of a user
 * @params honeyUser | wallet public key | current active market id
 * @returns array of collateral nft positions of user | isLoading: boolean
*/
export default function useFetchCollateralNFTPositions(
  honeyUser: HoneyUser, 
  currentMarketID: string,
  wallet: ConnectedWallet | null, 
  connection: Connection,
  verified_creator?: string
): [Array<collateralNFTPosition>, Boolean, Dispatch<SetStateAction<{}>>] {
  // set state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(0);
  const [collateralNFTPositions, setCollateralNFTPositions] = useState<Array<collateralNFTPosition>>([]);

  useEffect(() => {    
    // init boolean for function execution
    let didCancel = false;
    // init our construction func. for collateral nft array
    const fetchCollateralNFTPositions = async () => {
      // set loading state
      setIsLoading(true);
      // if required params are missing set return value to empty array
      if (!honeyUser || wallet == null || !currentMarketID || !connection || !verified_creator) {
        setCollateralNFTPositions([]);
      } else {
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
                console.log('@@-- this is data', data);
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
            } else {
              console.log('@@-- this is else');
              setCollateralNFTPositions([]);
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
    }

    fetchCollateralNFTPositions()
    .catch(err => {
      console.log(`Error fetching collateralised NFT Positions, Error: ${err}`);
      setCollateralNFTPositions([]);
    })
    .finally(() => {
      setIsLoading(false);
    });

    return () => {
      didCancel = true;
    };
  }, [honeyUser, currentMarketID, wallet, connection, isRefetching]);

  const refreshPositions = () => {
      isRefetching === 0 ? setIsRefetching(1) : setIsRefetching(0);
  };

  return [collateralNFTPositions, isLoading, refreshPositions];
}