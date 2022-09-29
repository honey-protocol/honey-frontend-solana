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
import cs from 'classnames';
import Nft from 'pages/farm/[name]';

const { format: f, formatPercent: fp, formatSol: fs, parse: p } = formatNumber;

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
    hideMobileSidebar
  } = props;

  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueSOL, setValueSOL] = useState<number>(0);
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
  const solPrice = 32;
  const liquidationThreshold = 0.75;

  const newAdditionalDebt = 1.1 * valueSOL;
  const newTotalDebt = newAdditionalDebt
    ? userDebt + newAdditionalDebt
    : userDebt;

  // Put your validators here
  const isBorrowButtonDisabled = () => {
    return userAllowance == 0 ? true : false;
  };

  const handleSliderChange = (value: number) => {
    if (userAllowance == 0) return;
    setSliderValue(value);
    setValueUSD(value * solPrice);
    setValueSOL(value);
  };

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

  const handleDepositNFT = async () => {
    if (selectedNft && selectedNft.mint.length < 1)
      return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    if (selectedNft && selectedNft.mint.length > 1)
      await executeDepositNFT(selectedNft.mint, toast);
    handleSliderChange(0);
  };

  const handleBorrow = async () => {
    await executeBorrow(valueSOL, toast);
    handleSliderChange(0);
  };

  useEffect(() => {}, [selectedNft]);

  const renderContent = () => {
    if (isNftSelected == false) {
      return (
        <>
          <div className={styles.newBorrowingTitle}>Choose NFT</div>
          <NftList
            data={availableNFTs}
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
              value={fs(userDebt / liquidationThreshold)}
              valueSize="big"
              isDisabled={userDebt == 0 ? true : false}
              title={
                <span className={hAlign}>
                  Liquidation price <div className={questionIcon} />
                </span>
              }
              toolTipLabel="Placeholder text for tooltip" // TODO: CHANGE TO REAL INFO TEXT FOR LIQ PRICE
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
                  New risk level <div className={questionIcon} />
                </span>
              }
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href=" https://docs.honey.finance/lending-protocol/borrowing#risk-level"
                  >
                    risk level{' '}
                  </a>
                  after the requested changes to the loan are approved.
                </span>
              }
              value={fp((loanToValue + newAdditionalDebt / nftPrice) * 100)}
              isDisabled={true}
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
                  Debt <div className={questionIcon} />
                </span>
              }
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
              value={fs(userDebt)}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New debt + fees <div className={questionIcon} />
                </span>
              }
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
              value={fs(newTotalDebt < 0 ? 0 : newTotalDebt)}
              isDisabled={true}
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
              toolTipLabel={`Allowance determines how much debt is available to a borrower. This market supports no more than ${fp(
                60
              )}`}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              isDisabled
              title={
                <span className={hAlign}>
                  New allowance <div className={questionIcon} />
                </span>
              }
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#allowance"
                  >
                    allowance{' '}
                  </a>
                  after the requested changes to the loan are approved.
                </span>
              }
              value={fs(
                userAllowance - newAdditionalDebt < 0
                  ? 0
                  : !valueSOL
                  ? userAllowance
                  : userAllowance - newAdditionalDebt
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
                isDisabled
                title={'New SOL balance'}
                value={f(SOLBalance + valueSOL)}
              ></InfoBlock>
            </div>
          </div>
          <InputsBlock
            valueUSD={p(f(valueUSD))}
            valueSOL={p(f(valueSOL))}
            onChangeUSD={handleUsdInputChange}
            onChangeSOL={handleSolInputChange}
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
            solAmount={valueSOL || 0}
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
    ) : (
      <div className={styles.buttons}>
        <div className={styles.smallCol}>
          <HoneyButton
            variant="secondary"
            disabled={isBorrowButtonDisabled()}
            onClick={hideMobileSidebar}
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
