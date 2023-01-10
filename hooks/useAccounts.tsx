import { useMemo, useContext } from 'react';
import { PublicKey } from '@solana/web3.js';

import { AccountsContext } from 'contexts/AccountsProvider';

export const useAccounts = () => {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error('Accounts context undefined');
  }

  return context;
};

export const useAccountByMint = (mint: PublicKey | undefined | null) => {
  const { accounts } = useAccounts();

  const account = useMemo(() => {
    if (!mint) return null;

    return accounts.find(acc => acc.data.mint.equals(mint));
  }, [accounts, mint]);

  return account;
};

export const useNFTByMint = (mint: PublicKey | undefined | null) => {
  const { nfts } = useAccounts();

  const account = useMemo(() => {
    if (!mint) return null;

    return nfts.find(acc => acc.data.mint.equals(mint));
  }, [nfts, mint]);

  return account;
};
