import { ChangeEvent, FC } from 'react';
import * as styles from './InputsBlock.css';
import Image from 'next/image';
import EqualIcon from './assets/equalIcon.svg';
import USDCIcon from './assets/USDC.svg';

interface InputsBlockProps {
  valueUSD: string;
  valueUSDC: string;
  onChangeUSD: (value: string) => void;
  onChangeUSDC: (value: string) => void;
}

export const InputsBlock: FC<InputsBlockProps> = ({
  valueUSD,
  valueUSDC,
  onChangeUSD,
  onChangeUSDC
}) => {
  const isValidNumericInput = (value: string) => {
    return Number.isFinite(Number(value));
  };

  const handleUsdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isValidNumericInput(value)) {
      onChangeUSD(value);
    }
  };

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isValidNumericInput(value)) {
      onChangeUSDC(value);
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
        <div className={styles.inputAddon}>$</div>
      </div>
      <div className={styles.equalSignContainer}>
        <Image src={EqualIcon} />
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          placeholder="0.00"
          value={valueUSDC}
          onChange={handleTokenChange}
        />
        <div className={styles.inputAddon}>
          <Image src={USDCIcon} />{' '}
          <span className={styles.tokenName}>USDC</span>
        </div>
      </div>
    </div>
  );
};
