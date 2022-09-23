import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './RepayForm.css';
import { formatNumber } from '../../helpers/format';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyToast, {
  HoneyToastProps,
  toastRemoveDelay
} from 'components/HoneyToast/HoneyToast';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { isNil } from '../../helpers/utils';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import cs from 'classnames';

type RepayFormProps = {};

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const RepayForm: FC<RepayFormProps> = () => {
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [sliderValue, setSliderValue] = useState(0);
  const [toast, setToast] = useState<HoneyToastProps | null>(null);

  const maxValueMock = 1000;
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

  const onRepay = async () => {
    try {
      setToast({
        state: 'loading',
        primaryText: 'Repay transaction in progress',
        secondaryLink: ''
      });

      // repay function here

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
                  Repay
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
              <Image src={mockNftImage} />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>Doodles #1291</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fu(1000)}
              valueSize="big"
              footer={<span>Estimated value</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fp(75)}
              valueSize="big"
              footer={<span>Liquidation at</span>}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fu(0)}
              toolTipLabel={
                <span>
                  Risk level is measured using the{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#loan-to-value-ratio"
                  >
                    loan-to-value ratio
                  </a>
                  , and determines how close a position is to being liquidated.
                </span>
              }
              title={
                <span className={hAlign}>
                  Risk level <div className={questionIcon} />
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={'New risk level'}
              value={fu(0)}
              isDisabled={true}
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
              title={
                <span className={hAlign}>
                  Allowance <div className={questionIcon} />
                </span>
              }
              value={fu(600)}
              footer={<span>No more than {fp(60)}</span>}
              toolTipLabel="Allowance determines how much debt is available to a borrower."
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
            valueUSD={valueUSD}
            valueUSDC={valueUSDC}
            onChangeUSD={handleUsdInputChange}
            onChangeUSDC={handleUsdcInputChange}
          />
        </div>

        <HoneySlider
          currentValue={sliderValue}
          maxValue={maxValueMock}
          minAvailableValue={0}
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default RepayForm;
