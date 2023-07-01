import { useEffect, useState } from 'react';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BidForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyWarning from '../HoneyWarning/HoneyWarning';
import CurrentBid from '../CurrentBid/CurrentBid';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { BidFormProps } from './types';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import {
  marketCollections,
  renderMarketImageByID,
  renderMarketName
} from 'helpers/marketHelpers';
import QuestionIcon from 'icons/QuestionIcon';
import { Skeleton } from 'antd';

const {
  format: f,
  formatPercent: fp,
  formatUsd: fu,
  formatSol: fs,
  parse: p,
  formatRoundDown: frd
} = formatNumber;

const BidForm = (props: BidFormProps) => {
  const {
    userBalance,
    highestBiddingValue,
    currentUserBid,
    fetchedReservePrice,
    currentMarketId,
    highestBiddingAddress,
    stringyfiedWalletPK,
    handleRevokeBid,
    handleIncreaseBid,
    handlePlaceBid,
    onCancel,
    isFetchingData,
    isLoadingWalletBalance
  } = props;
  // state declarations
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueUnderlying, setValueUnderlying] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [userBidValue, setUserBidValue] = useState(0);
  // import toast for responses
  const { toast, ToastComponent } = useToast();
  // set constants
  const maxValue = 1000;
  const marketTokenPrice = fetchedReservePrice;
  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };

  const selectedMarket = marketCollections.find(
    collection => collection.id === currentMarketId
  );

  const [currencyOfMarket, setCurrencyOfMarket] = useState<string>();

  useEffect(() => {
    if (currencyOfMarket !== selectedMarket?.loanCurrency) {
      setCurrencyOfMarket(selectedMarket?.loanCurrency);
      setUserBidValue(0);
    }
  }, [selectedMarket]);

  // change of input - render calculated values
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setValueUSD(value * marketTokenPrice);
    setValueUnderlying(value);
  };
  // change of input - render calculated values
  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue) {
      setValueUSD(0);
      setValueUnderlying(0);
      setSliderValue(0);
      return;
    }
    setValueUSD(usdValue);
    setValueUnderlying(usdValue / marketTokenPrice);
    setSliderValue(usdValue / marketTokenPrice);
  };
  // change of input - render calculated values
  const handleSolInputChange = (solValue: number | undefined) => {
    if (!solValue) {
      setValueUSD(0);
      setValueUnderlying(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(solValue * marketTokenPrice);
    setValueUnderlying(solValue);
    setSliderValue(solValue);
  };
  // function for content render increase of place bid
  function triggerIndicator() {
    userBidValue != 0
      ? handlePlaceBid('increase_bid', valueUnderlying, toast, currentMarketId)
      : handleIncreaseBid('place_bid', valueUnderlying, toast, currentMarketId);
  }
  // render logic for current user bid
  useEffect(() => {
    if (currentUserBid) {
      setUserBidValue(currentUserBid);
    } else {
      setUserBidValue(0);
    }
  }, [currentUserBid]);

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          ToastComponent
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="secondary" onClick={() => onCancel()}>
                Cancel
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={isSubmitButtonDisabled()}
                block
                usdcValue={valueUSD || 0}
                tokenAmount={valueUnderlying || 0}
                tokenName={selectedMarket?.loanCurrency}
                onClick={triggerIndicator}
              >
                {userBidValue != 0 ? 'Increase Bid' : 'Place Bid'}
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.depositForm}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              {renderMarketImageByID(currentMarketId)}
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>
            {renderMarketName(currentMarketId)}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message="Want to learn more about liquidations ?"
              link="https://docs.honey.finance/learn/liquidations"
            ></HoneyWarning>
          </div>
        </div>
        {userBidValue !== 0 && (
          <div className={styles.row}>
            <div className={styles.col}>
              <CurrentBid
                value={
                  highestBiddingAddress === stringyfiedWalletPK
                    ? highestBiddingValue
                    : userBidValue
                }
                title={
                  highestBiddingAddress === stringyfiedWalletPK
                    ? 'Your bid is #1'
                    : 'Your bid is:'
                }
                handleRevokeBid={() =>
                  handleRevokeBid('revoke_bid', toast, currentMarketId)
                }
              />
            </div>
          </div>
        )}
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : highestBiddingValue !== 0 ? (
                  fs(highestBiddingValue)
                ) : (
                  'No open bids'
                )
              }
              valueSize="big"
              title={
                <span className={hAlign}>
                  Highest bid{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
            />
          </div>
          {/* <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  Minimal bid <div className={questionIcon} />
                </span>
              }
              value={fs(highestBiddingValue * 1.1)}
              valueSize="big"
            />
          </div> */}
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                isLoadingWalletBalance ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fs(userBalance)
                )
              }
              valueSize="big"
              title={`Your ${selectedMarket?.constants.marketLoanCurrency} balance`}
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <InputsBlock
            firstInputValue={valueUnderlying}
            secondInputValue={valueUSD}
            onChangeFirstInput={handleSolInputChange}
            onChangeSecondInput={handleUsdInputChange}
            maxValue={maxValue}
            firstInputAddon={selectedMarket?.loanCurrency}
          />
        </div>

        <HoneySlider
          currentValue={sliderValue}
          maxValue={Number(frd(userBalance))}
          minAvailableValue={0}
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default BidForm;
