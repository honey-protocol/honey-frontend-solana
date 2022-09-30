import { FC, useEffect, useState } from 'react';
import * as styles from './BidsList.css';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { CurrentBidCardProps } from '../CurrentBidCard/types';
import CurrentBidList from '../CurrentBidList/CurrentBidList';
import { BidListProps } from './types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const BidsList = (props: BidListProps) => {
  const { biddingArray } = props;
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [valueSOL, setValueSOL] = useState<number>(0);
  const [convertedBiddingArray, setConvertedBiddingArray] = useState([]);

  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };

  async function handleConvertion(bArray: any) {
    let converted = await bArray.map((bid: any, index: number) => {
      console.log('@@@@@@', bid);
      return {
        id: index,
        date: 1663663018156,
        walletAddress: bid.bidder,
        usdcValue: bid.bidLimit / LAMPORTS_PER_SOL,
        solAmount: bid.bidLimit / LAMPORTS_PER_SOL
      };
    });

    setConvertedBiddingArray(converted);
  }

  useEffect(() => {
    if (biddingArray.length) handleConvertion(biddingArray);
  }, [biddingArray]);

  const currentBidCardData: CurrentBidCardProps[] = convertedBiddingArray;

  return (
    <SidebarScroll>
      <div className={styles.bidsList}>
        <CurrentBidList data={currentBidCardData} />
      </div>
    </SidebarScroll>
  );
};

export default BidsList;
