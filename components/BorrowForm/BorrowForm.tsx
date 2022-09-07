import { FC, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { Range } from '../Range/Range';
import * as styles from './BorrowForm.css';
import { formatNumber } from '../../helpers/format';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';

type BorrowFormProps = {};

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const BorrowForm: FC<BorrowFormProps> = () => {
  const [valueUSD, setValueUSD] = useState('');
  const [valueUSDC, setValueUSDC] = useState('');
  const [rangeValue, setRangeValue] = useState(0);

  // Put your validators here
  const isBorrowButtonDisabled = () => {
    return false;
  };

  return (
    <div className={styles.borrowForm}>
      <div className={styles.content}>
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
      </div>

      <div className={styles.footer}>
        <div className={styles.buttons}>
          <HoneyButton variant="tertiary">Cancel</HoneyButton>
          <HoneyButton variant="primary" disabled={isBorrowButtonDisabled()}>
            Borrow
          </HoneyButton>
        </div>
      </div>
    </div>
  );
};

export default BorrowForm;
