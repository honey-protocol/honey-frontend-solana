import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import {
  deserializeAccount,
  getATAAddressSync,
  TokenAccountData,
  TOKEN_PROGRAM_ID
} from '@saberhq/token-utils';
import {
  getParsedNftAccountsByOwner,
  resolveToWalletAddress
} from '@nfteyez/sol-rayz';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

export interface TokenAccount {
  pubkey: PublicKey;
  data: TokenAccountData;
}

export interface NFT {
  name: string;
  symbol: string;
  updateAuthority: PublicKey;
  image: string;
  creators: any[];
  mint: PublicKey;
  tokenId: PublicKey;
}

export interface NFTAccount {
  pubkey: PublicKey;
  data: NFT;
}

export interface AccountsContextValueProps {
  accounts: TokenAccount[];
  nfts: NFTAccount[];
  reload?: () => Promise<void>;
}

export const AccountsContext = createContext<AccountsContextValueProps>({
  accounts: [],
  nfts: []
});

export const AccountsProvider: React.FC<React.ReactNode> = ({ children }) => {
  const wallet = useConnectedWallet();
  const connection = useConnection();
  const [accounts, setAccounts] = useState<TokenAccount[]>([]);
  const [nfts, setNfts] = useState<NFTAccount[]>([]);
  const ownerKey = wallet?.publicKey;

  async function load() {
    if (!ownerKey) return;

    const accountInfos = await connection.getTokenAccountsByOwner(ownerKey, {
      programId: TOKEN_PROGRAM_ID
    });

    const keyVerified = await resolveToWalletAddress({
      text: ownerKey.toBase58(),
      connection
    });

    const nfts = await getParsedNftAccountsByOwner({
      publicAddress: keyVerified,
      connection
    });

    const nftAccounts: NFTAccount[] = await Promise.all(
      nfts.map(async nft => {
        const mint = new PublicKey(nft.mint);
        const meta = await Metadata.getPDA(mint);
        const image = await getNFTImgURI(nft.data.uri, nft.data.name);

        return {
          pubkey: getATAAddressSync({ mint, owner: ownerKey }),
          data: {
            name: nft.data.name,
            symbol: nft.data.symbol,
            updateAuthority: new PublicKey(nft.updateAuthority),
            image,
            creators: nft.data.creators,
            mint: new PublicKey(nft.mint),
            tokenId: meta
          }
        };
      })
    );

    const tokenAccounts = accountInfos.value
      .filter(info => !nftAccounts.find(nft => nft.pubkey.equals(info.pubkey)))
      .map(info => {
        const data = deserializeAccount(info.account.data);

        return {
          pubkey: info.pubkey,
          data
        };
      });

    setNfts(nftAccounts);
    setAccounts(tokenAccounts);
  }

  useEffect(() => {
    if (!connection || !ownerKey) {
      setAccounts([]);
      setNfts([]);
    } else {
      load();

      const timer = setInterval(() => load(), 10000);

      return () => clearInterval(timer);
    }
  }, [connection, ownerKey]);

  return (
    <AccountsContext.Provider value={{ accounts, nfts, reload: load }}>
      {children}
    </AccountsContext.Provider>
  );
};

const allowedCollections = [
  'pesky penguins',
  'burrito boyz',
  'droid',
  'lifinity flares',
  'vandals',
  'honey genesis bee',
  'elixir: ovols',
  'blocksmith labs',
  "Trippin' Ape Tribe",
  'og atadians',
  'Ukiyo',
  'Droid Capital',
  'Heavenland',
  'Marshies',
  'drunken ape social club'
];

async function getNFTImgURI(uri: string, name: string) {
  if (!!uri) {
    // only make the request if the
    if (allowedCollections.includes(name.toLocaleLowerCase())) {
      return fetch(uri)
        .then(response => {
          if (!response.ok) {
            throw new Error(
              'Network response was not OK when fetching NFT image URI'
            );
          }
          return response.json();
        })
        .then(result => {
          return result.image;
        })
        .catch(error => {
          console.error(`Error occurred while getting NFT image URI: ${uri}`);
          console.error(error);
          return '';
        });
    } else {
      return '';
    }
  }
  return '';
}
