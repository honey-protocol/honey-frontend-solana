import { useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';

import { useAccountsContext } from 'contexts/AccountsProvider';

export const useAccountByMint = (mint: PublicKey | undefined | null) => {
  const { accounts } = useAccountsContext();

  if (!mint) return null;

  const account = useMemo(
    () => accounts.find(acc => acc.data.mint.equals(mint)),
    [accounts]
  );

  return account ?? null;
};
