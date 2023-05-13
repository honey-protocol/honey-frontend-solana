import React, { FC, useState, useEffect } from 'react';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './DepositForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { DepositFormProps } from './types';
import { questionIcon } from 'styles/icons.css';
import { hAlign, textUnderline } from 'styles/common.css';
import useToast from 'hooks/useToast';
import {
  marketCollections,
  renderMarketImageByID,
  renderMarketName
} from 'helpers/marketHelpers';
import QuestionIcon from 'icons/QuestionIcon';
import { Skeleton } from 'antd';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';

const {
  format: f,
  formatPercent: fp,
  formatSol: fs,
  parse: p,
  formatRoundDown: frd,
  formatShortName: fsn
} = formatNumber;

const DepositForm = (props: DepositFormProps) => {
  const {
    executeDeposit,
    userTotalDeposits,
    value,
    available,
    userWalletBalance,
    fetchedReservePrice,
    marketImage,
    currentMarketId,
    onCancel,
    activeInterestRate,
    isFetchingData
  } = props;
  // state declarations
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueUnderyling, setValueUnderyling] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [utilizationRate, setUtilizationRate] = useState(0);

  const selectedMarket = marketCollections.find(
    collection => collection.id === currentMarketId
  );

  // imports toast for responses
  const { toast, ToastComponent } = useToast();
  // sets utilization rate
  useEffect(() => {
    if (value && available) {
      setUtilizationRate(Number(f(((value - available) / value) * 100)));
    }
  }, [value, available]);
  // constants
  const maxValue = userWalletBalance;
  const underlyingTokenPrice = fetchedReservePrice;

  // Put your validators here
  const isDepositButtonDisabled = () => {
    if (isFetchingData) return true;
    return false;
  };
  // change of input - render calculated values
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setValueUSD(value * underlyingTokenPrice);
    setValueUnderyling(value);
  };
  // change of input - render calculated values
  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue) {
      setValueUSD(0);
      setValueUnderyling(0);
      setSliderValue(0);
      return;
    }
    setValueUSD(usdValue);
    setValueUnderyling(usdValue / underlyingTokenPrice);
    setSliderValue(usdValue / underlyingTokenPrice);
  };
  // change of input - render calculated values
  const handleTokenInputChange = (tokenValue: number | undefined) => {
    if (!tokenValue) {
      setValueUSD(0);
      setValueUnderyling(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(tokenValue * underlyingTokenPrice);
    setValueUnderyling(tokenValue);
    setSliderValue(tokenValue);
  };
  // executes deposit
  const handleDeposit = async () => {
    executeDeposit(valueUnderyling, toast);
    handleSliderChange(0);
  };

  return (
    <SidebarScroll
      footer={
        toast?.state ? (
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
                disabled={isDepositButtonDisabled()}
                block
                onClick={handleDeposit}
              >
                Deposit
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
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fs(userTotalDeposits)
                )
              }
              valueSize="big"
              footer={<span>Your Deposits</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fp(activeInterestRate)
                )
              }
              valueSize="big"
              toolTipLabel="Variable interest rate, based on Utilization rate."
              footer={
                <span className={hAlign}>
                  Interest rate{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fp(utilizationRate)
                )
              }
              valueSize="big"
              toolTipLabel=" Amount of supplied liquidity currently being borrowed"
              footer={
                <span className={hAlign}>
                  Utilization rate{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
            />
          </div>
        </div>
        <div className={styles.inputs}>
          <InputsBlock
            firstInputValue={valueUnderyling}
            secondInputValue={valueUSD}
            onChangeFirstInput={handleTokenInputChange}
            onChangeSecondInput={handleUsdInputChange}
            maxValue={maxValue}
            firstInputAddon={selectedMarket?.constants.marketLoanCurrency}
          />
        </div>
        <HoneySlider
          currentValue={sliderValue}
          maxValue={Number(frd(maxValue))}
          minAvailableValue={0}
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default DepositForm;
