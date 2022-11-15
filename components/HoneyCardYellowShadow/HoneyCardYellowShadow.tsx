import React, { FC } from 'react';
import * as styles from './HoneyCardYellowShadow.css';
import { HoneyCardYellowShadowProps } from './types';
import c from 'classnames';

const HoneyCardYellowShadow: FC<HoneyCardYellowShadowProps> = props => {
  return (
    <div
      className={c(styles.card, {
        [styles.noOverflowHidden]: props.isOverflowHiddenDisabled
      })}
    >
      {props.children}
    </div>
  );
};

export default HoneyCardYellowShadow;
