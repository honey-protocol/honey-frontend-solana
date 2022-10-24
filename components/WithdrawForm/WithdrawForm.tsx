import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './WithdrawForm.css';
import { formatNumber } from '../../helpers/format';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import { HONEY_GENESIS_MARKET_ID, PESKY_PENGUINS_MARKET_ID} from '../../constants/loan';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { WithdrawFormProps } from './types';
import { questionIcon } from 'styles/icons.css';
import { hAlign } from 'styles/common.css';
import useToast from 'hooks/useToast';

const { format: f, formatPercent: fp, formatSol: fs, parse: p } = formatNumber;

const WithdrawForm = (props: WithdrawFormProps) => {
  const {
    executeWithdraw,
    userTotalDeposits,
    value,
    available,
    fetchedSolPrice,
    marketImage,
    currentMarketId,
  } = props;
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueSOL, setValueSOL] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const { toast, ToastComponent } = useToast();

  const maxValue = userTotalDeposits;
  const solPrice = fetchedSolPrice;

  // Put your validators here
  const isWithdrawButtonDisabled = () => {
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

    console.log('p(f(usdValue))', p(f(usdValue)));

    setValueUSD(usdValue);
    setValueSOL(usdValue / solPrice);
    setSliderValue(usdValue);
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
    setSliderValue(solValue * solPrice);
  };

  const handleWithdraw = async () => {
    await executeWithdraw(valueSOL, toast);
    handleSliderChange(0);
  };

  useEffect(() => {
    console.log('running user total deposits');
  }, [userTotalDeposits]);

  return (
    <SidebarScroll
      footer={
        toast?.state ? (
          <ToastComponent />
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="tertiary">Cancel</HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={isWithdrawButtonDisabled()}
                isFluid={true}
                onClick={handleWithdraw}
              >
                Withdraw
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.withdrawForm}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              {marketImage}
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>
            {currentMarketId == HONEY_GENESIS_MARKET_ID ? 'Honey Genesis Bee' : 'Pesky Penguins'}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fs(userTotalDeposits)}
              valueSize="big"
              footer={<span>Your Deposits</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fp()}
              valueSize="big"
              toolTipLabel="APY is measured by compounding the weekly interest rate"
              footer={
                <span className={hAlign}>
                  Estimated APY <div className={questionIcon} />
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fp(((value - available) / value) * 100)}
              valueSize="big"
              toolTipLabel=" Amount of supplied liquidity currently being borrowed"
              footer={
                <span className={hAlign}>
                  Utilization rate <div className={questionIcon} />
                </span>
              }
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <InputsBlock
            firstInputValue={p(f(valueUSD))}
            secondInputValue={p(f(valueSOL))}
            onChangeFirstInput={handleUsdInputChange}
            onChangeSecondInput={handleSolInputChange}
            maxValue={maxValue}
          />
        </div>

        <HoneySlider
          currentValue={sliderValue}
          maxValue={maxValue}
          minAvailableValue={0}
          // maxSafePosition={0.4}
          // maxAvailablePosition={maxValue} // TODO: should be capped by available liquidity
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default WithdrawForm;
