import { FC, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './WithdrawForm.css';
import { formatNumber } from '../../helpers/format';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import { MAX_LTV } from '../../constants/loan';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { WithdrawFormProps } from './types';
import { questionIcon } from 'styles/icons.css';
import { hAlign } from 'styles/common.css';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const WithdrawForm = (props: WithdrawFormProps) => {
  const { executeWithdraw } = props;
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [sliderValue, setSliderValue] = useState(0);

  const maxValue = 1000;
  const usdcPrice = 0.95;

  // Put your validators here
  const isRepayButtonDisabled = () => {
    return false;
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setValueUSD(value);
    setValueUSDC(value / usdcPrice);
  };

  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue) {
      setValueUSD(0);
      setValueUSDC(0);
      setSliderValue(0);
      return;
    }

    console.log('p(f(usdValue))', p(f(usdValue)));

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
            <HoneyButton variant="tertiary">Cancel</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={isRepayButtonDisabled()}
              isFluid={true}
            >
              Withdraw
            </HoneyButton>
          </div>
        </div>
      }
    >
      <div className={styles.withdrawForm}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              <Image src={mockNftImage} />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>Doodles</div>
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
                  Estimated APR <div className={questionIcon} />
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fp(80)}
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
            <InfoBlock title={'Your deposits'} value={fu(2102)} />
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
          maxSafePosition={0.4}
          maxAvailablePosition={MAX_LTV}
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default WithdrawForm;
