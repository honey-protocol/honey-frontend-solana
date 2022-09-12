import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyButton.css';
import c from 'classnames';

interface HoneyButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text';
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

      {usdcAmount && (
        <div className={styles.rightBlock}>
          <span className={styles.usdcAmount}>USDC {usdcAmount}</span>
          <span className={styles.usdcValue}>${usdcValue}</span>
        </div>
      )}
    </Button>
  );
};

export default HoneyButton;
