import { useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';

import { useAccountsContext } from 'contexts/AccountsProvider';

export const useAccountByMint = (mint: PublicKey) => {
  const { accounts } = useAccountsContext();
  const account = useMemo(
    () => accounts.find(acc => acc.data.mint.equals(mint)),
    [accounts]
  );

  return account;
};
