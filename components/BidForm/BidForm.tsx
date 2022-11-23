import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BidForm.css';
import { formatNumber } from '../../helpers/format';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyWarning from '../HoneyWarning/HoneyWarning';
import CurrentBid from '../CurrentBid/CurrentBid';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { BidFormProps } from './types';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import { HONEY_GENESIS_MARKET_ID, PESKY_PENGUINS_MARKET_ID, LIFINITY_FLARES_MARKET_ID, BURRITO_BOYZ_MARKET_ID, OG_ATADIANS_MARKET_ID } from 'constants/loan';
import { renderMarketImageByID, renderMarketImageByName, renderMarketName } from 'helpers/marketHelpers';

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
    fetchedSolPrice,
    currentMarketId,
    handleRevokeBid,
    handleIncreaseBid,
    handlePlaceBid,
    onCancel
  } = props;
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueSOL, setValueSOL] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [userBidValue, setUserBidValue] = useState(0);

  const { toast, ToastComponent } = useToast();

  const maxValue = 1000;
  const solPrice = fetchedSolPrice;
  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };
  // change of input - render calculated values
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setValueUSD(value * solPrice);
    setValueSOL(value);
  };
  // change of input - render calculated values
  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue) {
      setValueUSD(0);
      setValueSOL(0);
      setSliderValue(0);
      return;
    }
    setValueUSD(usdValue);
    setValueSOL(usdValue / solPrice);
    setSliderValue(usdValue / solPrice);
  };
  // change of input - render calculated values
  const handleSolInputChange = (solValue: number | undefined) => {
    if (!solValue) {
      setValueUSD(0);
      setValueSOL(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(solValue * solPrice);
    setValueSOL(solValue);
    setSliderValue(solValue);
  };
  // function for content render increase of place bid
  function triggerIndicator() {
    userBidValue != 0
      ? handlePlaceBid('increase_bid', valueSOL, toast, currentMarketId)
      : handleIncreaseBid('place_bid', valueSOL, toast, currentMarketId);
  }
  // render logic for current user bid
  useEffect(() => {
    if (currentUserBid) {
      setUserBidValue(currentUserBid)
    } else {
      setUserBidValue(0);
    }
  }, [currentUserBid]);

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
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
                solAmount={valueSOL || 0}
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
        {userBidValue && (
          <div className={styles.row}>
            <div className={styles.col}>
              <CurrentBid
                value={userBidValue}
                title={
                  userBidValue == highestBiddingValue
                    ? 'Your bid is #1'
                    : 'Your bid is:'
                }
                handleRevokeBid={() => handleRevokeBid('revoke_bid', toast, currentMarketId)}
              />
            </div>
          </div>
        )}
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fs(highestBiddingValue)}
              valueSize="big"
              title={
                <span className={hAlign}>
                  Highest bid <div className={questionIcon} />
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
              value={fs(userBalance)}
              valueSize="big"
              title="Your SOL balance"
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <InputsBlock
            firstInputValue={valueSOL}
            secondInputValue={valueUSD}
            onChangeFirstInput={handleSolInputChange}
            onChangeSecondInput={handleUsdInputChange}
            maxValue={maxValue}
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
