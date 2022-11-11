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
      <HoneyButton block variant="primary" onClick={() => createMarket()}>
        Create market
      </HoneyButton>
      <div className={styles.spacer}></div>

      <div className={styles.newMarketPublicKey}>
        <span className={styles.marketAddress}>
          <b>Market Address: </b>
        </span>
        <span className={styles.publicKeyOverflow}>
          {createdMarket && createdMarket.address.toString()}
        </span>
      </div>
      <div className={styles.spacer}></div>

      <HoneyButton block variant="primary" onClick={() => initMarketReserve()}>
        Create reserve
      </HoneyButton>
      <div className={styles.spacer}></div>

      <div>
        Register your market with the official Honey Labs Github repository
      </div>

      <div className={styles.githubCopyRow}>
        <HoneyButton variant="primary" onClick={() => openGithubInNewTab()}>
          Open Github Pull Request
        </HoneyButton>
        <HoneyButton variant="secondary" onClick={() => copyToClipboard()}>
          Copy
        </HoneyButton>
      </div>
    </>
  );
};

export default MarketDetailsStep;
