import { HoneyMarket } from '@honey-finance/sdk';
import React from 'react';

interface MarketDetailsProps {
  createdMarket: HoneyMarket | null | undefined;
}
const MarketDetailsStep = (props: MarketDetailsProps) => {
  const { createdMarket } = props;
  return <div>{createdMarket && createdMarket.address}</div>;
};

export default MarketDetailsStep;
