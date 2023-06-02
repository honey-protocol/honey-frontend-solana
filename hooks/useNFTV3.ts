import {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  SetStateAction,
  Dispatch
} from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner
} from '@nfteyez/sol-rayz';
import { ConnectedWallet, useSolana } from '@saberhq/use-solana';
import { programs } from '@metaplex/js';
import { MetadataKey } from '@nfteyez/sol-rayz/dist/config/metaplex';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import axios from 'axios';

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
export const defaultNFTImageUrl = honeyGenesisBee.src;
const defaultTokenId = 'defaultTokenId';
//this function should fetch all NFT from User
export default function useFetchCreatorNFTByUser(
  wallet: ConnectedWallet | null,
  creator?: string
): [Array<NFT>, Boolean, Dispatch<SetStateAction<{}>>] {
  const [NFTs, setNFTs] = useState<Array<NFT>>([]);
  const [isLoading, setLoading] = useState(true);
  const providerMut = useSolana();
  const [shouldRefetchNFTs, refetchNFTs] = useState({});
  const walletPublicKey = wallet?.publicKey?.toString() || '';
  const url = process.env.NEXT_PUBLIC_RPC_NODE;

  useEffect(() => {
    let didCancel = false;
    const fetchNFTByUser = async () => {
      setLoading(true);
      if (!didCancel) {
        if (walletPublicKey != '') {
            console.log(
              `cache miss or force re-fetching, fetching NFT for wallet public key ${walletPublicKey}`
            );

            if (!url) return // no rpc node was found
            const { data } = await axios.post(url, {
              "jsonrpc": "2.0",
              "id": "my-id",
              "method": "getAssetsByOwner",
              "params": {
                "ownerAddress": walletPublicKey,
                "page": 1,
                "limit": 500
              }
            });

            // get all NFT tokens from wallet || filter out all nfts that don't have creators array
            const nftArray = data.result.items.filter((nft: any) => nft.creators);

            // We are mapping the exception to default NFT to be filtered out later to make typescript happy
            const results = nftArray.map(async (nft: any) => {
              const tokenMetaPublicKey = await programs.metadata.Metadata.getPDA(
                new PublicKey(nft.id)
              );
              return {
                name: nft.content.metadata.name,
                symbol: nft.content.metadata.symbol,
                updateAuthority: nft.authorities[0],
                image: nft.content.files[0].uri,
                tokenUri: nft.content.files[0].uri,
                creators: nft.creators,
                mint: nft.id,
                tokenId: tokenMetaPublicKey
              }
            });

            const outcome = await Promise.all(
              results.map((p: any) =>
                p.catch((e: any) => {
                  console.error('Error fetching individual NFT with error');
                  console.error(e);
                  return defaultNFT;
                })
              )
            );

            const validResults = outcome.filter((result: any) => !(result.name == ''));
            setNFTs(validResults);
          }
        } else {
          setNFTs([]);
        }
      }
    // };
    fetchNFTByUser()
      .catch(err => {
        console.error('Error calling fetch NFT by user');
        console.error(err);
        setNFTs([]);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      didCancel = true;
    };
  }, [wallet, shouldRefetchNFTs]);

  return [NFTs, isLoading, refetchNFTs];
}