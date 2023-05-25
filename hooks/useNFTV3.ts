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
  //adding shouldRefetchNFTs to force refetching by passing {} to refecthNFTs
  const [shouldRefetchNFTs, refetchNFTs] = useState({});
  const shouldRefetchRef: MutableRefObject<{}> = useRef(shouldRefetchNFTs);
  const cache: MutableRefObject<NFTArrayType> = useRef({});
  const walletPublicKey = wallet?.publicKey?.toString() || '';
  const url = process.env.NEXT_PUBLIC_RPC_NODE;

  useEffect(() => {
    let didCancel = false;
    const fetchNFTByUser = async () => {
      setLoading(true);
      if (!didCancel) {
        // const connection = new Connection(
        //   clusterApiUrl('mainnet-beta'),
        //   'processed'
        // );
        const connection = providerMut?.connection;
        if (walletPublicKey != '') {
          // we need to check if shouldRefetchNFTs trigger this function and we should do refetch instead of getting from cache
          if (
            cache.current[walletPublicKey] &&
            shouldRefetchRef.current === shouldRefetchNFTs
          ) {
            console.log(
              `fetching NFT for wallet public key ${walletPublicKey} from cache`
            );
            const result = cache.current[walletPublicKey];
            setNFTs(result);
          } else {
            console.log(
              `cache miss or force re-fetching, fetching NFT for wallet public key ${walletPublicKey}`
            );
            // check if wallet address is valid
            // const publicAddress = await resolveToWalletAddress({
            //   text: walletPublicKey,
            //   connection
            // });
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
            cache.current[walletPublicKey] = validResults;
            shouldRefetchRef.current = shouldRefetchNFTs;
            console.log('@@-- this is the nft array', validResults);
            setNFTs(validResults);
          }
        } else {
          setNFTs([]);
        }
      }
    };

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

  // const fetchImageAndTokenIdForCreatorNFTs = async (
  //   nfts: NFT[],
  //   creator: string
  // ) => {
  //   console.log('@@-- running one')
  //   //filter out creator nfts and others from NFTs
  //   let creatorNFTs: NFT[] = [];
  //   let otherNFTs: NFT[] = [];
  //   for (let i = 0; i < nfts.length; i++) {
  //     if (nfts[i].creators.map(creator => creator.address).includes(creator)) {
  //       creatorNFTs.push(nfts[i]);
  //     } else {
  //       otherNFTs.push(nfts[i]);
  //     }
  //   }

  //   //if image url of first nft is default image url, fetch for all creator NFTs
  //   if (creatorNFTs.length && creatorNFTs[0].image === defaultNFTImageUrl) {
  //     console.log('@@-- running two')
  //     //fetch image uri and tokenId for creatorNFts
  //     const promises = creatorNFTs.map(async nft => {
  //       // const imageURI = await getNFTImgURI(nft.tokenUri ?? '');
  //       console.log('@@-- formatted NFT?', nft)
  //       const tokenMetaPublicKey = await programs.metadata.Metadata.getPDA(
  //         new PublicKey(nft.mint)
  //       );
  //       const result: NFT = {
  //         name: nft.name,
  //         symbol: nft.name,
  //         updateAuthority: nft.updateAuthority,
  //         image: nft.image,
  //         creators: nft.creators,
  //         mint: nft.mint,
  //         tokenId: tokenMetaPublicKey.toString()
  //       };
  //       return result;
  //     });

  //     const results = await Promise.all(
  //       promises.map(p =>
  //         p.catch(e => {
  //           console.error('Error fetching individual NFT with error');
  //           console.error(e);
  //           return defaultNFT;
  //         })
  //       )
  //     );
  //     creatorNFTs = results;

  //     //update cache
  //     cache.current[walletPublicKey] = [...creatorNFTs, ...otherNFTs];
  //     //update state
  //     setNFTs([...creatorNFTs, ...otherNFTs]);
  //   }
  // };

  // useEffect(() => {
  //   if (NFTs.length && creator) {
  //     fetchImageAndTokenIdForCreatorNFTs(NFTs, creator);
  //   }
  // }, [creator, NFTs]);

  return [NFTs, isLoading, refetchNFTs];
}

//grab image URI from fetching from NFT uri
// async function getNFTImgURI(uri: string) {
//   if (uri && uri != '') {
//     return fetch(uri)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(
//             'Network response was not OK when fetching NFT image URI'
//           );
//         }
//         return response.json();
//       })
//       .then(result => {
//         return result.image;
//       })
//       .catch(error => {
//         console.error(error);
//         return '';
//       });
//   } else {
//     return '';
//   }
// }
