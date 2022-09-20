import { FC, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { Range } from '../Range/Range';
import * as styles from './RepayForm.css';
import { formatNumber } from '../../helpers/format';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import { RepayProps } from './types';
import HoneyToast, {
  HoneyToastProps,
  toastRemoveDelay
} from 'components/HoneyToast/HoneyToast';


const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const RepayForm = (props: RepayProps) => {
  const {executeRepay, openPositions, nftPrice, executeWithdrawNFT} = props;

  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [rangeValue, setRangeValue] = useState(0);
  const [toast, setToast] = useState<HoneyToastProps | null>(null);

  // Put your validators here
  const isRepayButtonDisabled = () => {
    return false;
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
    <div className={styles.repayForm}>
      <div className={styles.content}>
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
            <InfoBlock title={'Risk level'} value={fu(0)} />
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
              title={'Allowance'}
              value={fu(600)}
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
            valueUSD={valueUSD}
            valueUSDC={valueUSDC}
            onChangeUSD={setValueUSD}
            onChangeUSDC={setValueUSDC}
          />
        </div>

        <Range
          currentValue={rangeValue}
          maxValue={1000}
          borrowedValue={0}
          onChange={setRangeValue}
        />
      </div>

      <div className={styles.footer}>
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
      </div>
    </div>
  );
};

export default RepayForm;
