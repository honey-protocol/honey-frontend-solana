import React, { useState, useEffect } from 'react';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './WithdrawForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { WithdrawFormProps } from './types';
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

const { format: f, formatPercent: fp, formatSol: fs, parse: p } = formatNumber;

const WithdrawForm = (props: WithdrawFormProps) => {
  const {
    executeWithdraw,
    userTotalDeposits,
    value,
    available,
    fetchedReservePrice,
    marketImage,
    currentMarketId,
    onCancel,
    activeInterestRate,
    isFetchingData
  } = props;
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueUnderlying, setValueUnderlying] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const { toast, ToastComponent } = useToast();

  const selectedMarket = marketCollections.find(
    collection => collection.id === currentMarketId
  );

  const maxValue = userTotalDeposits;
  const reservePrice = fetchedReservePrice;

  // Put your validators here
  const isWithdrawButtonDisabled = () => {
    if (isFetchingData) return true;
    return false;
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setValueUSD(value * reservePrice);
    setValueUnderlying(value);
  };

  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue) {
      setValueUSD(0);
      setValueUnderlying(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(usdValue);
    setValueUnderlying(usdValue / reservePrice);
    setSliderValue(usdValue / reservePrice);
  };

  const handleTokenInputChange = (tokenValue: number | undefined) => {
    if (!tokenValue) {
      setValueUSD(0);
      setValueUnderlying(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(tokenValue * reservePrice);
    setValueUnderlying(tokenValue);
    setSliderValue(tokenValue);
  };

  const handleWithdraw = async () => {
    executeWithdraw(valueUnderlying, toast);
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
                disabled={isWithdrawButtonDisabled()}
                block
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
              {renderMarketImageByID(currentMarketId)}
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>
            {renderMarketName(currentMarketId)}
          </div>
        </div>
        <div className={styles.row}>
          <HoneyWarning
            message="To learn more about the risks of lending, make sure to explore our Protocol Risk documentation"
            link="https://docs.honey.finance/lending-protocol/risk/protocol-risks"
          />
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fp(((value - available) / value) * 100)
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
                  Interest rate Estimated{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
            />
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
        </div>

        <div className={styles.inputs}>
          <InputsBlock
            firstInputValue={valueUnderlying}
            secondInputValue={valueUSD}
            onChangeFirstInput={handleTokenInputChange}
            onChangeSecondInput={handleUsdInputChange}
            maxValue={maxValue}
            firstInputAddon={selectedMarket?.constants.marketLoanCurrency}
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
