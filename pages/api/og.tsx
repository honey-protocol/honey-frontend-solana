import { ImageResponse } from '@vercel/og';
import { marketCollections } from 'helpers/marketHelpers';

export const config = {
  runtime: 'experimental-edge',
  unstable_allowDynamic: [
    '/helpers/marketHelpers/index.tsx',
    '/node_modules/**'
  ]
};

export default function (req: any, res: any) {
  const urlParams = new URLSearchParams(req.nextUrl.search);
  const marketId = urlParams.get('id');

  let imageContent;
  if (marketId) {
    const selectedMarket = marketCollections.find(
      collection => collection.constants.marketId === marketId
    );

    if (selectedMarket) {
      // Return the image representing the selected market
      imageContent = (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img src={selectedMarket.name} alt={selectedMarket.name} />
        </div>
      );
    }
  }

  // If no market is selected or selected market not found, return a default image or response
  if (!imageContent) {
    imageContent = (
      <div
        style={{
          fontSize: 60,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Borrow from various markets
      </div>
    );
  }

  return new ImageResponse(imageContent, {
    width: 1200,
    height: 600
  });
}
