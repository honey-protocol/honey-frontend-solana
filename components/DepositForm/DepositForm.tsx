import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './DepositForm.css';
import { formatNumber } from '../../helpers/format';
import honeyEyes from '/public/nfts/honeyEyes.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { DepositFormProps } from './types';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { questionIcon } from 'styles/icons.css';
import { hAlign } from 'styles/common.css';
import useToast from 'hooks/useToast';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const DepositForm = (props: DepositFormProps) => {
  const { executeDeposit, userTotalDeposits, value, available, userWalletBalance } = props;

  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueUSDC, setValueUSDC] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [userInteraction, setUserInteraction] = useState<boolean>(false);
  const { toast, ToastComponent } = useToast();

  const sdkConfig = ConfigureSDK();
  let walletPK = sdkConfig.sdkWallet?.publicKey;

  useEffect(() => {
    console.log('@@@_------user wallet balance', userWalletBalance)
  }, [userWalletBalance]);

  useEffect(() => {}, [userWalletBalance]);

  const maxValue = userWalletBalance;
  const usdcPrice = 0.95;

  // Put your validators here
  const isRepayButtonDisabled = () => {
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

  function handleDeposit() {
    executeDeposit(valueUSDC, toast);
    setTimeout(() => {}, 10000)
    userInteraction == false ? setUserInteraction(true) : setUserInteraction(false);
  }

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          ToastComponent
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="tertiary">Cancel</HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={isRepayButtonDisabled()}
                isFluid={true}
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
              <Image src={honeyEyes} />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>Honey Eyes</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fu(10)}
              valueSize="big"
              footer={<span>Total supplied</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fp(20)}
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
              value={fp((value - available) / value * 100)}
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

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock title={'Your deposits'} value={fu(userTotalDeposits)} />
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
          maxValue={maxValue}
          minAvailableValue={0}
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default DepositForm;
