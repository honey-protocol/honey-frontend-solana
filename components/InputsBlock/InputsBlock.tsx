import { ChangeEvent, FC } from 'react';
import * as styles from './InputsBlock.css';
import Image from 'next/image';
import { formatNumber } from '../../helpers/format';
import EqualIcon from './assets/equalIcon.svg';
import HoneyFormattedNumericInput from '../HoneyFormattedNumericInput/HoneyFormattedInput';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import { isNil } from '../../helpers/utils';
import SOLIcon from './assets/SOLIcon';

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
      <SOLIcon /> <span>SOL</span>
    </>
  ),
  secondInputAddon = <> USD </>
}) => {
  const handleFirstInputChange = (value: ValueType | null) => {
    if (isNil(value)) {
      onChangeFirstInput(undefined);
    } else {
      onChangeFirstInput(Number(value) < maxValue ? Number(value) : maxValue);
    }
  };

  const handleSecondInputChange = (value: ValueType | null) => {
    if (isNil(value)) {
      onChangeSecondInput(undefined);
    } else {
      onChangeSecondInput(Number(value));
    }
  };

  const defaultInputFormatted = (value: ValueType | undefined) => {
    // TODO: pass decimals as props if needed
    return value ? formatNumber.formatTokenInput(String(value), 9) : '';
  };

  return (
    <div className={styles.inputsBlockContainer}>
      <div className={styles.inputWrapper}>
        <HoneyFormattedNumericInput
          className={styles.input}
          placeholder="0.00"
          value={firstInputValue}
          decimalSeparator="."
          formatter={defaultInputFormatted}
          onChange={handleFirstInputChange}
          bordered={false}
        />
        <div className={styles.inputAddon}>{firstInputAddon}</div>
      </div>
      <div className={styles.equalSignContainer}>{delimiterIcon}</div>
      <div className={styles.inputWrapper}>
        <HoneyFormattedNumericInput
          className={styles.input}
          placeholder="0.00"
          value={secondInputValue}
          formatter={defaultInputFormatted}
          decimalSeparator="."
          onChange={handleSecondInputChange}
          bordered={false}
        />
        <div className={styles.inputAddon}>{secondInputAddon}</div>
      </div>
    </div>
  );
};
