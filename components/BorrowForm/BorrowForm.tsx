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
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { toastResponse } from 'helpers/loanHelpers';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import imagePlaceholder from 'public/images/imagePlaceholder.png';

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
    userDebt
  } = props;

  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [isNftSelected, setIsNftSelected] = useState(false);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [hasOpenPosition, setHasOpenPosition] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  // Only for test purposes
  // const isNftSelected = true;

  const borrowedValue = userDebt;
  const maxValue = userAllowance;
  const usdcPrice = 0.95;

  // Put your validators here
  const isBorrowButtonDisabled = () => {
    return userAllowance == 0 ? true : false;
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
    if (openPositions?.length) setHasOpenPosition(true);
  }, [openPositions, availableNFTs]);

  function handleDepositNFT() {
    if (selectedNft && selectedNft.mint.length < 1)
      return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    if (selectedNft && selectedNft.mint.length > 1)
      executeDepositNFT(selectedNft.mint);
  }

  function handleBorrow() {
    if (hasOpenPosition && openPositions[0]) {
      const { name, mint } = openPositions[0];
      const img = openPositions[0].image;
      setSelectedNft({ name, img, mint });
      setIsNftSelected(true);
    }
  }

  useEffect(() => {}, [selectedNft]);

  const renderContent = () => {
    if (isNftSelected == false) {
      if (hasOpenPosition) {
        return (
          <>
            <div className={styles.newBorrowingTitle}>
              Collateralised position
            </div>
            <NftList
              data={openPositions}
              selectNFT={selectNFT}
              nftPrice={nftPrice}
            />
          </>
        );
      } else {
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
              value={fp(75)}
              valueSize="big"
              footer={<span>Liquidation at</span>}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock title={'Risk level'} value={fu(0)} />
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
              value={fu(0)}
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
    if (hasOpenPosition) {
      return (
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton
              variant="secondary"
              onClick={() => setIsNftSelected(false)}
            >
              Cancel
            </HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              usdcAmount={valueUSDC || 0}
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
      );
    } else {
      return (
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
    }
  };

  return (
    <SidebarScroll footer={renderFooter()}>
      <div className={styles.borrowForm}>{renderContent()}</div>
    </SidebarScroll>
  );
};

export default BorrowForm;
