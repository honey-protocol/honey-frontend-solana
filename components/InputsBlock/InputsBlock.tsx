import { ChangeEvent, FC } from 'react';
import * as styles from './InputsBlock.css';
import Image from 'next/image';
import SOLIcon from './assets/SOL.svg';
import { formatNumber } from '../../helpers/format';
import EqualIcon from './assets/equalIcon.svg';

interface InputsBlockProps {
  firstInputValue: number | undefined;
  secondInputValue: number | undefined;
  onChangeFirstInput: (value: number | undefined) => void;
  onChangeSecondInput: (value: number | undefined) => void;
  maxValue?: number;
  delimiterIcon?: string | JSX.Element;
  firstInputAddon?: string | JSX.Element;
  secondInputAddon?: string | JSX.Element;
}

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

export const InputsBlock: FC<InputsBlockProps> = ({
  firstInputValue,
  secondInputValue,
  onChangeFirstInput,
  onChangeSecondInput,
  maxValue = Infinity,
  delimiterIcon = (
    <div className={styles.delimiterIcon}>
      <Image src={EqualIcon} />
    </div>
  ),
  firstInputAddon = (
    <>
      <Image src={SOLIcon} /> <span>SOL</span>
    </>
  ),
  secondInputAddon = <> USD </>
}) => {
  const isValidNumericInput = (value: string) => {
    return Number.isFinite(Number(value));
  };

  const handleUsdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isValidNumericInput(value) && value !== '') {
      onChangeFirstInput(parseFloat(value));
    } else {
      onChangeFirstInput(undefined);
    }
  };

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isValidNumericInput(value) && value !== '') {
      onChangeSecondInput(Number(value) < maxValue ? Number(value) : maxValue);
    } else {
      onChangeSecondInput(undefined);
    }
  };

  return (
    <div className={styles.inputsBlockContainer}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="number"
          placeholder="0.00"
          value={secondInputValue}
          onChange={handleTokenChange}
        />
        <div className={styles.inputAddon}>{firstInputAddon}</div>
      </div>
      <div className={styles.equalSignContainer}>{delimiterIcon}</div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="number"
          placeholder="0.00"
          value={firstInputValue}
          onChange={handleUsdChange}
        />
        <div className={styles.inputAddon}>{secondInputAddon}</div>
      </div>
    </div>
  );
};
