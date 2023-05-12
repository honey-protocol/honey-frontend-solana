import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyButton.css';
import c from 'classnames';
import { isNil } from '../../helpers/utils';
import { formatNumber } from '../../helpers/format';

export interface HoneyButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'textSecondary';
  tokenAmount?: number;
  tokenName?: string;
  usdcValue?: number;
  textRight?: string;
}
const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const HoneyButton = (props: HoneyButtonProps) => {
  const {
    tokenAmount,
    tokenName,
    usdcValue,
    className,
    children,
    disabled,
    variant,
    textRight,
    ...rest
  } = props;

  const isButtonWithValues = !isNil(tokenAmount) || !isNil(usdcValue);
  return (
    <Button
      {...rest}
      disabled={disabled}
      className={c(
        styles.honeyButton,
        variant ? styles[variant] : styles['primary'],
        {
          [styles.disabled]: disabled,
          [styles.withValues]: isButtonWithValues || textRight
        },
        className
      )}
    >
      {props.children}

      {(textRight || isButtonWithValues) && (
        <div
          className={c({
            [styles.valueContainer]: isButtonWithValues,
            [styles.valueContainerTextRight]: textRight
          })}
        >
          {isButtonWithValues && (
            <>
              <span className={styles.usdcAmount}>
                {tokenName ? tokenName : 'SOL'} {f(tokenAmount)}
              </span>
              <span className={styles.usdcValue}>{fu(usdcValue)}</span>
            </>
          )}

          {textRight && <span className={styles.textRight}>{textRight}</span>}
        </div>
      )}
    </Button>
  );
};

export default HoneyButton;
