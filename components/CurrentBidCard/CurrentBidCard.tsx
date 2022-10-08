import React from 'react';
import * as styles from './CurrentBidCard.css';
import c from 'classnames';
import { CurrentBidCardProps } from './types';
import { dateFromTimestamp, formatNumber } from '../../helpers/format';

const {
  format: f,
  formatPercent: fp,
  formatUsd: fu,
  formatSol: fs
} = formatNumber;

const CurrentBidCard = (props: CurrentBidCardProps) => {
  const {fetchedSolPrice, date, usdcValue, solAmount, walletAddress, hasBorder = true } = props;
  console.log('current bid card', fetchedSolPrice)
  // TODO: add SOL/USDC conversion?
  return (
    <div className={c(styles.bidCard, { [styles.hasBorder]: hasBorder })}>
      <div className={styles.bidCardLeft}>
        <div className={styles.bidCardCopy}>
          <p className={styles.bidCardAddress}>{walletAddress}</p>
          <p className={styles.bidCardDate}>{dateFromTimestamp(date)}</p>
        </div>

        <div
          onClick={() => navigator.clipboard.writeText(walletAddress)}
          className={styles.bidCardCopyIcon}
        />
      </div>
      <div className={styles.bidCardRight}>
        <p className={styles.bidCardPrice}>{fs(solAmount)}</p>
        <p className={styles.bidCardUsdcCounts}>
          {f(usdcValue * fetchedSolPrice)} USDC
        </p>
      </div>
    </div>
  );
};

export default CurrentBidCard;
