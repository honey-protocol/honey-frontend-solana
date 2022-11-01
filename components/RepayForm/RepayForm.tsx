import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './RepayForm.css';
import { formatNumber } from '../../helpers/format';
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
import { LIQUIDATION_FEE } from 'constants/borrowLendMarkets';
import { HONEY_GENESIS_MARKET_ID, LIFINITY_FLARES_MARKET_ID, OG_ATADIANS_MARKET_ID, PESKY_PENGUINS_MARKET_ID, BURRITO_BOYZ_MARKET_ID  } from 'constants/loan';

const {
  format: f,
  formatPercent: fp,
  formatSol: fs,
  parse: p,
  formatRoundDown: frd
} = formatNumber;

const RepayForm = (props: RepayProps) => {
  const {
    executeRepay,
    openPositions,
    nftPrice,
    executeWithdrawNFT,
    userAllowance,
    userDebt,
    loanToValue,
    availableNFTs,
    fetchedSolPrice,
    currentMarketId,
    hideMobileSidebar,
    changeTab
  } = props;

  console.log('@@-- repay form:: sol price', fetchedSolPrice);

  const [valueUSD, setValueUSD] = useState<number>();
  const [valueSOL, setValueSOL] = useState<number>();
  const [sliderValue, setSliderValue] = useState(0);
  const { toast, ToastComponent } = useToast();

  const maxValue = userDebt != 0 ? userDebt : userAllowance;
  const solPrice = fetchedSolPrice;
  const liquidationThreshold = LIQUIDATION_FEE;
  const SOLBalance = useSolBalance();

  const newDebt = userDebt - (valueSOL ? valueSOL : 0);

  const borrowedValue = userDebt;

  // Put your validators here
  const isRepayButtonDisabled = () => {
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

  const onRepay = async (event: any) => {
    if (userDebt == 0 && openPositions[0]) {
      await executeWithdrawNFT(openPositions[0].mint, toast);
      if (changeTab) {
        changeTab('borrow');
      }
    } else {
      await executeRepay(valueSOL || 0, toast);
      handleSliderChange(0);
    }
  };

  useEffect(() => {}, [
    openPositions,
    userDebt,
    userAllowance,
    nftPrice,
    loanToValue,
    availableNFTs
  ]);

  const liquidationPrice = userDebt / liquidationThreshold;
  const newLiquidationPrice = newDebt / liquidationThreshold;

  const liqPercent = nftPrice
    ? ((nftPrice - liquidationPrice) / nftPrice) * 100
    : 0;
  const newLiqPercent = nftPrice
    ? ((nftPrice - newLiquidationPrice) / nftPrice) * 100
    : 0;

  const renderImage = (marketID: string) => {
    if (marketID == HONEY_GENESIS_MARKET_ID) {
      return <Image src='https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db' alt='Honey Genesis Bee NFT' layout="fill" />
    } else if (marketID == LIFINITY_FLARES_MARKET_ID) {
      return <Image src='https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8' alt='Lifinity Flares NFT' layout="fill" />
    } else if (marketID == OG_ATADIANS_MARKET_ID) {
      return <Image src='https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/atadians_pfp_1646721263627.gif' alt='OG Atadians NFT' layout="fill" />
    } else if (marketID == BURRITO_BOYZ_MARKET_ID) {
      return <Image src='https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/burrito_boyz_pfp_1653394754301.png' alt='Burrito Boyz NFT' layout="fill" />
    } else if (marketID == PESKY_PENGUINS_MARKET_ID) {
      return <Image src='https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png' alt='Pesky NFT' layout="fill" />
    }
  }

  return (
    <SidebarScroll
      footer={
        <>
          {toast?.state ? (
            <ToastComponent />
          ) : (
            <div className={styles.buttons}>
              <div className={styles.smallCol}>
                <HoneyButton variant="secondary" onClick={hideMobileSidebar}>
                  Cancel
                </HoneyButton>
              </div>
              <div className={styles.bigCol}>
                <HoneyButton
                  variant="primary"
                  solAmount={userDebt > 0 ? valueSOL || 0 : undefined}
                  usdcValue={userDebt > 0 ? valueUSD || 0 : undefined}
                  disabled={isRepayButtonDisabled()}
                  block
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
              {renderImage(currentMarketId)}
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
              toolTipLabel={
                <span>
                  The worth of your collateral according to the market’s oracle.
                  Learn more about this market’s{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href="https://switchboard.xyz/explorer"
                  >
                    Switchboard data-feed.
                  </a>
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fs(Number(frd(userAllowance)))}
              title={
                <span className={hAlign}>
                  Allowance <div className={questionIcon} />
                </span>
              }
              toolTipLabel={`Allowance determines how much debt is available to a borrower. This market supports no more than ${fp(
                60
              )}`}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fp(loanToValue * 100)}
              toolTipLabel={
                <span>
                  <a
                    className={styles.extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#loan-to-value-ratio"
                  >
                    Loan-to-value ratio{' '}
                  </a>
                  measures the ratio of the debt, compared to the value of the
                  collateral.
                </span>
              }
              title={
                <span className={hAlign}>
                  Loan-to-Value %
                  <div className={questionIcon} />
                </span>
              }
            />

            <HoneySlider
              currentValue={0}
              maxValue={nftPrice || 0}
              minAvailableValue={borrowedValue}
              maxSafePosition={0.3 - borrowedValue / 1000}
              dangerPosition={0.45 - borrowedValue / 1000}
              maxAvailablePosition={MAX_LTV}
              isReadonly
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New LTV %<div className={questionIcon} />
                </span>
              }
              value={fp((newDebt / (nftPrice || 0)) * 100)}
              isDisabled={userDebt == 0 ? true : false}
              toolTipLabel={
                <span>
                  New{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#loan-to-value-ratio"
                  >
                    Loan-to-value ratio{' '}
                  </a>
                  after the requested changes to the loan are approved.
                </span>
              }
            />

            <HoneySlider
              currentValue={0}
              maxValue={nftPrice || 0}
              minAvailableValue={newDebt}
              maxSafePosition={0.3 - borrowedValue / 1000}
              dangerPosition={0.45 - borrowedValue / 1000}
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
              toolTipLabel={
                <span>
                  Value borrowed from the lending pool, upon which interest
                  accrues.{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#debt"
                  >
                    Learn more.
                  </a>
                </span>
              }
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
              isDisabled={userDebt == 0 ? true : false}
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#debt"
                  >
                    debt{' '}
                  </a>
                  after the requested changes to the loan are approved.
                </span>
              }
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={`${fs(liquidationPrice)} ${
                userDebt ? `(-${liqPercent.toFixed(0)}%)` : ''
              }`}
              valueSize="normal"
              isDisabled={userDebt == 0 ? true : false}
              title={
                <span className={hAlign}>
                  Liquidation price <div className={questionIcon} />
                </span>
              }
              toolTipLabel={
                <span>
                  Price at which the position (NFT) will be liquidated.{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href=" " //TODO: add link to docs
                  >
                    Learn more.
                  </a>
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              isDisabled={userDebt == 0 ? true : false}
              title={
                <span className={hAlign}>
                  New Liquidation price <div className={questionIcon} />
                </span>
              }
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href=" " //TODO: add link to docs
                  >
                    liquidation Price
                  </a>{' '}
                  after the requested changes to the loan are approved.
                </span>
              }
              value={`${fs(newLiquidationPrice)} ${
                userDebt ? `(-${newLiqPercent?.toFixed(0)}%)` : ''
              }`}
              valueSize="normal"
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                title={'Your SOL balance'}
                value={fs(Number(frd(SOLBalance, 3)))}
              ></InfoBlock>
            </div>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                isDisabled={userDebt == 0 ? true : false}
                title={'NEW SOL balance'}
                value={fs(Number(frd(SOLBalance - (valueSOL || 0), 3)))}
              ></InfoBlock>
            </div>
          </div>
          <InputsBlock
            firstInputValue={valueSOL}
            secondInputValue={valueUSD}
            onChangeFirstInput={handleSolInputChange}
            onChangeSecondInput={handleUsdInputChange}
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
