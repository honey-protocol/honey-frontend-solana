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
  const reserveMarket = '';

  const openGithubInNewTab = () => {
    window.open(
      'https://github.com/honey-labs/honey-market-registry',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <>
      <div className={styles.stepText}>Step 1</div>
      <HoneyButton block variant="primary" onClick={() => createMarket()}>
        Deploy market programs
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

      <div className={styles.stepText}>Step 2</div>
      <HoneyButton block variant="primary" onClick={() => initMarketReserve()}>
        Deploy SOL reserve
      </HoneyButton>
      <div className={styles.spacer}></div>

      <div className={styles.newMarketPublicKey}>
        <span className={styles.marketAddress}>
          <b>Reserve Address: </b>
        </span>
        <span className={styles.publicKeyOverflow}>{reserveMarket}</span>
      </div>
      <div className={styles.spacer}></div>

      <div className={styles.stepText}>Step 3</div>
      <div>
        To list your market, create a pull request in the Honey Labs Github
        repository. View our instructions <a href="https://docs.honey.finance/tutorials/tutorials/create-a-market">here</a>
      </div>
      <div className={styles.spacer}></div>

      <div className={styles.githubCopyRow}>
        <HoneyButton variant="secondary" onClick={() => copyToClipboard()}>
          Copy
        </HoneyButton>
        <HoneyButton variant="primary" onClick={() => openGithubInNewTab()}>
          Open Github Pull Request
        </HoneyButton>
      </div>
    </>
  );
};

export default MarketDetailsStep;
