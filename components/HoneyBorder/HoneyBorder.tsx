import React from 'react';
import * as styles from './HoneyBorder.css';
import { CurrentBidProps } from './types';
import c from 'classnames';

const HoneyBorder = (props: CurrentBidProps) => {
  const { children, className } = props;
  return (
    <div className={c(styles.border, className)}>
      {children}
    </div>
  );
};

export default HoneyBorder;