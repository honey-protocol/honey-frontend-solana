import { HoneyMarket } from '@honey-finance/sdk';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import React from 'react';
import * as styles from './MarketDetailsStep.css';

interface MarketDetailsProps {
  createMarket: () => Promise<void>;
  createdMarket: HoneyMarket | null | undefined;
  initMarketReserve: () => Promise<void>;
  copyToClipboard: () => void;
}

const MarketDetailsStep = (props: MarketDetailsProps) => {
  const { createMarket, createdMarket, initMarketReserve, copyToClipboard } =
    props;

  const openGithubInNewTab = () => {
    window.open('https://google.com', '_blank', 'noopener,noreferrer');
  };
  return (
    <>
      <HoneyButton variant="primary" onClick={() => createMarket()}>
        Create market
      </HoneyButton>
      <div className={styles.newMarketPublicKey}>
        <span className={styles.marketAddress}>Market Address: </span>
        <span className={styles.publicKeyOverflow}>
          {createdMarket && createdMarket.address.toString()}
        </span>
      </div>
      <HoneyButton variant="primary" onClick={() => initMarketReserve()}>
        Create reserve
      </HoneyButton>

      <div>
        Register your market with the official Honey Labs Github Repository
      </div>
      <HoneyButton variant="secondary" onClick={() => copyToClipboard()}>
        Copy
      </HoneyButton>
      <HoneyButton variant="primary" onClick={() => openGithubInNewTab()}>
        Open Github Pull Request
      </HoneyButton>
    </>
  );
};

export default MarketDetailsStep;
