import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BorrowForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import NftList from '../NftList/NftList';
import { MAX_LTV } from '../../constants/loan';
import { BorrowProps } from './types';
import { toastResponse } from 'helpers/loanHelpers';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import * as stylesRepay from '../RepayForm/RepayForm.css';
import { hAlign, extLink, center } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import cs from 'classnames';
import {
  renderMarketImageByID,
  renderNftList,
  BORROW_FEE,
  COLLATERAL_FACTOR
} from 'helpers/marketHelpers';
import QuestionIcon from 'icons/QuestionIcon';
import { Skeleton } from 'antd';
const {
  formatPercent: fp,
  formatSol: fs,
  formatRoundDown: frd,
  formatShortName: fsn
} = formatNumber;

interface NFT {
  name: string;
  img: string;
  mint: string;
  creator: string;
}

const BorrowForm = (props: BorrowProps) => {
  let {
    availableNFTs,
    openPositions,
    nftPrice,
    executeDepositNFT,
    executeBorrow,
    userAllowance,
    userDebt,
    loanToValue,
    hideMobileSidebar,
    fetchedSolPrice,
    calculatedInterestRate,
    currentMarketId,
    isFetchingData
  } = props;
  // state declarations
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueSOL, setValueSOL] = useState<number>(0);
  const [isNftSelected, setIsNftSelected] = useState(false);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [hasOpenPosition, setHasOpenPosition] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const { toast, ToastComponent } = useToast();
  // constants && calculations
  const borrowedValue = userDebt;
  const maxValue = userAllowance;
  const solPrice = fetchedSolPrice;
  const liquidationThreshold = COLLATERAL_FACTOR; // TODO: change where relevant, currently set to 65% on mainnet
  const borrowFee = BORROW_FEE; // TODO: 1,5% later but 0% for now
  const newAdditionalDebt = valueSOL * (1 + borrowFee);
  const newTotalDebt = newAdditionalDebt
    ? userDebt + newAdditionalDebt
    : userDebt;
  const liquidationPrice = userDebt / liquidationThreshold;
  const liqPercent = ((nftPrice - liquidationPrice) / nftPrice) * 100;
  const newLiquidationPrice = newTotalDebt / liquidationThreshold;
  const newLiqPercent = nftPrice
    ? ((nftPrice - newLiquidationPrice) / nftPrice) * 100
    : 0;

  // Put your validators here
  const isBorrowButtonDisabled = () => {
    return userAllowance == 0 ? true : false;
  };
  // change of input - render calculated values
  const handleSliderChange = (value: number) => {
    if (userAllowance == 0) return;
    setSliderValue(value);
    setValueUSD(value * solPrice);
    setValueSOL(value);
  };
  // change of input - render calculated values
  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (userAllowance == 0) return;
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
  // change of input - render calculated values
  const handleSolInputChange = (solValue: number | undefined) => {
    if (userAllowance == 0) return;
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

  // set selection state and render (or not) detail nft
  const selectNFT = (name: string, img: string, mint: any, creators: any) => {
    if (hasOpenPosition == false) {
      setSelectedNft({ name, img, mint, creator: creators[0].address });
    } else {
      setSelectedNft({ name, img, mint, creator: creators[0].address });
      setIsNftSelected(true);
    }
  };

  // if user has an open position, we need to be able to click on the position and borrow against it
  useEffect(() => {
    if (openPositions?.length) {
      const { name, image, mint, verifiedCreator } = openPositions[0];
      setSelectedNft({ name, img: image, mint, creator: verifiedCreator });
      setIsNftSelected(true);
      setHasOpenPosition(true);
    } else if (openPositions.length == 0) {
      setIsNftSelected(false);
      setHasOpenPosition(false);
    }
  }, [openPositions, availableNFTs]);
  // handles the deposit NFT function - which is depending on selectedNft
  const handleDepositNFT = async () => {
    if (selectedNft && selectedNft.mint.length < 1)
      return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    if (selectedNft && selectedNft.mint.length > 1)
      executeDepositNFT(
        selectedNft.mint,
        toast,
        selectedNft.name,
        selectedNft.creator
      );
    handleSliderChange(0);
  };
  // executes the borrow function
  const handleBorrow = async () => {
    executeBorrow(valueSOL, toast);
    handleSliderChange(0);
  };
  // fetches the market specific available nfts
  const availableNFTsInSelectedMarket = renderNftList(
    currentMarketId,
    availableNFTs
  );
  // renders nft list is no nft is selected
  const renderContent = () => {
    if (isNftSelected == false) {
      return (
        <>
          <div className={styles.newBorrowingTitle}>Choose NFT</div>
          <NftList
            data={availableNFTsInSelectedMarket}
            selectNFT={selectNFT}
            nftPrice={nftPrice}
            selectedNFTMint={selectedNft?.mint}
          />
        </>
      );
    }

    return (
      <>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              {openPositions.length ? (
                <Image
                  src={openPositions[0].image}
                  alt="Honey NFT image"
                  layout="fill"
                />
              ) : (
                renderMarketImageByID(currentMarketId)
              )}
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>{selectedNft?.name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fsn(nftPrice)
                )
              }
              valueSize="big"
              title={
                <span className={hAlign}>
                  Estimated value{' '}
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
                  fsn(userAllowance)
                )
              }
              // value={fs(Number(frd(userAllowance)))}
              title={
                <span className={hAlign}>
                  Allowance{' '}
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
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fp(loanToValue * 100)
                )
              }
              toolTipLabel={
                <span>
                  <a
                    className={extLink}
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
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
            />
            <HoneySlider
              currentValue={0}
              maxValue={nftPrice}
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
                  New LTV %
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
              toolTipLabel={
                <span>
                  New{' '}
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
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fp((loanToValue + newAdditionalDebt / nftPrice) * 100)
                )
              }
              isDisabled={userDebt == 0 ? true : false}
            />
            <HoneySlider
              currentValue={sliderValue * 1.1}
              maxValue={nftPrice}
              minAvailableValue={borrowedValue}
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
                  Debt{' '}
                  <div className={questionIcon}>
                    <QuestionIcon />
                  </div>
                </span>
              }
              toolTipLabel={
                <span>
                  Value borrowed from the lending pool, upon which interest
                  accrues.{' '}
                  <a
                    className={extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#debt"
                  >
                    Learn more.
                  </a>
                </span>
              }
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fsn(userDebt)
                )
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New debt + fees{' '}
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
                    href="https://docs.honey.finance/learn/defi-lending#debt"
                  >
                    debt{' '}
                  </a>
                  after the requested changes to the loan are approved.
                </span>
              }
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fsn(newTotalDebt < 0 ? 0 : newTotalDebt)
                )
              }
              isDisabled={userDebt == 0 ? true : false}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  `${fsn(liquidationPrice)} ${
                    userDebt ? `(-${liqPercent.toFixed(0)}%)` : ''
                  }`
                )
              }
              valueSize="normal"
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
                  Price at which the position (NFT) will be liquidated.{' '}
                  <a
                    className={extLink}
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
                  New Liquidation price{' '}
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
                    userDebt ? `(-${newLiqPercent.toFixed(0)}%)` : ''
                  }`
                )
              }
              valueSize="normal"
            />
          </div>
        </div>
        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={cs(stylesRepay.balance, styles.col)}>
              <InfoBlock
                title={
                  <span className={hAlign}>
                    Interest Rate{' '}
                    <div className={questionIcon}>
                      <QuestionIcon />
                    </div>
                  </span>
                }
                toolTipLabel={
                  <span>
                    Variable interest rate, based on Utilization rate.{' '}
                    <a
                      className={extLink}
                      target="blank"
                      href=" " //TODO: add link to docs
                    >
                      Learn more.
                    </a>
                  </span>
                }
                value={
                  isFetchingData ? (
                    <Skeleton.Button size="small" active />
                  ) : (
                    fp(calculatedInterestRate)
                  )
                }
              ></InfoBlock>
            </div>
            <div className={cs(stylesRepay.balance, styles.col)}>
              <InfoBlock
                isDisabled={userDebt == 0 ? true : false}
                title={
                  <span className={hAlign}>
                    Borrow Fee{' '}
                    <div className={questionIcon}>
                      <QuestionIcon />
                    </div>
                  </span>
                }
                value={
                  isFetchingData ? (
                    <Skeleton.Button size="small" active />
                  ) : (
                    fsn(valueSOL * borrowFee)
                  )
                }
                //TODO: add link to docs
                toolTipLabel={
                  <span>
                    Borrow Fee is a{' '}
                    <a className={extLink} target="blank" href=" ">
                      protocol fee{' '}
                    </a>
                    that is charged upon borrowing. For now it is set at 0,00%.
                  </span>
                }
              ></InfoBlock>
            </div>
          </div>
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
          maxValue={nftPrice}
          minAvailableValue={borrowedValue}
          maxSafePosition={0.3 - borrowedValue / 1000}
          dangerPosition={0.45 - borrowedValue / 1000}
          maxAvailablePosition={MAX_LTV}
          onChange={handleSliderChange}
        />
      </>
    );
  };

  const handleCancel = () => {
    if (typeof hideMobileSidebar === 'function') {
      hideMobileSidebar();
    }
  };

  const renderFooter = () => {
    return toast?.state ? (
      ToastComponent
    ) : hasOpenPosition ? (
      <div className={styles.buttons}>
        <div className={styles.smallCol}>
          <HoneyButton variant="secondary" onClick={handleCancel}>
            Cancel
          </HoneyButton>
        </div>
        <div className={styles.bigCol}>
          <HoneyButton
            solAmount={valueSOL || 0}
            usdcValue={valueUSD || 0}
            variant="primary"
            disabled={isBorrowButtonDisabled()}
            block
            onClick={handleBorrow}
          >
            Borrow
          </HoneyButton>
        </div>
      </div>
    ) : (
      <div className={styles.buttons}>
        <div className={styles.smallCol}>
          <HoneyButton variant="secondary" onClick={handleCancel}>
            Cancel
          </HoneyButton>
        </div>
        <div className={styles.bigCol}>
          <HoneyButton
            disabled={!selectedNft}
            variant="primary"
            block
            onClick={handleDepositNFT}
          >
            Deposit NFT
          </HoneyButton>
        </div>
      </div>
    );
  };

  return (
    <SidebarScroll footer={renderFooter()}>
      <div className={styles.borrowForm}>{renderContent()}</div>
    </SidebarScroll>
  );
};

export default BorrowForm;
