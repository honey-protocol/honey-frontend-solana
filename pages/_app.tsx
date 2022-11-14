import React, { FC, ReactNode, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AnchorProvider, HoneyProvider } from '@honey-finance/sdk';
import { Network } from '@saberhq/solana-contrib';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import { SailProvider } from '@saberhq/sail';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import 'react-toastify/dist/ReactToastify.css';

import SecPopup from 'components/SecPopup';
import { GovernanceProvider } from 'contexts/GovernanceProvider';
import { AccountsProvider } from 'contexts/AccountsProvider';
// import { accentSequence, ThemeAccent } from '../helpers/theme-utils';
import { onSailError } from 'helpers/error';
import { HONEY_MARKET_ID, HONEY_PROGRAM_ID } from 'constants/loan';
// import NoMobilePopup from 'components/NoMobilePopup/NoMobilePopup';

import '../styles/globals.css';

export const network = (process.env.NETWORK as Network) || 'mainnet-beta';

const queryClient = new QueryClient();

// const defaultAccent: ThemeAccent = accentSequence[0];
// const storedAccent =
//   typeof window !== 'undefined'
//     ? (localStorage.getItem('accent') as ThemeAccent)
//     : undefined;

const OnChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useConnectedWallet();
  const connection = useConnection();

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
        honeyMarketId={HONEY_MARKET_ID}
      >
        {children}
      </HoneyProvider>
    </AnchorProvider>
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
                  <OnChainProvider>
                    <Component {...pageProps} />
                    <ToastContainer theme="dark" position="bottom-right" />
                  </OnChainProvider>
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
