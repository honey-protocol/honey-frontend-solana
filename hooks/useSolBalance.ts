import React, { useCallback, useEffect, useState } from 'react';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const useSolBalance = () => {
  const [balance, setBalance] = useState(0);
  const wallet = useConnectedWallet();
  const connection = useConnection();

  const getSOLBalance = useCallback(async () => {
    if (!wallet?.connected) return;
    try {
      let bal = await connection.getBalance(wallet.publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (error) {
      console.log(error);
    }
  }, [connection, wallet]);

  useEffect(() => {
    getSOLBalance();
  }, [getSOLBalance]);

  return balance;
};

// export default useSolBalance;
