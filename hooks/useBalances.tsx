import React, { useCallback, useEffect, useState } from 'react';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  AccountInfo,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext
} from '@solana/web3.js';
import BN from 'bn.js';

export type TokenBalance = {
  amount: BN;
  decimals: number;
};
export type TokenBalances = Record<string, TokenBalance>;

export const useWalletTokensBalances = () => {
  const [tokensBalancesMap, setTokenBalancesMap] = useState<TokenBalances>({});
  const wallet = useConnectedWallet();
  const connection = useConnection();

  const getUserTokenBalances = useCallback(async () => {
    if (!wallet?.connected || !wallet.publicKey) {
      return;
    }
    try {
      const owner = wallet.publicKey;
      const balances: RpcResponseAndContext<
        Array<{
          pubkey: PublicKey;
          account: AccountInfo<ParsedAccountData>;
        }>
      > = await connection.getParsedTokenAccountsByOwner(owner, {
        programId: TOKEN_PROGRAM_ID
      });
      return balances;
    } catch (e) {
      console.error(e);
    }
  }, [connection, wallet]);

  const refreshBalances = useCallback(async () => {
    if (!wallet?.connected) return;

    try {
      const balances = await getUserTokenBalances();
      if (balances) {
        const balancesFormatted: TokenBalances = balances.value.reduce(
          (sum, balance) => {
            const mint = balance.account.data.parsed.info.mint;
            const tokenAmount = balance.account.data.parsed.info.tokenAmount;
            sum[mint] = {
              amount: tokenAmount.amount,
              decimals: tokenAmount.decimals
            };
            return sum;
          },
          {} as TokenBalances
        );
        // merge token balances
        setTokenBalancesMap(prevState => {
          return { ...prevState, ...balancesFormatted };
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [connection, wallet, getUserTokenBalances]);

  useEffect(() => {
    refreshBalances();
  }, [wallet, connection]);

  return {
    refreshBalances,
    balances: tokensBalancesMap
  };
};
