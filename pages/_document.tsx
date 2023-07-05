import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          property="og:image"
          content="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://madlads.s3.us-west-2.amazonaws.com/images/9009.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
