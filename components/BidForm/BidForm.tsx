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
import { HONEY_GENESIS_MARKET_ID, PESKY_PENGUINS_MARKET_ID } from 'constants/loan';

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
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueSOL, setValueSOL] = useState<number>();
  // const [valueUSDC, setValueUSDC] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState();
  const { toast, ToastComponent } = useToast();

  const maxValue = 1000;

  // TODO: import SOL price via oracle
  const solPrice = fetchedSolPrice;
  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setValueUSD(value * solPrice);
    setValueSOL(value);
  };

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

  function triggerIndicator() {
    currentUserBid != 0
      ? handlePlaceBid('increase_bid', valueSOL, toast)
      : handleIncreaseBid('place_bid', valueSOL, toast);
  }

  useEffect(() => {
    console.log('@@--', currentUserBid);
  }, [currentUserBid]);

  const renderImage = (id: string) => {
    if (id == HONEY_GENESIS_MARKET_ID) {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db'} layout="fill" />
    } else if (id == PESKY_PENGUINS_MARKET_ID) {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png'} layout="fill" />
    } 
    // else if (id == OG_ATADIANS) {
    //   return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/atadians_pfp_1646721263627.gif'} layout="fill" />
    // } else {
    //   return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8'} layout="fill" />
    // }
  }

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
                isFluid={true}
                usdcValue={valueUSD || 0}
                solAmount={valueSOL || 0}
                onClick={triggerIndicator}
              >
                {currentUserBid != 0 ? 'Increase Bid' : 'Place Bid'}
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
              {renderImage(currentMarketId)}
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>Honey Genesis Bee</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message="Want to learn more about liquidations ?"
              link="https://docs.honey.finance/learn/liquidations"
            ></HoneyWarning>
          </div>
        </div>
        {currentUserBid && (
          <div className={styles.row}>
            <div className={styles.col}>
              <CurrentBid
                value={currentUserBid}
                title={
                  currentUserBid == highestBiddingValue
                    ? 'Your bid is #1'
                    : 'Your bid is:'
                }
                handleRevokeBid={() => handleRevokeBid('revoke_bid', toast)}
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
