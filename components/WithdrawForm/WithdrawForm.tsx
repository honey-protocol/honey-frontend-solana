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
import { hAlign } from 'styles/common.css';
import useToast from 'hooks/useToast';
import { renderMarketImageByID, renderMarketName } from 'helpers/marketHelpers';
import QuestionIcon from 'icons/QuestionIcon';

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
    onCancel
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

  const handleWithdraw = async () => {
    executeWithdraw(valueSOL, toast);
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
                  Estimated APY{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
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
            firstInputValue={valueSOL}
            secondInputValue={valueUSD}
            onChangeFirstInput={handleSolInputChange}
            onChangeSecondInput={handleUsdInputChange}
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
