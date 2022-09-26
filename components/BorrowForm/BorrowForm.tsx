import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BorrowForm.css';
import { formatNumber } from '../../helpers/format';
import honeyEyes from '/public/nfts/honeyEyes.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import NftList from '../NftList/NftList';
import { NftCardProps } from '../NftCard/types';
import { MAX_LTV } from '../../constants/loan';
import { usdcAmount } from '../HoneyButton/HoneyButton.css';
import { BorrowProps } from './types';
import { toastResponse } from 'helpers/loanHelpers';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import imagePlaceholder from 'public/images/imagePlaceholder.png';
import * as stylesRepay from '../RepayForm/RepayForm.css';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import { useSolBalance } from 'hooks/useSolBalance';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

interface NFT {
  name: string;
  img: string;
  mint: string;
}

const BorrowForm = (props: BorrowProps) => {
  const {
    availableNFTs,
    openPositions,
    nftPrice,
    executeDepositNFT,
    executeBorrow,
    userAllowance,
    userDebt,
    loanToValue,
  } = props;

  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueUSDC, setValueUSDC] = useState<number>(0);
  const [isNftSelected, setIsNftSelected] = useState(false);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [hasOpenPosition, setHasOpenPosition] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const { toast, ToastComponent } = useToast();
  const SOLBalance = useSolBalance();

  // Only for test purposes
  // const isNftSelected = true;

  const borrowedValue = userDebt;
  const maxValue = userAllowance;
  const usdcPrice = 0.95;
  const liquidationThreshold = 0.75;

  const newDebt = userDebt + 1.1 * (valueUSD ? valueUSD : 0);

  // Put your validators here
  const isBorrowButtonDisabled = () => {
    return userAllowance == 0 ? true : false;
  };

  const handleSliderChange = (value: number) => {
    if (userAllowance == 0) return;
    setSliderValue(value);
    setValueUSD(value / usdcPrice);
    setValueUSDC(value);
  };

  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (userAllowance == 0) return;
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
    if (userAllowance == 0) return;
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

  // set selection state and render (or not) detail nft
  const selectNFT = (name: string, img: string, mint?: any) => {
    if (hasOpenPosition == false) {
      setSelectedNft({ name, img, mint });
    } else {
      setIsNftSelected(true);
      setSelectedNft({ name, img, mint });
    }
  };

  useEffect(() => {}, [userAllowance]);

  // if user has an open position, we need to be able to click on the position and borrow against it
  useEffect(() => {
    if (openPositions?.length) {
      const { name, image, mint } = openPositions[0];
      setSelectedNft({ name, img: image, mint });
      setIsNftSelected(true);
      setHasOpenPosition(true);
    }
  }, [openPositions, availableNFTs]);

  function handleDepositNFT() {
    if (selectedNft && selectedNft.mint.length < 1)
      return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    if (selectedNft && selectedNft.mint.length > 1)
      executeDepositNFT(selectedNft.mint, toast);
  }

  function handleBorrow() {
    executeBorrow(valueUSDC, toast);
  }

  useEffect(() => {
  }, [selectedNft]);

  const renderContent = () => {
    if (isNftSelected == false) {
      return (
        <>
          <div className={styles.newBorrowingTitle}>Choose NFT</div>
          <NftList
            data={availableNFTs}
            selectNFT={selectNFT}
            nftPrice={nftPrice}
          />
        </>
      );
    }

    return (
      <>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              <Image
                src={selectedNft?.img || imagePlaceholder}
                alt={`${selectedNft?.name}`}
                layout="fill"
              />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>{selectedNft?.name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fu(nftPrice)}
              valueSize="big"
              footer={<span>Estimated value</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={f(userDebt / liquidationThreshold)}
              valueSize="big"
              footer={<span>Liquidation price</span>}
              isDisabled={userDebt == 0 ? true : false}
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
              title={'New risk level'}
              value={fp(sliderValue * 100)}
              isDisabled={true}
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
            <InfoBlock title={'Debt'} value={fu(userDebt)} />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={'New debt with 10% rate'}
              value={fu(newDebt < 0 ? 0 : newDebt)}
              isDisabled={true}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fu(userAllowance)}
              title={
                <span className={hAlign}>
                  Allowance <div className={questionIcon} />
                </span>
              }
              footer={<span>No more than {fp(60)}</span>}
              toolTipLabel="Allowance determines how much debt is available to a borrower."
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={'New allowance'}
              value={fu(
                userAllowance - newDebt < 0 ? 0 : userAllowance - newDebt
              )}
            />
          </div>
        </div>
        <div className={styles.inputs}>
        <div className={styles.row}>
          <div className={cs(stylesRepay.balance, styles.col)}>
            <InfoBlock
              title={'Your SOL balance'}
              value={f(SOLBalance)}
            ></InfoBlock>
          </div>
          <div className={cs(stylesRepay.balance, styles.col)}>
            <InfoBlock
              title={'New SOL balance'}
              value={f(SOLBalance + valueUSDC)}
            ></InfoBlock>
          </div>
        </div>
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
          maxValue={nftPrice}
          minAvailableValue={borrowedValue}
          maxSafePosition={0.4 - borrowedValue / 1000}
          maxAvailablePosition={MAX_LTV}
          onChange={handleSliderChange}
        />
      </>
    );
  };

  const renderFooter = () => {
    return toast?.state ? (
      <ToastComponent />
    ) : hasOpenPosition ? (
      <div className={styles.buttons}>
        <div className={styles.smallCol}>
          <HoneyButton variant="secondary">Cancel</HoneyButton>
        </div>
        <div className={styles.bigCol}>
          <HoneyButton
            solAmount={valueUSDC || 0}
            usdcValue={valueUSD || 0}
            variant="primary"
            disabled={isBorrowButtonDisabled()}
            isFluid
            onClick={handleBorrow}
          >
            Borrow
          </HoneyButton>
        </div>
      </div>
    ) : !isNftSelected ? null : (
      <div className={styles.buttons}>
        <div className={styles.smallCol}>
          <HoneyButton
            variant="secondary"
            disabled={isBorrowButtonDisabled()}
            isFluid
          >
            Cancel
          </HoneyButton>
        </div>
        <div className={styles.bigCol}>
          <HoneyButton variant="primary" isFluid onClick={handleDepositNFT}>
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
