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
import { ConfigureSDK, toastResponse } from 'helpers/loanHelpers';
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
  COLLATERAL_FACTOR,
  marketCollections
} from 'helpers/marketHelpers';
import QuestionIcon from 'icons/QuestionIcon';
import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import NFTSelectListItem from 'components/NFTSelectListItem/NFTSelectListItem';
import { Skeleton } from 'antd';
import { useMarket } from '@honey-finance/sdk';
import { PublicKey } from '@solana/web3.js';
const {
  formatPercent: fp,
  formatSol: fs,
  formatRoundDown: frd,
  formatShortName: fsn
} = formatNumber;

interface NFT {
  name: string;
  image: string;
  mint: string;
  creators: any;
}

const BorrowForm = (props: BorrowProps) => {
  let {
    availableNFTs,
    openPositions,
    nftPrice,
    executeDepositNFT,
    executeWithdrawNFT,
    executeBorrow,
    userAllowance,
    userDebt,
    loanToValue,
    hideMobileSidebar,
    fetchedReservePrice,
    calculatedInterestRate,
    currentMarketId,
    isFetchingData
  } = props;
  // state declarations
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueSOL, setValueSOL] = useState<number>(0);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [isBulkLoan, setIsBulkLoan] = useState(true);
  const [selectedMultipleNFTs, setSelectedMultipleNFTs] = useState<NFT[]>();
  const [collateralMenuMode, setCollateralMenuMode] = useState<
    'new_collateral' | 'collateral'
  >('collateral');
  const [showCollateralMenu, setShowCollateralMenu] = useState(false);
  const [hasOpenPosition, setHasOpenPosition] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const { toast, ToastComponent } = useToast();
  const [overallValue, setOverallValue] = useState(0);

  useEffect(() => {
    setOverallValue(nftPrice * openPositions?.length);
  }, [nftPrice, openPositions]);

  // constants && calculations
  const borrowedValue = userDebt;
  const maxValue = userAllowance * openPositions?.length;
  const solPrice = fetchedReservePrice;
  const liquidationThreshold = COLLATERAL_FACTOR; // TODO: change where relevant, currently set to 65% on mainnet
  const borrowFee = BORROW_FEE; // TODO: 1,5% later but 0% for now
  const newAdditionalDebt = valueSOL * (1 + borrowFee);
  const newTotalDebt = newAdditionalDebt
    ? userDebt + newAdditionalDebt
    : userDebt;
  const liquidationPrice = userDebt / liquidationThreshold;
  const liqPercent = ((overallValue * -liquidationPrice) / nftPrice) * 100;
  const newLiquidationPrice = newTotalDebt / liquidationThreshold;
  const newLiqPercent = overallValue
    ? ((overallValue - newLiquidationPrice) / overallValue) * 100
    : 0;
  const selectedMarket = marketCollections.find(
    market => market.constants.marketId === currentMarketId
  );
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
  const selectNFT = (name: string, image: string, mint: any, creators: any) => {
    if (hasOpenPosition == false) {
      setSelectedNft({ name, image, mint, creators: creators[0].address });
    } else {
      setSelectedNft({ name, image, mint, creators: creators[0].address });
    }
  };

  const sdkConfig = ConfigureSDK();
  const { honeyUser, honeyMarket } = useMarket(
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    sdkConfig.honeyId,
    currentMarketId
  );

  const [collateralCount, setCollateralCount] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const updateCollateralCount = async () => {
      if (honeyUser) {
        const obligationData = await honeyUser.getObligationData();
        if (obligationData instanceof Error) {
          setCollateralCount(0);
          return;
        }
        const collateralNftMint = obligationData.collateralNftMint.filter(
          mint => !mint.equals(PublicKey.default)
        );
        setCollateralCount(collateralNftMint.length);
      }
    };
    updateCollateralCount();
  }, [honeyUser]);

  useEffect(() => {
    if (!honeyMarket) return;
    const updatePrice = async () => {
      const price = await honeyMarket.fetchNFTFloorPriceInReserve(0);
      setPrice(price);
    };
    updatePrice();
  }, [honeyMarket]);

  // if user has an open position, we need to be able to click on the position and borrow against it
  useEffect(() => {
    if (openPositions?.length) {
      const { name, image, mint, verifiedCreator } = openPositions[0];
      setSelectedNft({ name, image, mint, creators: verifiedCreator });
      setHasOpenPosition(true);
    } else if (openPositions.length == 0) {
      setHasOpenPosition(false);
    }
  }, [openPositions, availableNFTs]);

  // handles the deposit NFT function - which is depending on selectedNft
  const handleDepositNFT = async () => {
    if (selectedNft && selectedNft.mint.length < 1)
      return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    if (selectedNft && selectedNft.mint.length > 1) {
      const verifiedCreator = selectedNft.creators.filter(
        (creator: { verified: any }) => creator.verified
      );
      executeDepositNFT(
        selectedNft.mint,
        toast,
        selectedNft.name,
        verifiedCreator[0].address
      );
    }
    handleSliderChange(0);
  };

  //Handle deposit multiple NFTs as collateral
  const handleDepositMultipleNFTs = async () => {
    if (selectedMultipleNFTs?.length && selectedMultipleNFTs[0].mint.length < 1)
      return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    if (
      selectedMultipleNFTs?.length &&
      selectedMultipleNFTs[0].mint.length > 1
    ) {
      for (let index = 0; index < selectedMultipleNFTs.length; index++) {
        const verifiedCreator = selectedMultipleNFTs[index].creators.filter(
          (creator: { verified: any }) => creator.verified
        );
        await executeDepositNFT(
          selectedMultipleNFTs[index].mint,
          toast,
          selectedMultipleNFTs[index].name,
          verifiedCreator[0].address
        );
      }
    }

    //Reset selected NFTs
    setSelectedMultipleNFTs([]);
  };

  const handleClaimMultipleCollateral = async () => {
    if (selectedMultipleNFTs && selectedMultipleNFTs?.length < 1) {
      return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    }
    if (!selectedMultipleNFTs) return;

    for (let index = 0; index < selectedMultipleNFTs.length; index++) {
      await executeWithdrawNFT(selectedMultipleNFTs[index].mint, toast);
    }

    //Reset selected NFTs
    setSelectedMultipleNFTs([]);
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

  const handleSelectMultipleNFTsItem = (event: any, nft: NFT) => {
    const isCurrentlySelected = Boolean(
      selectedMultipleNFTs?.some(item => item.mint === nft.mint)
    );
    if (isCurrentlySelected && !event.target.checked) {
      //unselect
      const newSelectedNFTs = selectedMultipleNFTs?.filter(
        item => item.mint != nft.mint
      );
      setSelectedMultipleNFTs(newSelectedNFTs);
    } else {
      if (selectedMultipleNFTs && selectedMultipleNFTs?.length) {
        setSelectedMultipleNFTs([...selectedMultipleNFTs, nft]);
      } else {
        setSelectedMultipleNFTs([nft]);
      }
    }
  };

  // renders nft list is no nft is selected
  const renderContent = () => {
    if (!hasOpenPosition) {
      //Remove false when multiple deposits is possible
      if (isBulkLoan) {
        return (
          <>
            <div className={styles.newBorrowingTitle}>Choose Multiple NFTs</div>
            {availableNFTs.map((nft: NFT) => {
              const isSelected = Boolean(
                selectedMultipleNFTs?.some(item => item.mint === nft.mint)
              );
              const disabled =
                Boolean(selectedMultipleNFTs?.length) && !isSelected;
              return (
                <NFTSelectListItem
                  key={nft.mint}
                  id={nft.mint}
                  name={nft.name}
                  image={nft.image}
                  value={fs(price)}
                  isSelected={isSelected}
                  onChange={e => {
                    handleSelectMultipleNFTsItem(event, nft);
                  }}
                  tokenName="SOL"
                  disabled={false} //remove disabled when multiple selction becomes allowed
                />
              );
            })}
          </>
        );
      } else {
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
    }

    if (showCollateralMenu) {
      return (
        <>
          <div
            className={styles.nftInfo}
            onClick={() => setShowCollateralMenu(false)}
          >
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
            <div className={styles.nftNameContainer}>
              <div className={styles.nftName}>{selectedMarket?.name}</div>
              <div className={styles.collateralDetails}>
                {collateralCount} assets securing this loan
              </div>
            </div>
            <div className={styles.cancelIcon} />
          </div>
          <HoneyButtonTabs
            items={[
              {
                name: 'collateral',
                slug: 'collateral'
              },
              {
                name: 'New collateral ',
                slug: 'new_collateral'
              }
            ]}
            activeItemSlug={collateralMenuMode}
            isFullWidth
            onClick={slug => {
              setCollateralMenuMode(slug as any);
              setSelectedMultipleNFTs([]);
            }}
          />
          <div className={styles.collateralList}>
            {(collateralMenuMode === 'collateral'
              ? openPositions
              : availableNFTsInSelectedMarket
            ).map((nft: NFT) => {
              const isSelected = Boolean(
                selectedMultipleNFTs?.some(item => item.mint === nft.mint)
              );
              return (
                <NFTSelectListItem
                  key={nft.mint}
                  id={nft.mint}
                  name={nft.name}
                  image={nft.image}
                  value={fs(price)}
                  isSelected={isSelected}
                  onChange={e => {
                    handleSelectMultipleNFTsItem(event, nft);
                  }}
                  tokenName="SOL"
                />
              );
            })}
          </div>
        </>
      );
    }

    return (
      <>
        <div
          className={styles.nftInfo}
          onClick={() => setShowCollateralMenu(true)}
        >
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
          <div className={styles.nftNameContainer}>
            <div className={styles.nftName}>{selectedMarket?.name}</div>
            <div className={styles.collateralDetails}>
              {collateralCount} assets securing this loan
            </div>
          </div>
          <div className={styles.arrowRightIcon} />
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                isFetchingData ? (
                  <Skeleton.Button size="small" active />
                ) : (
                  fsn(overallValue)
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
                  fsn(userAllowance * openPositions?.length)
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
              maxValue={overallValue}
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
              maxValue={maxValue}
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
          maxValue={overallValue}
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
    if (showCollateralMenu) {
      setShowCollateralMenu(false);
    }
    if (typeof hideMobileSidebar === 'function') {
      hideMobileSidebar();
    }
  };

  const getBtnDetails = () => {
    if (showCollateralMenu) {
      return {
        cancelTxt: 'Return',
        onCancel: handleCancel,
        title:
          collateralMenuMode === 'collateral'
            ? 'Claim collateral'
            : 'Add collateral',
        onClick:
          collateralMenuMode === 'collateral'
            ? handleClaimMultipleCollateral
            : handleDepositMultipleNFTs,
        disabled: Boolean(!selectedMultipleNFTs?.length)
      };
    }

    if (hasOpenPosition) {
      return {
        cancelTxt: 'Cancel',
        onCancel: handleCancel,
        title: 'Borrow',
        onClick: handleBorrow,
        disabled: isBorrowButtonDisabled(),
        solAmount: valueSOL || 0,
        usdcValue: valueUSD || 0
      };
    } else {
      //Uncomment when multiple deposits allowed
      if (isBulkLoan) {
        return {
          cancelTxt: 'Cancel',
          onCancel: handleCancel,
          title: 'Deposit Selected NFT',
          onClick: handleDepositMultipleNFTs,
          disabled: !selectedMultipleNFTs?.length
        };
      } else {
        return {
          cancelTxt: 'Cancel',
          onCancel: handleCancel,
          title: 'Deposit NFT',
          onClick: handleDepositNFT,
          disabled: !selectedNft
        };
      }
    }
  };
  const renderFooter = () => {
    return toast?.state ? (
      ToastComponent
    ) : (
      <div className={styles.buttons}>
        <div className={styles.smallCol}>
          <HoneyButton
            variant="secondary"
            onClick={getBtnDetails().onCancel || handleCancel}
          >
            {getBtnDetails().cancelTxt || 'Cancel'}
          </HoneyButton>
        </div>
        <div className={styles.bigCol}>
          <HoneyButton variant="primary" block {...getBtnDetails()}>
            {getBtnDetails().title}
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
