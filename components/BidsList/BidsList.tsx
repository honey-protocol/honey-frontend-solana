import { useEffect, useState } from 'react';
import * as styles from './BidsList.css';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { CurrentBidCardProps } from '../CurrentBidCard/types';
import CurrentBidList from '../CurrentBidList/CurrentBidList';
import { BidListProps } from './types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Spin } from 'antd';
import { marketsTokens } from 'helpers/marketHelpers';
import { spinner } from 'styles/common.css';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';

const BidsList = (props: BidListProps) => {
  const { biddingArray, fetchedReservePrice, isFetchingData } = props;
  const [convertedBiddingArray, setConvertedBiddingArray] = useState([]);

  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };
  // function that handles the conversion for the bidding array
  async function handleConvertion(bArray: any) {
    let converted = await bArray.map((bid: any, index: number) => {
      return {
        id: index,
        date: 1663663018156,
        walletAddress: bid.bidder,
        usdcValue: bid.bidLimit / marketsTokens.USDC.decimals,
        solAmount: bid.bidLimit / marketsTokens.SOL.decimals
      };
    });

    setConvertedBiddingArray(converted);
  }
  // set bidding array to either bidding array or empty array
  useEffect(() => {
    if (biddingArray.length) {
      handleConvertion(biddingArray);
    } else {
      handleConvertion([]);
    }
  }, [biddingArray]);
  // set bidCardData equal to current bidding array
  const currentBidCardData: CurrentBidCardProps[] = convertedBiddingArray;

  return (
    <SidebarScroll>
      {isFetchingData ? (
        <EmptyStateDetails
          icon={
            <div className={spinner}>
              <Spin />
            </div>
          }
          title=""
          description=""
        />
      ) : (
        <div className={styles.bidsList}>
          {currentBidCardData.length ? (
            <CurrentBidList
              data={currentBidCardData}
              fetchedReservePrice={fetchedReservePrice}
            />
          ) : (
            'No open bids'
          )}
        </div>
      )}
    </SidebarScroll>
  );
};

export default BidsList;
