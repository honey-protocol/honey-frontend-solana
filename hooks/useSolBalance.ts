import React, { useCallback, useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

export const useSolBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState({});
  const wallet = useWallet();
  const { connection } = useConnection();

  const getSOLBalance = useCallback(async () => {
    setLoading(true);
    if (!wallet?.connected || !wallet.publicKey) return;
    try {
      let bal = await connection.getBalance(wallet.publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [connection, wallet]);

  useEffect(() => {
    getSOLBalance();
  }, [getSOLBalance, shouldRefetch]);

  return { balance, loading, refetch: () => setShouldRefetch({}) };
};

export const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState({});
  const wallet = useWallet();
  const { connection } = useConnection();

  const getTokenBalance = useCallback(async () => {
    setLoading(true);
    if (!wallet?.connected || !wallet.publicKey) return;
    try {
      let tokenAccount = await connection.getTokenAccountsByOwner(
        wallet.publicKey,
        {
          mint: new PublicKey(tokenAddress)
        }
      );

      const tokenBalance = await connection.getTokenAccountBalance(
        tokenAccount.value[0].pubkey
      );
      setBalance(tokenBalance.value.uiAmount ?? 0);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [connection, wallet, tokenAddress]);

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance, shouldRefetch]);

  return { balance, loading, refetch: () => setShouldRefetch({}) };
};

// export default useSolBalance;
