import { FC, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { Range } from '../Range/Range';
import * as styles from './BidForm.css';
import { formatNumber } from '../../helpers/format';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';

type BidsFormsProps = {};

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const BidForm: FC<BidsFormsProps> = () => {
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUSDC, setValueUSDC] = useState<number>();
  const [rangeValue, setRangeValue] = useState(0);

  // Put your validators here
  const isSubmitButtonDisabled = () => {
    return false;
  };

  return (
    <div className={styles.depositForm}>
      <div className={styles.content}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              <Image src={mockNftImage} />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>Doodles</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock value={fu(10)} valueSize="big" title="Highest bid" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock title="Minimal bid" value={fp(20)} valueSize="big" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fp(80)}
              valueSize="big"
              title="Your USDC balance"
            />
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
          maxValue={2000}
          borrowedValue={0}
          onChange={setRangeValue}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary">Cancel</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={isSubmitButtonDisabled()}
              isFluid={true}
              usdcValue={valueUSD || 0}
              usdcAmount={valueUSDC || 0}
            >
              Place Bid
            </HoneyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidForm;
