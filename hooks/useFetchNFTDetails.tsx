import { useConnection } from '@saberhq/use-solana';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { extractMetaData } from 'helpers/utils';
import { useCallback, useEffect, useState } from 'react';

export const useFetchNFTDetails = (tokenMint?: PublicKey) => {
  const [nft, setNft] = useState<NFT>();
  const [isLoading, setIsLoading] = useState(true);
  const connection = useConnection();

  const fetchLoanMetadata = useCallback(async () => {
    if (!tokenMint) return;
    try {
      setIsLoading(true);
      const nftDetails = await extractMetaData(tokenMint, connection);
      setNft(nftDetails);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [connection, tokenMint]);

  useEffect(() => {
    fetchLoanMetadata();
  }, [fetchLoanMetadata]);

  useEffect(() => {
    if (tokenMint) {
      fetchLoanMetadata();
    }
  }, [fetchLoanMetadata, tokenMint]);

  return { nft, isLoading };
};
