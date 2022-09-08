import React, { FC, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { Range } from '../Range/Range';
import * as styles from './BorrowForm.css';
import { formatNumber } from '../../helpers/format';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import NftList from '../NftList/NftList';
import { NftCardProps } from '../NftCard/types';

type BorrowFormProps = {};

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const BorrowForm: FC<BorrowFormProps> = () => {
  const [valueUSD, setValueUSD] = useState('');
  const [valueUSDC, setValueUSDC] = useState('');
  const [rangeValue, setRangeValue] = useState(0);

  // Only for test purposes
  const isNftSelected = false;

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
          <InputsBlock
            valueUSD={valueUSD}
            valueUSDC={valueUSDC}
            onChangeUSD={setValueUSD}
            onChangeUSDC={setValueUSDC}
          />
        </div>

        <Range
          currentValue={rangeValue}
          estimatedValue={1000}
          borrowedValue={0}
          onChange={setRangeValue}
        />
      </>
    );
  };

  return (
    <div className={styles.borrowForm}>
      <div className={styles.content}>{renderContent()}</div>

      <div className={styles.footer}>
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary">Cancel</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={isBorrowButtonDisabled()}
              isFluid
            >
              Borrow
            </HoneyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowForm;
