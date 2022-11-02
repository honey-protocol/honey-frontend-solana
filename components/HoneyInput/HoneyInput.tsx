import { HoneyInputProps } from './types';
import * as styles from './HoneyInput.css';
import { FC } from 'react';
import { Input } from 'antd';
import c from 'classnames';

export const HoneyInput: FC<HoneyInputProps> = props => {
  const { className, ...rest } = props;
  return <Input {...rest} className={c(className, styles.input)} />;
};
