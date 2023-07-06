import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { useRouter } from 'next/router';
import { imageURLs } from 'constants/imageLinks';
const cloudinary_uri = process.env.CLOUDINARY_URI;

class MyDocument extends NextDocument {
  render() {
    return (
      <Html lang="eng">
        <Head>
          <DynamicMeta />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

const DynamicMeta = () => {
  const marketId = '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3';
  const selectedImage = imageURLs.filter(
    imageObject => imageObject.marketID === marketId
  );

  const dynamicImageUrl = selectedImage[0].url;

  return (
    <>
      <meta
        property="og:image"
        content={`https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${dynamicImageUrl}`}
      />
    </>
  );
};

export default MyDocument;
