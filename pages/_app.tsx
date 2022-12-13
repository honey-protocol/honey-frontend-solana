import React, { FC, ReactNode, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import 'degen/styles';
import '@dialectlabs/react-ui/index.css';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Network } from '@saberhq/solana-contrib';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'degen';
import SecPopup from 'components/SecPopup';
import { AnchorProvider, HoneyProvider } from '@honey-finance/sdk';
import { PublicKey } from '@solana/web3.js';
import { getPlatformFeeAccounts, JupiterProvider } from '@jup-ag/react-hook';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import { SailProvider } from '@saberhq/sail';
import Script from 'next/script';

import { AccountsProvider } from 'contexts/AccountsProvider';
import { DialectProviders } from 'contexts/DialectProvider';
import { GovernanceProvider } from 'contexts/GovernanceProvider';
import { onSailError } from 'helpers/error';
import {
  HONEY_GENESIS_MARKET_ID,
  HONEY_PROGRAM_ID
} from '../helpers/marketHelpers/index';

export const network = (process.env.NETWORK as Network) || 'mainnet-beta';
export const setMarketId = (marketID: string) => marketID;

const queryClient = new QueryClient();

// const defaultAccent: ThemeAccent = accentSequence[0];
// const storedAccent =
//   typeof window !== 'undefined'
//     ? (localStorage.getItem('accent') as ThemeAccent)
//     : undefined;

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
        honeyMarketId={setMarketId(HONEY_GENESIS_MARKET_ID)}
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
  console.log('platformFeeAndAccounts', platformFeeAndAccounts);

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

function MyApp({ Component, pageProps }: AppProps) {
  const [showPopup, setShowPopup] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const onWindowResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
  useEffect(() => {
    const cautionAgreed = localStorage.getItem('caution-agreed');
    setShowPopup(cautionAgreed === 'true' ? false : true);
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
    <ThemeProvider defaultMode="light" defaultAccent={'yellow'}>
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
          app={{ name: 'Honey Finance' }}
        >
          <AccountsProvider>
            <SailProvider
              initialState={{
                onSailError
              }}
            >
              {/* {children} */}
              {showPopup ? (
                <SecPopup setShowPopup={setShowPopup} />
              ) : (
                <>
                  <HoneyJupiterProvider>
                    <DialectProviders>
                      <OnChainProvider>
                        <GovernanceProvider>
                          <Component {...pageProps} />
                          <ToastContainer
                            theme="dark"
                            position="bottom-right"
                          />
                        </GovernanceProvider>
                      </OnChainProvider>
                    </DialectProviders>
                  </HoneyJupiterProvider>
                </>
              )}
            </SailProvider>
          </AccountsProvider>
        </WalletKitProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
