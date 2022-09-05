import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyTable.css';
import c from 'classnames';

const HoneyButton: FC<ButtonProps> = props => {
  const { className, ...rest } = props;
  return <Button {...rest} className={c(styles.honeyButton, className)} />;
};

export default HoneyButton;
