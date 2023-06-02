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
  getNFTAssociatedMetadata,
  CollateralNFTPosition
} from '@honey-finance/sdk';
import { ConnectedWallet } from '@saberhq/use-solana';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { ConfigureSDK } from 'helpers/loanHelpers';
// set default nft image for loading purposes
export const defaultNFTImageUrl = honeyGenesisBee.src;
interface NFTArrayType {
  [index: string]: Array<NFT>;
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
 * @params connection | mint array: PublicKey[] | verified creator of the active market
 * @returns Object containing: array of collateral nft positions of user, error, isloading boolean |  refreshPositions
 */
export default function useFetchCollateralNFTPositions(
  connection: Connection,
  mintArray: PublicKey[],
  verified_creator: string
) {
  const [status, setStatus] = useState<{
    loading: boolean;
    collateralNFTPositions?: CollateralNFTPosition[];
    error?: Error;
  }>({ loading: false });

  const fetchData = async () => {
    try {
      setStatus({ loading: true });

      const collateralNFTPositions: CollateralNFTPosition[] = [];
      const collateralNftMint: PublicKey[] = mintArray;

      if (!collateralNftMint || collateralNftMint.length === 0) {
        setStatus({
          loading: false,
          error: new Error(
            'Obligation does not have a valid collateral nft mint'
          )
        });
        return;
      }

      // map through all pubkeys and start process of fetching data
      const promises = collateralNftMint.map(
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
            // only push if this obligation belows to current active market
            if (verifiedCreator.toString() === verified_creator) {
              collateralNFTPositions.push({
                mint: nftMetadata,
                updateAuthority: new PublicKey(tokenMetadata?.updateAuthority),
                name: tokenMetadata?.data?.name,
                symbol: tokenMetadata?.data?.symbol,
                uri: tokenMetadata?.data?.uri,
                image: arweaveData?.image,
                verifiedCreator: verifiedCreator.toBase58()
              });
            }
          }
        }
      );

      await Promise.all(promises);

      return setStatus({ loading: false, collateralNFTPositions });
    } catch (error) {
      console.log(`Error while fetching obligations: ${error}`);
    }
  };

  const refreshPositions = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (!mintArray) {
      setStatus({ loading: false, error: new Error('No mints found') });
      return;
    }

    fetchData();
  }, [mintArray, connection, verified_creator]);

  return { ...status, refreshPositions };
}
