import { useEffect, useState } from 'react';
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
import { hAlign, extLink } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import cs from 'classnames';
import useToast from 'hooks/useToast';
import { useSolBalance, useTokenBalance } from 'hooks/useSolBalance';
import { MAX_LTV } from 'constants/loan';
import { COLLATERAL_FACTOR, marketCollections } from 'helpers/marketHelpers';
import { renderMarketImageByID } from 'helpers/marketHelpers';
import QuestionIcon from 'icons/QuestionIcon';
import { Skeleton, Space } from 'antd';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { useMarket } from '@honey-finance/sdk';
import { PublicKey } from '@solana/web3.js';

const {
  format: f,
  formatPercent: fp,
  formatSol: fs,
  parse: p,
  formatRoundDown: frd,
  formatShortName: fsn
} = formatNumber;

const RepayForm = (props: RepayProps) => {
  // extract props
  const {
    executeRepay,
    openPositions,
    nftPrice,
    executeWithdrawNFT,
    userAllowance,
    userDebt,
    loanToValue,
    fetchedReservePrice,
    currentMarketId,
    hideMobileSidebar,
    changeTab,
    isFetchingData,
    collCount
  } = props;
  // state
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUnderlying, setValueUnderlying] = useState<number>();
  // const [collateralCount, setCollateralCount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const { toast, ToastComponent } = useToast();
  // constants && calculations
  const marketTokenPrice = fetchedReservePrice;
  const liquidationThreshold = COLLATERAL_FACTOR;
  const newDebt = userDebt - (valueUnderlying ? valueUnderlying : 0);
  const borrowedValue = userDebt;
  const liquidationPrice = userDebt / liquidationThreshold;
  const newLiquidationPrice = newDebt / liquidationThreshold;
  const [overallValue, setOverallValue] = useState(0);

  useEffect(() => {
    if (!collCount || !userDebt || !userAllowance) return;
    setMaxValue(userDebt != 0 ? userDebt : userAllowance * collCount);
  }, [userDebt, userAllowance, collCount]);

  useEffect(() => {
    setOverallValue((nftPrice || 0) * openPositions?.length);
  }, [nftPrice, openPositions]);

  const liqPercent = overallValue
    ? ((overallValue - liquidationPrice) / overallValue) * 100
    : 0;
  const newLiqPercent = overallValue
    ? ((overallValue - newLiquidationPrice) / overallValue) * 100
    : 0;

  const selectedMarket = marketCollections.find(
    collection => collection.id === currentMarketId
  );

  //Wallet balance
  const {
    balance: walletSolBalance,
    loading: isLoadingSolBalance,
    refetch: refetchSolBalance
  } = useSolBalance();

  const {
    balance: walletLoanTokenBalance,
    loading: isLoadingWalletLoanTokenBalance,
    refetch: refetchWalletLoanTokenBalance
  } = useTokenBalance(
    selectedMarket?.constants.marketLoanCurrencyTokenMintAddress ?? ''
  );

  const userWalletBalance =
    selectedMarket?.loanCurrency === 'SOL'
      ? walletSolBalance
      : walletLoanTokenBalance;
  const isLoadingWalletBalance =
    selectedMarket?.loanCurrency === 'SOL'
      ? isLoadingSolBalance
      : isLoadingWalletLoanTokenBalance;
  const refetchWalletBalance =
    selectedMarket?.loanCurrency === 'SOL'
      ? refetchSolBalance
      : refetchWalletLoanTokenBalance;

  // Put your validators here
  const isRepayButtonDisabled = () => {
    if (isFetchingData) return true;
    return false;
  };
  // change of input - render calculated values
  const handleSliderChange = (value: number) => {
    if (userDebt <= 0) return;

    setSliderValue(value);
    setValueUSD(value * marketTokenPrice);
    setValueUnderlying(value);
  };
  // change of input - render calculated values
  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue || userDebt <= 0) {
      setValueUSD(0);
      setValueUnderlying(0);
      setSliderValue(0);
      return;
    }
    setValueUSD(usdValue);
    setValueUnderlying(usdValue / marketTokenPrice);
    setSliderValue(usdValue / marketTokenPrice);
  };
  // change of input - render calculated values
  const handleTokenInputChange = (tokenValue: number | undefined) => {
    if (!tokenValue || userDebt <= 0) {
      setValueUSD(0);
      setValueUnderlying(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(tokenValue * marketTokenPrice);
    setValueUnderlying(tokenValue);
    setSliderValue(tokenValue);
  };
  // executes repay function - changes tab state to borrow if changeTab exists
  const onRepay = async (event: any) => {
    if (userDebt == 0 && openPositions[0]) {
      executeWithdrawNFT(openPositions[0].mint, toast, true);
      // if (changeTab) {
      //   changeTab('borrow');
      // }
    } else {
      executeRepay(valueUnderlying || 0, toast);
      handleSliderChange(0);
    }
  };

  const sdkConfig = ConfigureSDK();
  const { honeyUser, honeyMarket } = useMarket(
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    sdkConfig.honeyId,
    currentMarketId
  );

  // useEffect(() => {
  //   const updateCollateralCount = async () => {
  //     if (honeyUser) {
  //       const obligationData = await honeyUser.getObligationData();
  //       if (obligationData instanceof Error) {
  //         setCollateralCount(0);
  //         return;
  //       }
  //       const collateralNftMint = obligationData.collateralNftMint.filter(
  //         mint => !mint.equals(PublicKey.default)
  //       );
  //       setCollateralCount(collateralNftMint.length);
  //     }
  //   };
  //   updateCollateralCount();
  // }, [honeyUser]);
  const cloudinary_uri = process.env.CLOUDINARY_URI;

  return (
    <SidebarScroll
      footer={
        <>
          {toast?.state ? (
            ToastComponent
          ) : (
            <Space direction="vertical" className={styles.buttonMaxWidth}>
              {userDebt == 0 && !toast.state && (
                <HoneyWarning message="Your have no outstanding debt. You can claim your collateral" />
              )}

              <div className={styles.buttons}>
                <div className={styles.smallCol}>
                  <HoneyButton variant="secondary" onClick={hideMobileSidebar}>
                    Cancel
                  </HoneyButton>
                </div>
                <div className={styles.bigCol}>
                  <HoneyButton
                    variant="primary"
                    tokenAmount={
                      userDebt > 0 ? valueUnderlying || 0 : undefined
                    }
                    tokenName={selectedMarket?.constants.marketLoanCurrency}
                    usdcValue={userDebt > 0 ? valueUSD || 0 : undefined}
                    disabled={isRepayButtonDisabled()}
                    block
                    onClick={onRepay}
                  >
                    {userDebt > 0 ? 'Repay' : 'Claim NFT'}
                  </HoneyButton>
                </div>
              </div>
            </Space>
          )}
        </>
      }
    >
      <div className={styles.repayForm}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              {openPositions.length ? (
                <Image
                  src={`https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${openPositions[0].image}`}
                  alt="Honey NFT image"
                  layout="fill"
                />
              ) : (
                renderMarketImageByID(currentMarketId)
              )}
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>
            {openPositions[0].name}{' '}
            {collCount ? (
              collCount > 1 && <span>+ {collCount - 1} more</span>
            ) : (
              <span>+ 0 more</span>
            )}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fsn(overallValue ?? 0)
                )
              }
              valueSize="big"
              title={
                <span className={hAlign}>
                  Collateral value{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
              toolTipLabel={
                <span>
                  The worth of your collateral according to the market’s oracle.
                  Learn more about this market’s{' '}
                  <a
                    className={extLink}
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
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fs(userAllowance)
                )
              }
              title={
                <span className={hAlign}>
                  Total allowance{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
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
              title={
                <span className={hAlign}>
                  Loan-to-Value %
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : overallValue == 0 ? (
                  fp(0)
                ) : (
                  fp((newDebt / overallValue) * 100)
                )
              }
              isDisabled={userDebt == 0 ? true : false}
              toolTipLabel={
                <span>
                  {' '}
                  <a
                    className={extLink}
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
              maxValue={overallValue || 0}
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
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fsn(newDebt < 0 ? 0 : newDebt)
                )
              }
              isDisabled={userDebt == 0 ? true : false}
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={extLink}
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
          <div className={styles.col}>
            <InfoBlock
              isDisabled={userDebt == 0 ? true : false}
              title={
                <span className={hAlign}>
                  Liquidation price{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={extLink}
                    target="blank"
                    href=" " //TODO: add link to docs
                  >
                    liquidation Price
                  </a>{' '}
                  after the requested changes to the loan are approved.
                </span>
              }
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  `${fsn(newLiquidationPrice)} ${
                    userDebt ? `(-${newLiqPercent?.toFixed(0)}%)` : ''
                  }`
                )
              }
              valueSize="normal"
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                title={`Your ${selectedMarket?.loanCurrency} balance`}
                value={
                  isFetchingData ? (
                    <Skeleton.Button size="small" active />
                  ) : (
                    fsn(Number(frd(userWalletBalance, 3)))
                  )
                }
              ></InfoBlock>
            </div>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                isDisabled={userDebt == 0 ? true : false}
                title={`NEW ${selectedMarket?.constants.marketLoanCurrency} balance`}
                value={
                  isFetchingData ? (
                    <Skeleton.Button size="small" active />
                  ) : (
                    fsn(
                      Number(frd(userWalletBalance - (valueUnderlying || 0), 3))
                    )
                  )
                }
              ></InfoBlock>
            </div>
          </div>
          {userDebt !== 0 && (
            <InputsBlock
              firstInputValue={valueUnderlying}
              secondInputValue={valueUSD}
              onChangeFirstInput={handleTokenInputChange}
              onChangeSecondInput={handleUsdInputChange}
              firstInputAddon={selectedMarket?.constants.marketLoanCurrency}
            />
          )}
        </div>
        {userDebt !== 0 && (
          <HoneySlider
            currentValue={sliderValue}
            maxValue={maxValue}
            minAvailableValue={0}
            onChange={handleSliderChange}
          />
        )}
      </div>
    </SidebarScroll>
  );
};

export default RepayForm;
