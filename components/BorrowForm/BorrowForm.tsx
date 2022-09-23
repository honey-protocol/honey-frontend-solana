import React, { FC, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BorrowForm.css';
import { formatNumber } from '../../helpers/format';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import NftList from '../NftList/NftList';
import { NftCardProps } from '../NftCard/types';
import { MAX_LTV } from '../../constants/loan';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';

type BorrowFormProps = {};

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const BorrowForm: FC<BorrowFormProps> = () => {
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [sliderValue, setSliderValue] = useState(0);

  // Only for test purposes
  const isNftSelected = true;

  const borrowedValue = 200;
  const maxValue = 1000;

  // Put your validators here
  const isBorrowButtonDisabled = () => {
    return false;
  };

  const nftsMockData: NftCardProps[] = [
    {
      id: '1',
      img: 'path/to/iamge',
      name: 'Doodles #1291',
      text: '$1,000',
      hint: 'Value',
      buttonText: '$600'
    },
    {
      id: '2',
      img: 'path/to/iamge',
      name: 'Doodles #1291',
      text: '$1,000',
      hint: 'Value',
      buttonText: '$600'
    },
    {
      id: '3',
      img: 'path/to/iamge',
      name: 'Doodles #1291',
      text: '$1,000',
      hint: 'Value',
      buttonText: '$600'
    },
    {
      id: '4',
      img: 'path/to/iamge',
      name: 'Doodles #1291',
      text: '$1,000',
      hint: 'Value',
      buttonText: '$600'
    }
  ];

  const handleItemClick = (id: string) => {
    alert(`${id} selected`);
  };

  const renderContent = () => {
    if (!isNftSelected) {
      return (
        <>
          <div className={styles.newBorrowingTitle}>Choose NFT</div>
          <NftList data={nftsMockData} onItemClick={handleItemClick} />
        </>
      );
    }

    return (
      <>
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
            <HoneySlider
              currentValue={0}
              maxValue={maxValue}
              minAvailableValue={borrowedValue}
              maxSafePosition={0.4 - borrowedValue / 1000}
              maxAvailablePosition={MAX_LTV}
              onChange={setSliderValue}
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
              onChange={setSliderValue}
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
          <InputsBlock
            valueUSD={valueUSD}
            valueUSDC={valueUSDC}
            onChangeUSD={setValueUSD}
            onChangeUSDC={setValueUSDC}
          />
        </div>

        <HoneySlider
          currentValue={sliderValue}
          maxValue={maxValue}
          minAvailableValue={borrowedValue}
          maxSafePosition={0.4 - borrowedValue / 1000}
          maxAvailablePosition={MAX_LTV}
          onChange={setSliderValue}
        />
      </>
    );
  };

  const renderFooter = () => {
    if (!isNftSelected) {
      return (
        <div className={styles.buttons}>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="secondary"
              disabled={isBorrowButtonDisabled()}
              isFluid
            >
              Cancel
            </HoneyButton>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.buttons}>
        <div className={styles.smallCol}>
          <HoneyButton variant="secondary">Cancel</HoneyButton>
        </div>
        <div className={styles.bigCol}>
          <HoneyButton
            usdcAmount={valueUSDC || 0}
            usdcValue={valueUSD || 0}
            variant="primary"
            disabled={isBorrowButtonDisabled()}
            isFluid
          >
            Borrow
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
