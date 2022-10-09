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
import {
  calcNFT,
  getInterestRate,
  fetchSolPrice
} from 'helpers/loanHelpers/userCollection';

const { format: f, formatPercent: fp, formatSol: fs, parse: p } = formatNumber;

const DepositForm = (props: DepositFormProps) => {
  const {
    executeDeposit,
    userTotalDeposits,
    value,
    available,
    userWalletBalance,
    fetchedSolPrice
  } = props;

  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueSOL, setValueSOL] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [userInteraction, setUserInteraction] = useState<boolean>(false);
  const [utilizationRate, setUtilizationRate] = useState(0);
  const [calculatedInterestRate, setCalculatedInterestRate] =
    useState<number>(0);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [totalMarketDeposits, setTotalMarketDeposits] = useState(0);

  const { toast, ToastComponent } = useToast();

  const sdkConfig = ConfigureSDK();
  let walletPK = sdkConfig.sdkWallet?.publicKey;

  useEffect(() => {}, [userWalletBalance]);

  useEffect(() => {
    if (totalMarketDeposits && totalMarketDebt && totalMarketDeposits) {
      setUtilizationRate(
        Number(
          f(
            (totalMarketDeposits + totalMarketDebt - totalMarketDeposits) /
              (totalMarketDeposits + totalMarketDebt)
          )
        )
      );
    }
  }, [totalMarketDeposits, totalMarketDebt, totalMarketDeposits]);

  async function calculateInterestRate(utilizationRate: number) {
    let interestRate = await getInterestRate(utilizationRate);
    if (interestRate) setCalculatedInterestRate(interestRate * utilizationRate);
  }

  useEffect(() => {
    console.log('Runnig');
    if (utilizationRate) {
      calculateInterestRate(utilizationRate);
    }
  }, [utilizationRate]);

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
              <HoneyButton variant="tertiary">Cancel</HoneyButton>
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
              value={fp(((1 + calculatedInterestRate / 100 / 52) ^ 52) - 1)}
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
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default DepositForm;
