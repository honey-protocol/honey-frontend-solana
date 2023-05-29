import React, { useCallback, useEffect, useState } from 'react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token-v-0.1.8';
import {
  AccountInfo,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext
} from '@solana/web3.js';
import { useSolBalance } from './useSolBalance';
import { WRAPPED_SOL_MINT } from '@jup-ag/react-hook';
import Decimal from 'decimal.js';
import { SOL_DECIMALS } from '@honey-finance/sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export type TokenBalance = {
  amount: string;
  decimals: number;
};
export type TokenBalances = Record<string, TokenBalance>;
type WalletTokensBalancesOptions = {
  areSolWsolBalancesMerged?: boolean;
};

export const useWalletTokensBalances = ({
  areSolWsolBalancesMerged
}: WalletTokensBalancesOptions = {}) => {
  const [tokensBalancesMap, setTokenBalancesMap] = useState<TokenBalances>({});
  const wallet = useWallet();
  const { connection } = useConnection();
  const solBalance = useSolBalance();

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
  }, [connection, wallet, getUserTokenBalances, areSolWsolBalancesMerged]);

  useEffect(() => {
    refreshBalances();
  }, [wallet, connection]);

  const mergeSolAndWsolBalances = (
    tokensBalances: TokenBalances
  ): TokenBalances => {
    if (!tokensBalances) {
      return tokensBalances;
    }

    const wsolBalance =
      tokensBalances[WRAPPED_SOL_MINT.toString()]?.amount.toString() || '0';

    const solBalanceLamports = new Decimal(solBalance).mul(10 ** SOL_DECIMALS);
    // leave some sol to pay transactions fees
    const solSafeBufferLamports = new Decimal(0.15).mul(10 ** SOL_DECIMALS);

    // wsol + sol - safeBuffer
    const totalBalance = Decimal.max(
      new Decimal(wsolBalance).add(
        new Decimal(solBalanceLamports.minus(solSafeBufferLamports).toString())
      ),
      new Decimal(0)
    );

    tokensBalances[WRAPPED_SOL_MINT.toString()] = {
      amount: totalBalance.toString(),
      decimals: SOL_DECIMALS
    };

    return tokensBalances;
  };

  return {
    refreshBalances,
    balances: areSolWsolBalancesMerged
      ? mergeSolAndWsolBalances({ ...tokensBalancesMap })
      : tokensBalancesMap
  };
};
