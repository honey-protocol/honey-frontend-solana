import { FC, useState } from 'react';
import * as styles from './BidsList.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';

type BidsListProps = {};

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const BidsList: FC<BidsListProps> = () => {
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();

  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };

  return (
    <div className={styles.bidsList}>
      <div className={styles.content}>Bids List</div>

      <div className={styles.footer}>
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary">Cancel</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={isSubmitButtonDisabled()}
              isFluid={true}
              usdcValue={valueUSD || 0}
              usdcAmount={valueUSDC || 0}
            >
              Place Bid
            </HoneyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidsList;
