import { ImageResponse } from '@vercel/og';
import { marketCollections } from 'helpers/marketHelpers';

export const config = {
  runtime: 'experimental-edge'
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (req: any, res: any) {
  const urlParams = new URLSearchParams(req.nextUrl.search);
  const marketId = urlParams.get('id');

  const selectedMarket = marketCollections.find(
    collection => collection.constants.marketId === marketId
  );

  return new ImageResponse(
    (
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
        {selectedMarket ? selectedMarket.name : 'Borrow from various markets'}
      </div>
    ),
    {
      width: 1200,
      height: 600
    }
  );
}
