import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyButton.css';
import c from 'classnames';
import { isNil } from '../../helpers/utils';
import { formatNumber } from '../../helpers/format';

interface HoneyButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'textSecondary';
  isFluid?: boolean;
  solAmount?: number;
  usdcValue?: number;
}
const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const HoneyButton: FC<HoneyButtonProps> = props => {
  const {
    solAmount,
    usdcValue,
    className,
    children,
    disabled,
    variant,
    isFluid,
    ...rest
  } = props;

  const isButtonWithValues = !isNil(solAmount) || !isNil(usdcValue);
  return (
    <Button
      {...rest}
      disabled={disabled}
      className={c(
        styles.honeyButton,
        variant ? styles[variant] : styles['primary'],
        { [styles.disabled]: disabled, [styles.fluid]: isFluid },
        className
      )}
    >
      {props.children}

      {isButtonWithValues && (
        <div className={styles.valueContainer}>
          <span className={styles.usdcAmount}>SOL {f(solAmount)}</span>
          <span className={styles.usdcValue}>{fu(usdcValue)}</span>
        </div>
      )}
    </Button>
  );
};

export default HoneyButton;
