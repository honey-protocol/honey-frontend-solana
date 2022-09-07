import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyButton.css';
import c from 'classnames';

interface HoneyButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
}
const HoneyButton: FC<HoneyButtonProps> = props => {
  const { className, children, disabled, variant, ...rest } = props;
  return (
    <Button
      {...rest}
      disabled={disabled}
      className={c(
        styles.honeyButton,
        variant ? styles[variant] : styles.primary,
        disabled && styles.disabled,
        className
      )}
    >
      {props.children}
    </Button>
  );
};

export default HoneyButton;
