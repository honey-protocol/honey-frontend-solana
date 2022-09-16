import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './RepayForm.css';
import { formatNumber } from '../../helpers/format';
import honeyEyes from '/public/nfts/honeyEyes.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyToast, {
  HoneyToastProps,
  toastRemoveDelay
} from 'components/HoneyToast/HoneyToast';
import { RepayProps } from './types';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { isNil } from '../../helpers/utils';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const RepayForm = (props: RepayProps) => {
  const {
    executeRepay,
    openPositions,
    nftPrice,
    executeWithdrawNFT,
    userAllowance,
    userDebt,
    userUSDCBalance,
    loanToValue
  } = props;

  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [sliderValue, setSliderValue] = useState(0);
  const [toast, setToast] = useState<HoneyToastProps | null>(null);

  const maxValue = userDebt == 0 ? userDebt : userAllowance;
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

  const onRepay = async (event: any) => {
    const btnText = event.target.innerHTML;
    const mintId = new PublicKey(openPositions[0].mint).toString();
    console.log('this is mintId', mintId);

    try {
      setToast({
        state: 'loading',
        primaryText: 'Repay transaction in progress',
        secondaryLink: ''
      });

      // repay function here
      if (btnText == 'Claim NFT') {
        executeWithdrawNFT(mintId);
      } else {
        executeRepay(valueUSD || 0);
      }

      setToast({
        state: 'success',
        primaryText: 'Repay of 300USDC completed',
        secondaryLink:
          'https://solscan.io/token/GHtgbwy19UPRFDrAbWXrXf7WnqGxeNyAodX6rjKfsnrU?cluster=devnet'
      });
    } catch (error) {
      setToast({
        state: 'error',
        primaryText: 'Error Repaying 300USDC: Insufficient funds',
        secondaryLink:
          'https://solscan.io/token/GHtgbwy19UPRFDrAbWXrXf7WnqGxeNyAodX6rjKfsnrU?cluster=devnet'
      });
    } finally {
      setTimeout(() => {
        setToast(null);
      }, toastRemoveDelay);
    }
  };

  useEffect(() => {}, [
    openPositions,
    userDebt,
    userAllowance,
    nftPrice,
    loanToValue,
    userUSDCBalance
  ]);

  return (
    <SidebarScroll
      footer={
        <>
          {toast?.state ? (
            <HoneyToast
              state={toast.state}
              primaryText={toast.primaryText}
              secondaryLink={toast.secondaryLink}
            />
          ) : (
            <div className={styles.buttons}>
              <div className={styles.smallCol}>
                <HoneyButton variant="secondary">Cancel</HoneyButton>
              </div>
              <div className={styles.bigCol}>
                <HoneyButton
                  variant="primary"
                  usdcAmount={valueUSDC || 0}
                  usdcValue={valueUSD || 0}
                  disabled={isRepayButtonDisabled()}
                  isFluid={true}
                  onClick={onRepay}
                >
                  {userDebt > 0 ? 'Repay' : 'Claim NFT'}
                </HoneyButton>
              </div>
            </div>
          )}
        </>
      }
    >
      <div className={styles.repayForm}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              <Image src={honeyEyes} layout="fill" />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>{openPositions[0].name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fu(nftPrice)}
              valueSize="big"
              footer={<span>Estimated value</span>}
              toolTipLabel="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has "
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fp(75)}
              valueSize="big"
              footer={<span>Liquidation at</span>}
              toolTipLabel="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has "
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              title={'Risk level'}
              value={fu(loanToValue)}
              toolTipLabel="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has "
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={'New risk level'}
              value={fu(0)}
              isDisabled={true}
              toolTipLabel="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has "
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock title={'Debt'} value={fu(0)} />
          </div>
          <div className={styles.col}>
            <InfoBlock title={'New debt'} value={fu(0)} isDisabled={true} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              title={'Allowance'}
              value={fu(userAllowance)}
              footer={<>No more than {fp(60)}</>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock title={'New allowance'} value={fu(0)} />
          </div>
        </div>

        <div className={styles.inputs}>
          <div className={styles.balance}>
            <InfoBlock
              title={'Your USDC balance'}
              value={f(8120.19)}
            ></InfoBlock>
          </div>

          <InputsBlock
            valueUSD={p(f(valueUSD))}
            valueUSDC={p(f(valueUSDC))}
            onChangeUSD={handleUsdInputChange}
            onChangeUSDC={handleUsdcInputChange}
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

export default RepayForm;
