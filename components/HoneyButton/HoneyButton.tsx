import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyButton.css';
import c from 'classnames';

interface HoneyButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text';
  isFluid?: boolean;
}

const HoneyButton: FC<HoneyButtonProps> = props => {
  const { className, children, disabled, variant, isFluid, ...rest } = props;
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
    </Button>
  );
};

export default HoneyButton;
