import { ChangeEvent, FC } from 'react';
import * as styles from './InputsBlock.css';
import Image from 'next/image';
import EqualIcon from './assets/equalIcon.svg';
import SOLIcon from './assets/SOL.svg';
import { formatNumber } from '../../helpers/format';

interface InputsBlockProps {
  valueUSD: number | undefined;
  valueSOL: number | undefined;
  onChangeUSD: (value: number | undefined) => void;
  onChangeSOL: (value: number | undefined) => void;
  maxValue?: number;
}

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

export const InputsBlock: FC<InputsBlockProps> = ({
  valueUSD,
  valueSOL,
  onChangeUSD,
  onChangeSOL,
  maxValue = Infinity
}) => {
  const isValidNumericInput = (value: string) => {
    return Number.isFinite(Number(value));
  };

  const handleUsdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isValidNumericInput(value) && value !== '') {
      onChangeUSD(Math.min(parseFloat(value), maxValue));
    } else {
      onChangeUSD(undefined);
    }
  };

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isValidNumericInput(value) && value !== '') {
      onChangeSOL(parseFloat(value));
    } else {
      onChangeSOL(undefined);
    }
  };

  return (
    <div className={styles.inputsBlockContainer}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          placeholder="0.00"
          value={valueUSD}
          onChange={handleUsdChange}
        />
        <div className={styles.inputAddon}>USD</div>
      </div>
      <div className={styles.equalSignContainer}>
        <Image src={EqualIcon} />
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          placeholder="0.00"
          value={valueSOL}
          onChange={handleTokenChange}
        />
        <div className={styles.inputAddon}>
          <Image src={SOLIcon} /> <span className={styles.tokenName}>SOL</span>
        </div>
      </div>
    </div>
  );
};
