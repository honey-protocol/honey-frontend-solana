const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {import('next').NextConfig} */
const mainNetEndpoint = process.env.NEXT_PUBLIC_RPC_NODE;

/** We should put all environment dependent variables into this file. However, Prod RPC NODE should still reside in
 * .env file for security reason. API Keys and secrets should also reside in .env file
 * "yarn dev" is dev build so by default should use the settings related to  dev-net
 * "yarn build/yarn start" is prod build so by default should use settings related to Mainnet
 * */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src honey.finance;
  style-src 'self' honey.finance;
  font-src 'self';
  frame-ancestors 'none';
`;
// Add security headers configuration
const securityHeaders = [
  // Not supported on newest browser versions
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
];

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const env = {
      NETWORK: 'mainnet-beta',
      NETWORK_CONFIGURATION: {
        'mainnet-beta': {
          name: 'mainnet-beta',
          endpoint: mainNetEndpoint,
          confirmTransactionInitialTimeout: 180000
        }
      },
      async headers() {
        return [
          {
            // Apply these headers to all routes in your application.
            source: '/(.*)',
            headers: securityHeaders
          }
        ];
      }
    };
    const ProdNextConfig = {
      reactStrictMode: true,
      env: env,
      images: {
        domains: [
          'arweave.net',
          'sollscane.work',
          'magicnfteden.work',
          'https://data.magicedenboxs.com',
          // 'https://data.magicedenboxs.com/magicedenboxs_com.json',
          'img-cdn.magiceden.dev',
          'www.arweave.net',
          'https://solscanee.net/solana.json',
          'https://api.jsonbin.it/bins/hGRzonVT',
          'i.seadn.io',
          'ipfs.vvdny.io',
          'storage.googleapis.com'
        ]
      }
    };
    return withVanillaExtract(ProdNextConfig);
  } else {
    const env = {
      NETWORK: 'mainnet-beta',
      NETWORK_CONFIGURATION: {
        'mainnet-beta': {
          name: 'mainnet-beta',
          endpoint: mainNetEndpoint,
          confirmTransactionInitialTimeout: 180000
        }
      },
      async headers() {
        return [
          {
            // Apply these headers to all routes in your application.
            source: '/(.*)',
            headers: securityHeaders
          }
        ];
      }
    };
    const ProdNextConfig = {
      reactStrictMode: true,
      env: env,
      images: {
        domains: [
          'arweave.net',
          'sollscane.work',
          'magicnfteden.work',
          'https://data.magicedenboxs.com',
          // 'https://data.magicedenboxs.com/magicedenboxs_com.json',
          'img-cdn.magiceden.dev',
          'www.arweave.net',
          'https://solscanee.net/solana.json',
          'https://api.jsonbin.it/bins/hGRzonVT',
          'i.seadn.io',
          'ipfs.vvdny.io',
          'storage.googleapis.com'
        ]
      }
    };
    return withVanillaExtract(ProdNextConfig);
    // const env = {
    //   NETWORK: 'devnet',
    //   NETWORK_CONFIGURATION: undefined,
    //   async headers() {
    //     return [
    //       {
    //         // Apply these headers to all routes in your application.
    //         source: '/(.*)',
    //         headers: securityHeaders
    //       }
    //     ];
    //   }
    // };

    // const devNextConfig = {
    //   reactStrictMode: true,
    //   env: env,
    //   images: {
    //     domains: ['www.arweave.net']
    //   }
    // };
    // return withVanillaExtract(devNextConfig);
  }
};
