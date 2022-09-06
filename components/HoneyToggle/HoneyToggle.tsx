import { Switch, SwitchProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyToggle.css';
import c from 'classnames';

const HoneyToggle: FC<SwitchProps> = props => {
  const { className, ...rest } = props;
  return <Switch {...rest} size="small" className={c(styles.honeySwitch, className)} />;
};

export default HoneyToggle;
