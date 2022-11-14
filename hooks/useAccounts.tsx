import { useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';

import { useAccountsContext } from 'contexts/AccountsProvider';

export const useAccountByMint = (mint: PublicKey | undefined | null) => {
  const { accounts } = useAccountsContext();

  const account = useMemo(() => {
    if (!mint) return null;

    return accounts.find(acc => acc.data.mint.equals(mint));
  }, [accounts, mint]);

  return account;
};
