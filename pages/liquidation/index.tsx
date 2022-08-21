import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Stack, Text, Spinner } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';
import { PublicKey } from '@solana/web3.js';
import LiquidationCollectionCard from '../../components/LiquidationCollectionCard/LiquidationCollectionCard';
import { useAllPositions, useHoney } from '@honey-finance/sdk';
import  { ConfigureSDK, toastResponse } from '../../helpers/loanHelpers';
import { useConnectedWallet } from '@saberhq/use-solana';
/**
 * @description interface for NFT object
 * @params none
 * @returns typed object
*/
interface NftPosition {
  obligation: string;
  debt: number;
  nft_mint: PublicKey;
  owner: PublicKey;
  ltv: number;
  is_healthy: string;
  highest_bid: number;
}

const Liquidation: NextPage = () => {
  /**
   * @description sets program | market | connection | wallet
   * @params none
   * @returns connection with sdk
  */
  const sdkConfig = ConfigureSDK();
  
  /**
   * @description fetches open nft positions
   * @params connection | wallet | honeyprogramID | honeymarketID
   * @returns loading | nft positions | error
  */
  const { ...status } = useAllPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  
  /**
   * @description state for liquidation
   * @params none
   * @returns state variables
  */
  const [openPositions, setOpenPositions] = useState(false);
  const [fetchedPositions, setFetchedPositions] = useState<Array<NftPosition>>([]);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [totalMarketNFTs, setTotalMarketNFTs] = useState(0);
  const [averageMarketLVT, setaverageMarketLVT] = useState(0);
  const [initBidding, setInitBidding] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [activeState, setActiveState] = useState(false);
  
  /**
   * @description object which represents the market
   * @params none
   * @returns object which represents the market
  */
  const dataSet = [
    {
      collection: 'Honey Eyes',
      totalCollateral: totalMarketNFTs,
      totalDebt: totalMarketDebt.toFixed(2),
      averageLTV: averageMarketLVT,
    }
  ];

  /**
   * @description headerdata for market
   * @params none
   * @returns array of header data used for header component
  */
  const headerData = [ 'Collection', 'Total Collateral', 'Total Debt','Average LTV', ''];

  // create stringyfied instance of walletPK
  let stringyfiedWalletPK = sdkConfig.sdkWallet?.publicKey.toString();
  
  /**
   * @description sets the state if user has open bid 
   * @params array of bids
   * @returns state change
  */
  function handleBiddingState(biddingArray: any) { 
    let val = 0 
    
    if (stringyfiedWalletPK) {
      biddingArray.map((obligation: any, index: number) => {
        if (obligation.bidder == stringyfiedWalletPK) {
          setOpenPositions(true);
          val = 1;
        }
      });
    }

    if (val == 1) {
      toastResponse('LIQUIDATION', '1 oustanding bid', 'LIQUIDATION');
    } else {
      toastResponse('LIQUIDATION', 'No outstanding bid', 'LIQUIDATION');
    }
  }
  
  /**
   * @description update func. for nft positions
   * @params none
   * @returns sets state for nft positions
  */
  useEffect(() => {
    if (status.loading == false) {
      if (status.positions && status.positions.length) {
        setFetchedPositions(status.positions);
        setTotalMarketNFTs(status.positions.length);
      }

      if (initBidding == false && status.bids) {
        handleBiddingState(status.bids);
        setInitBidding(true);
      }
    }

    return;
  }, [status.positions]);

  /**
   * @description func. that calculates total market debt and average market ltv
   * @params market
   * @returns sets totalmarketdebt and averagemarketlvt state
  */
  async function calculateMarketValues(market: any) {
    if (market.length) {
      // total market debt
      let tmd = 0;
      // average market ltv
      let amltv = 0;

      await market.map((m: any) => {
        tmd += m.debt
        amltv += m.ltv
      });

      setTotalMarketDebt(tmd);
      setaverageMarketLVT(amltv / market.length);
    }
  }

  useEffect(() => {
    // if there are positions init the average calculations
    if (fetchedPositions) calculateMarketValues(fetchedPositions);
  }, [fetchedPositions]);

  function handleRefetch() {
    console.log('handle refetch running');
    if (status) {
      status.fetchPositions().then(() => {
        setLoadingState(false);
        console.log('updated statusObject', status);
      }).catch((err) => {
        console.log('the err:', err);
        setLoadingState(false);
      })
    }
  }

  useEffect(() => {
    let mounted = true;
    setLoadingState(true);
    setTimeout(() => {
      if (mounted) {
        handleRefetch();
      }
    }, 30000)

    return function cleanup() {
      mounted = false;
    }
  }, []);


  return (
    <Layout>
      <Stack>
        <Box>
          {
            loadingState && 

            <Box className={styles.headWrapperSub}>
              <Text color="textPrimary">Chain Data Being Fetched</Text>
              <Spinner />
            </Box>
          }
        </Box>
        <Box marginY="5" className={styles.liquidationWrapper}>
          <Text size="extraLarge" weight="semiBold">
            Market overview
          </Text>
          <Box
            marginTop="10"
            backgroundColor="background"
            padding="5"
            borderRadius="2xLarge"
          >
          <LiquidationHeader headerData={headerData} />
          <Box
            className={
            openPositions 
                ? styles.highLightPosition
                : styles.highLightNoPosition
            }
          >
            {dataSet.map((loan, i) => (
                <Link 
                  href="/liquidation/[collection]" 
                  as={`/liquidation/${loan.collection}`}
                  key={i}
                >
                  <a>
                    <LiquidationCollectionCard 
                      key={i}
                      loan={loan}
                      openPositions={openPositions}
                    />
                  </a>
                </Link>
            ))}
            </Box>
          </Box>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Liquidation;
