import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import {
  deserializeAccount,
  TokenAccountData,
  TOKEN_PROGRAM_ID
} from '@saberhq/token-utils';

export interface TokenAccount {
  pubkey: PublicKey;
  data: TokenAccountData;
}

export interface AccountsContextValueProps {
  accounts: TokenAccount[];
  reload?: () => Promise<void>;
}

export const AccountsContext = createContext<AccountsContextValueProps>({
  accounts: []
});

export const AccountsProvider: React.FC<React.ReactNode> = ({ children }) => {
  const wallet = useConnectedWallet();
  const connection = useConnection();
  const [accounts, setAccounts] = useState<TokenAccount[]>([]);
  const ownerKey = wallet?.publicKey;

  async function fetch() {
    if (!ownerKey) return;

    const accountInfos = await connection.getTokenAccountsByOwner(ownerKey, {
      programId: TOKEN_PROGRAM_ID
    });

    const tokenAccounts = accountInfos.value.map(info => {
      const data = deserializeAccount(info.account.data);

      return {
        pubkey: info.pubkey,
        data
      };
    });

    setAccounts(tokenAccounts);
  }

  useEffect(() => {
    if (!connection || !ownerKey) {
      setAccounts([]);
    } else {
      fetch();

      const timer = setInterval(() => fetch(), 10000);

      return () => clearInterval(timer);
    }
  }, [connection, ownerKey]);

  return (
    <AccountsContext.Provider value={{ accounts, reload: fetch }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error('Accounts context undefined');
  }

  return context;
};
