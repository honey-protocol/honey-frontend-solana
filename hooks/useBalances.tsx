import React, { FC, useCallback, useEffect, useState } from 'react';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token-v-0.1.8';
import {
  AccountInfo,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext
} from '@solana/web3.js';
import BN from 'bn.js';
import { useSolBalance } from './useSolBalance';
import { WRAPPED_SOL_MINT } from '@jup-ag/react-hook';
import Decimal from 'decimal.js';
import { SOL_DECIMALS } from '@honey-finance/sdk';

export type TokenBalance = {
  amount: BN;
  decimals: number;
};
export type TokenBalances = Record<string, TokenBalance>;
type WalletTokensBalancesOptions = {
  mergeSolAndWsolBalance?: boolean;
};

export const useWalletTokensBalances = ({
  mergeSolAndWsolBalance
}: WalletTokensBalancesOptions = {}) => {
  const [tokensBalancesMap, setTokenBalancesMap] = useState<TokenBalances>({});
  const wallet = useConnectedWallet();
  const connection = useConnection();
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
  }, [connection, wallet, getUserTokenBalances, mergeSolAndWsolBalance]);

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
      tokensBalances[WRAPPED_SOL_MINT.toString()]?.amount || new BN(0);

    const solBalanceLamports = new Decimal(solBalance).mul(10 ** SOL_DECIMALS);
    // leave some sol to pay transactions fees
    const solSafeBufferLamports = new Decimal(0.15).mul(10 ** SOL_DECIMALS);

    // wsol + sol - safeBuffer
    const totalBalance = BN.max(
      wsolBalance.add(
        new BN(
          solBalanceLamports.minus(solSafeBufferLamports).floor().toString()
        )
      ),
      new BN(0)
    );

    tokensBalances[WRAPPED_SOL_MINT.toString()] = {
      amount: totalBalance,
      decimals: SOL_DECIMALS
    };

    return tokensBalances;
  };

  return {
    refreshBalances,
    balances: mergeSolAndWsolBalance
      ? mergeSolAndWsolBalances({ ...tokensBalancesMap })
      : tokensBalancesMap
  };
};
