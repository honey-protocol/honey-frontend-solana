/* eslint-disable @next/next/no-css-tags */
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import '@dialectlabs/react-ui/index.css';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import '../styles/globals.css';
import { Network } from '@saberhq/solana-contrib';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PartialNetworkConfigMap } from '@saberhq/use-solana/src/utils/useConnectionInternal';
import SecPopup from 'components/SecPopup';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { AnchorProvider, HoneyProvider } from '@honey-finance/sdk';
import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState
} from 'react';
import Script from 'next/script';
import { SailProvider } from '@saberhq/sail';
import { onSailError } from 'helpers/error';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getPlatformFeeAccounts, JupiterProvider } from '@jup-ag/react-hook';
export const network = (process.env.NETWORK as Network) || 'mainnet-beta';

import {
  HONEY_GENESIS_MARKET_ID,
  HONEY_PROGRAM_ID
} from '../helpers/marketHelpers/index';
import { DialectProviders } from 'contexts/DialectProvider';
import { PublicKey } from '@solana/web3.js';
import Head from 'next/head';
import { HoneyIcon } from 'icons/HoneyIcon';
// top level function that injects the app with a new market ID - being called from pages where interaction with markets is possible. Currently: borrow | lend | liquidate
// export const setMarketId = (marketID: string) => marketID;

const networkConfiguration = () => {
  if (process.env.NETWORK_CONFIGURATION) {
    return process.env.NETWORK_CONFIGURATION as PartialNetworkConfigMap;
  } else {
    return undefined;
  }
};

const queryClient = new QueryClient();

const OnChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useConnectedWallet();
  const connection = useConnection();
  const network = 'mainnet-beta';

  return (
    <AnchorProvider
      wallet={wallet}
      connection={connection}
      network={network}
      honeyProgram={HONEY_PROGRAM_ID}
    >
      <HoneyProvider
        wallet={wallet}
        connection={connection}
        honeyProgramId={HONEY_PROGRAM_ID}
        honeyMarketId={HONEY_GENESIS_MARKET_ID}
      >
        {children}
      </HoneyProvider>
    </AnchorProvider>
  );
};

const HoneyJupiterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useConnectedWallet();
  const connection = useConnection();
  const [platformFeeAccounts, setPlatformFeeAccounts] = useState(new Map());
  const platformFeeBps = Number(process.env.NEXT_PUBLIC_JUPITER_FEE_BPS || '0');
  const platformFeeWallet = process.env.NEXT_PUBLIC_JUPITER_FEE_ADDRESS
    ? new PublicKey(process.env.NEXT_PUBLIC_JUPITER_FEE_ADDRESS)
    : undefined;

  useEffect(() => {
    if (!platformFeeBps || !platformFeeWallet) {
      return;
    }
    getPlatformFeeAccounts(connection, platformFeeWallet).then(res => {
      setPlatformFeeAccounts(res);
    });
    //  eslint-disable react-hooks/exhaustive-deps
  }, []);

  let platformFeeAndAccounts = undefined;
  if (platformFeeBps && platformFeeWallet) {
    platformFeeAndAccounts = {
      feeBps: platformFeeBps,
      feeAccounts: platformFeeAccounts
    };
  }
  // console.log('platformFeeAndAccounts', platformFeeAndAccounts);

  return (
    <JupiterProvider
      connection={connection}
      cluster="mainnet-beta"
      platformFeeAndAccounts={platformFeeAndAccounts}
      userPublicKey={wallet?.publicKey || undefined}
      onlyDirectRoutes={false}
    >
      {children}
    </JupiterProvider>
  );
};

interface HoneyThemeContext {
  theme: HoneyTheme;
  setTheme: (theme: HoneyTheme) => void;
}

export const HoneyThemeContext = createContext<HoneyThemeContext>(
  {} as HoneyThemeContext
);

function MyApp({ Component, pageProps }: AppProps) {
  const [showPopup, setShowPopup] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<HoneyTheme>('light');

  const onWindowResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
  useEffect(() => {
    const cautionAgreed = localStorage.getItem('caution-agreed');
    const savedTheme: any = localStorage.getItem('honey-theme');
    setShowPopup(cautionAgreed === 'true' ? false : true);
    if (savedTheme) {
      setTheme(savedTheme);
    }
    onWindowResize();
    window.addEventListener('resize', () => onWindowResize());
    setShouldRender(true);

    return window.removeEventListener('resize', () => onWindowResize());
  }, []);

  if (!shouldRender) return null;

  // if (isMobile) return <NoMobilePopup />;

  return (
    // <ThemeProvider
    //   defaultMode="dark"
    //   defaultAccent={storedAccent || defaultAccent}
    // >

    <ThemeProvider
      defaultMode={['dark', 'dusk'].includes(theme) ? 'dark' : 'light'}
      defaultAccent={'yellow'}
    >
      <HoneyThemeContext.Provider
        value={{
          theme,
          setTheme: (theme: HoneyTheme) => {
            localStorage.setItem('honey-theme', theme);
            setTheme(theme);
          }
        }}
      >
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA}`}
        />
        <Script id="gtm-script" strategy="lazyOnload">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA}');

         `}
        </Script>
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <WalletKitProvider
            defaultNetwork={network}
            app={{
              name: 'Honey Finance',
              icon: <HoneyIcon />
            }}
            networkConfigs={networkConfiguration()}
          >
            <SailProvider
              initialState={{
                onSailError
              }}
            >
              {/* <GovernorProvider
                initialState={{
                  governor: GOVERNOR_ADDRESS,
                  govToken: HONEY_MINT,
                  minter: {
                    mintWrapper: HONEY_MINT_WRAPPER
                  }
                }}
              > */}
              {/* {children} */}
              {
                <>
                  <HoneyJupiterProvider>
                    <DialectProviders>
                      <OnChainProvider>
                        <Head>
                          <link
                            id="theme"
                            rel="stylesheet"
                            type="text/css"
                            href="/css/antdLightTheme.css"
                          />
                          {['dark', 'dusk'].includes(theme) && (
                            <link
                              id="theme"
                              rel="stylesheet"
                              type="text/css"
                              href="/css/antdDarkTheme.css"
                            />
                          )}
                        </Head>
                        <div
                          className={
                            theme === 'dark'
                              ? 'honey-dark-theme'
                              : theme === 'dusk'
                              ? 'honey-dusk-theme'
                              : 'honey-light-theme'
                          }
                        >
                          {showPopup ? (
                            <SecPopup setShowPopup={setShowPopup} />
                          ) : (
                            <Component {...pageProps} />
                          )}
                        </div>
                        <ToastContainer theme="dark" position="bottom-right" />
                      </OnChainProvider>
                    </DialectProviders>
                  </HoneyJupiterProvider>
                </>
              }
            </SailProvider>
          </WalletKitProvider>
        </QueryClientProvider>
      </HoneyThemeContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
