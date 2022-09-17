import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyButton.css';
import c from 'classnames';
import { isNil } from '../../helpers/utils';
import { valueContainer } from './HoneyButton.css';

interface HoneyButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'textSecondary';
  isFluid?: boolean;
  usdcAmount?: number;
  usdcValue?: number;
}

const HoneyButton: FC<HoneyButtonProps> = props => {
  const {
    usdcAmount,
    usdcValue,
    className,
    children,
    disabled,
    variant,
    isFluid,
    ...rest 
  } = props;

  const isButtonWithValues = !isNil(usdcAmount) || !isNil(usdcValue);
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
          <span className={styles.usdcAmount}>USDC {usdcAmount}</span>
          <span className={styles.usdcValue}>${usdcValue}</span>
        </div>
      )}
    </Button>
  );
};

export default HoneyButton;
