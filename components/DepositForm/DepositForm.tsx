import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './DepositForm.css';
import { formatNumber } from '../../helpers/format';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { DepositFormProps } from './types';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { questionIcon } from 'styles/icons.css';
import { hAlign } from 'styles/common.css';
import useToast from 'hooks/useToast';

const {
  format: f,
  formatPercent: fp,
  formatSol: fs,
  parse: p,
  formatRoundDown: frd
} = formatNumber;

const DepositForm = (props: DepositFormProps) => {
  const {
    executeDeposit,
    userTotalDeposits,
    value,
    available,
    userWalletBalance,
    fetchedSolPrice,
    onCancel
  } = props;

  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueSOL, setValueSOL] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [userInteraction, setUserInteraction] = useState<boolean>(false);
  const [utilizationRate, setUtilizationRate] = useState(0);

  const { toast, ToastComponent } = useToast();

  const sdkConfig = ConfigureSDK();
  let walletPK = sdkConfig.sdkWallet?.publicKey;

  useEffect(() => {}, [userWalletBalance]);

  useEffect(() => {
    if (value && available) {
      setUtilizationRate(Number(f(((value - available) / value) * 100)));
    }
  }, [value, available]);

  const maxValue = userWalletBalance;
  const solPrice = fetchedSolPrice;

  // Put your validators here
  const isDepositButtonDisabled = () => {
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

  const handleDeposit = async () => {
    await executeDeposit(valueSOL, toast);
    handleSliderChange(0);
  };

  return (
    <SidebarScroll
      footer={
        toast?.state ? (
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
                disabled={isDepositButtonDisabled()}
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
              <Image src={honeyGenesisBee} />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>Honey Genesis Bee</div>
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
              value={fp(utilizationRate)}
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
            firstInputValue={valueSOL}
            secondInputValue={valueUSD}
            onChangeFirstInput={handleSolInputChange}
            onChangeSecondInput={handleUsdInputChange}
            maxValue={maxValue}
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
