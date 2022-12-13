import { DialectDappsIdentityResolver } from '@dialectlabs/identity-dialect-dapps';
import {
  DialectSolanaSdk,
  DialectSolanaWalletAdapter,
  SolanaConfigProps
} from '@dialectlabs/react-sdk-blockchain-solana';
import {
  ConfigProps,
  defaultVariables,
  DialectThemeProvider,
  DialectUiManagementProvider,
  IncomingThemeVariables
} from '@dialectlabs/react-ui';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { solanaWalletToDialectWallet } from '../helpers/wallet';
import { useWallet } from '@saberhq/use-solana';

export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'w-10 h-10 shadow-xl shadow-neutral-800 border border-neutral-600 hover:shadow-neutral-700 bg-white text-black',
    modal: `${defaultVariables.dark.modal} sm:border border-[#383838]/40 bg-[#141414]` // 0.4 opacity based on trial-and-error
  },
  animations: {
    popup: {
      enter: 'transition-all duration-300 origin-top-right',
      enterFrom: 'opacity-0 scale-75',
      enterTo: 'opacity-100 scale-100',
      leave: 'transition-all duration-100 origin-top-right',
      leaveFrom: 'opacity-100 scale-100',
      leaveTo: 'opacity-0 scale-75'
    }
  }
};

type ThemeType = 'light' | 'dark' | undefined;

export const DialectProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useWallet();
  const [theme, setTheme] = useState<ThemeType>('light');

  const [dialectSolanaWalletAdapter, setDialectSolanaWalletAdapter] =
    useState<DialectSolanaWalletAdapter | null>(null);

  useEffect(() => {
    if (wallet.wallet?.publicKey) {
      setDialectSolanaWalletAdapter(solanaWalletToDialectWallet(wallet.wallet));
    }
  }, [wallet]);

  const dialectConfig = useMemo((): ConfigProps => {
    return {
      environment: 'production',
      dialectCloud: {
        tokenStore: 'local-storage'
      },
      identity: {
        resolvers: [new DialectDappsIdentityResolver()]
      }
    };
  }, []);

  const solanaConfig: SolanaConfigProps = useMemo(
    () => ({
      wallet: dialectSolanaWalletAdapter
    }),
    [dialectSolanaWalletAdapter]
  );

  // useEffect(() => {
  //   if (
  //     window.matchMedia &&
  //     window.matchMedia('(prefers-color-scheme: dark)').matches
  //   ) {
  //     setTheme('dark');
  //   } else {
  //     setTheme('light');
  //   }
  //   window
  //     .matchMedia('(prefers-color-scheme: dark)')
  //     .addEventListener('change', event => {
  //       const newColorScheme = event.matches ? 'dark' : 'light';
  //       setTheme(newColorScheme);
  //     });
  // }, []);

  return (
    <DialectSolanaSdk
      config={dialectConfig}
      solanaConfig={solanaConfig}
      gate={() => new Promise(resolve => setTimeout(() => resolve(true), 3000))}
    >
      <DialectThemeProvider theme={theme} variables={themeVariables}>
        <DialectUiManagementProvider>{children}</DialectUiManagementProvider>
      </DialectThemeProvider>
    </DialectSolanaSdk>
  );
};
