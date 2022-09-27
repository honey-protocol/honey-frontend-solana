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
import { RepayProps } from './types';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { PublicKey } from '@solana/web3.js';
import { isNil } from '../../helpers/utils';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import cs from 'classnames';
import useToast from 'hooks/useToast';
import { useSolBalance } from 'hooks/useSolBalance';
import { MAX_LTV } from 'constants/loan';

const { format: f, formatPercent: fp, formatSol: fs, parse: p } = formatNumber;

const RepayForm = (props: RepayProps) => {
  const {
    executeRepay,
    openPositions,
    nftPrice,
    executeWithdrawNFT,
    userAllowance,
    userDebt,
    userUSDCBalance,
    loanToValue,
    availableNFTs,
    hideMobileSidebar
  } = props;

  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [sliderValue, setSliderValue] = useState(0);
  const { toast, ToastComponent } = useToast();

  const maxValue = userDebt != 0 ? userDebt : userAllowance;
  const usdcPrice = 0.95;
  const liquidationThreshold = 0.75;
  const SOLBalance = useSolBalance();

  const newDebt = userDebt - (valueUSDC ? valueUSDC : 0);

  const borrowedValue = userDebt;

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

  const onRepay = async (event: any) => {
    const btnText = event.target.innerHTML;
    const mintId = new PublicKey(openPositions[0].mint).toString();
    // repay function here
    if (userDebt == 0 && openPositions[0]) {
      executeWithdrawNFT(openPositions[0].mint, toast);
    } else {
      executeRepay(valueUSDC || 0, toast);
    }
  };

  useEffect(() => {}, [
    openPositions,
    userDebt,
    userAllowance,
    nftPrice,
    loanToValue,
    userUSDCBalance,
    availableNFTs
  ]);

  return (
    <SidebarScroll
      footer={
        <>
          {toast?.state ? (
            <ToastComponent />
          ) : (
            <div className={styles.buttons}>
              <div className={styles.smallCol}>
                <HoneyButton variant="secondary" onClick={hideMobileSidebar}>Cancel</HoneyButton>
              </div>
              <div className={styles.bigCol}>
                <HoneyButton
                  variant="primary"
                  solAmount={valueUSDC || 0}
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
              <Image src={openPositions[0].image} layout="fill" />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>{openPositions[0].name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fs(nftPrice)}
              valueSize="big"
              title={
                <span className={hAlign}>
                  Estimated value <div className={questionIcon} />
                </span>
              }
              toolTipLabel="Placeholder text for tooltip" // TODO: CHANGE TO REAL INFO TEXT FOR EST VAL
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={f(userDebt / liquidationThreshold)}
              valueSize="big"
              isDisabled={userDebt == 0 ? true : false}
              title={
                <span className={hAlign}>
                  Liquidation price
                  <div className={questionIcon} />
                </span>
              }
              toolTipLabel="Placeholder text for tooltip" // TODO: CHANGE TO REAL INFO TEXT FOR liq price
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fp(loanToValue * 100)}
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
            <HoneySlider
              currentValue={0}
              maxValue={maxValue}
              minAvailableValue={borrowedValue}
              maxSafePosition={0.4 - borrowedValue / 1000}
              maxAvailablePosition={MAX_LTV}
              isReadonly
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New risk level
                  <div className={questionIcon} />
                </span>
              }
              value={fp((loanToValue + newDebt / (nftPrice || 0)) * 100)}
              isDisabled={true}
              toolTipLabel="Placeholder text for tooltip" // TODO: CHANGE TO REAL INFO TEXT FOR liq price
            />
            <HoneySlider
              currentValue={sliderValue}
              maxValue={maxValue}
              minAvailableValue={borrowedValue}
              maxSafePosition={0.4 - borrowedValue / 1000}
              maxAvailablePosition={MAX_LTV}
              isReadonly
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  Debt
                  <div className={questionIcon} />
                </span>
              }
              value={fs(userDebt)}
              toolTipLabel="Placeholder text for tooltip" // TODO: CHANGE TO REAL INFO TEXT FOR liq price
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New debt
                  <div className={questionIcon} />
                </span>
              }
              value={fs(newDebt < 0 ? 0 : newDebt)}
              isDisabled={true}
              toolTipLabel="Placeholder text for tooltip" // TODO: CHANGE TO REAL INFO TEXT FOR liq price
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fs(userAllowance)}
              title={
                <span className={hAlign}>
                  Allowance <div className={questionIcon} />
                </span>
              }
              toolTipLabel={`Allowance determines how much debt is available to a borrower. No more than ${fp(
                60
              )}`}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New allowance
                  <div className={questionIcon} />
                </span>
              }
              value={fs(userAllowance + 0.9 * (valueUSDC ?? 0))}
              toolTipLabel="Placeholder text for tooltip" // TODO: CHANGE TO REAL INFO TEXT FOR liq price
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                title={'Your SOL balance'}
                value={f(SOLBalance)}
              ></InfoBlock>
            </div>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                title={'NEW SOL balance'}
                value={f(SOLBalance - (valueUSDC || 0))}
              ></InfoBlock>
            </div>
          </div>
          <InputsBlock
            valueUSD={p(f(valueUSD))}
            valueSOL={p(f(valueUSDC))}
            onChangeUSD={handleUsdInputChange}
            onChangeSOL={handleUsdcInputChange}
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
