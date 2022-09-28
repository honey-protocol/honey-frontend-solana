import { FC, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BidForm.css';
import { formatNumber } from '../../helpers/format';
import honeyEyes from '/public/nfts/honeyEyes.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyWarning from '../HoneyWarning/HoneyWarning';
import CurrentBid from '../CurrentBid/CurrentBid';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { BidFormProps } from './types';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const BidForm = (props: BidFormProps) => {
  const { userBalance, highestBiddingValue, currentUserBid, handleRevokeBid, handleIncreaseBid, handlePlaceBid } = props;
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueUSDC, setValueUSDC] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);

  const maxValue = 1000;
  const usdcPrice = 0.95;

  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setValueUSD(value / usdcPrice);
    setValueUSDC(value);
  };

  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue) {
      setValueUSD(0);
      setValueUSDC(0);
      setSliderValue(0);
      return;
    }
    setValueUSD(usdValue);
    setValueUSDC(usdValue / usdcPrice);
    setSliderValue(usdValue);
  };

  const handleUsdcInputChange = (usdcValue: number | undefined) => {
    if (!usdcValue) {
      setValueUSD(0);
      setValueUSDC(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(usdcValue * usdcPrice);
    setValueUSDC(usdcValue);
    setSliderValue(usdcValue * usdcPrice);
  };

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary" onClick={() => handleRevokeBid('revoke_bid')}>Cancel</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={isSubmitButtonDisabled()}
              isFluid={true}
              usdcValue={valueUSD || 0}
              usdcAmount={valueUSDC || 0}
              onClick={() => handlePlaceBid('place_bid', valueUSD)}
            >
              Place Bid
            </HoneyButton>
          </div>
        </div>
      }
    >
      <div className={styles.depositForm}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              <Image src={honeyEyes} />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>Honey Eyes</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message="We’re now live on Ethereum!"
              link="https://google.com"
            ></HoneyWarning>
          </div>
        </div>
        {
          currentUserBid &&
            <div className={styles.row}>
            <div className={styles.col}>
              <CurrentBid 
                value={currentUserBid} 
                title="Your bid is #1" 
                handleIncreaseBid={handleIncreaseBid}
                handleRevokeBid={handleRevokeBid}
              />
            </div>
          </div>
        }
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock value={fu(highestBiddingValue)} valueSize="big" title="Highest bid" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock title="Minimal bid" value={fu((highestBiddingValue * 1.1))} valueSize="big" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fu(userBalance)}
              valueSize="big"
              title="Your USDC balance"
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <InputsBlock
            valueUSD={p(f(valueUSD))}
            valueUSDC={p(f(valueUSDC))}
            onChangeUSD={handleUsdInputChange}
            onChangeUSDC={handleUsdcInputChange}
            maxValue={maxValue}
          />
        </div>

        <HoneySlider
          currentValue={sliderValue}
          maxValue={userBalance}
          minAvailableValue={0}
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default BidForm;
