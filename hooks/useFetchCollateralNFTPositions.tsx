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
 * @params honeyUser | wallet public key | current active market id
 * @returns array of collateral nft positions of user | isLoading: boolean
 */
export default function useFetchCollateralNFTPositions(
  connection: Connection,
  honeyUser: HoneyUser,
  verified_creator: string
) {
  // set state
  // const [isLoading, setIsLoading] = useState(true);
  // const [isRefetching, setIsRefetching] = useState(0);
  // const [collateralNFTPositions, setCollateralNFTPositions] = useState<Array<CollateralNFTPosition>>([]);

  const [status, setStatus] = useState<{
    loading: boolean;
    collateralNFTPositions?: CollateralNFTPosition[];
    error?: Error;
  }>({ loading: false });

  const fetchData = async () => {
    setStatus({ loading: true });

    const collateralNFTPositions: CollateralNFTPosition[] = [];
    honeyUser.getObligationData().then(async obligation => {
      if (!obligation) {
        setStatus({
          loading: false,
          error: new Error('Obligation does not have a valid market')
        });
        return;
      }

      const collateralNftMint: PublicKey[] = obligation.collateralNftMint;

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
      );

      await Promise.all(promises);
      return setStatus({ loading: false, collateralNFTPositions });
    });
  };

  const refreshPositions = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (!honeyUser) {
      setStatus({ loading: false, error: new Error('HoneyUser is undefined') });
      return;
    }

    fetchData();
  }, [honeyUser, connection, verified_creator]);

  return { ...status, refreshPositions };
}
