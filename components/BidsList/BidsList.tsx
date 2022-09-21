import { FC, useState } from 'react';
import * as styles from './BidsList.css';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { CurrentBidCardProps } from '../CurrentBidCard/types';
import CurrentBidList from '../CurrentBidList/CurrentBidList';

type BidsListProps = {};

const BidsList: FC<BidsListProps> = () => {
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();

  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };

  const currentBidCardData: CurrentBidCardProps[] = [
    {
      id: '1',
      date: 1663663018156,
      walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      usdcValue: 100000,
      usdcAmount: 100000
    },
    {
      id: '2',
      date: 1663663018156,
      walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      usdcValue: 100000,
      usdcAmount: 100000
    },
    {
      id: '3',
      date: 1663663018156,
      walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      usdcValue: 100000,
      usdcAmount: 100000
    },
    {
      id: '4',
      date: 1663663018156,
      walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      usdcValue: 100000,
      usdcAmount: 100000
    }
  ];

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant='secondary'>Cancel</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant='primary'
              disabled={isSubmitButtonDisabled()}
              isFluid={true}
              usdcValue={valueUSD || 0}
              usdcAmount={valueUSDC || 0}
            >
              Place Bid
            </HoneyButton>
          </div>
        </div>
      }
    >
      <div className={styles.bidsList}>
        <CurrentBidList data={currentBidCardData} />
      </div>
    </SidebarScroll>
  );
};

export default BidsList;
