import React, { ReactNode } from 'react';
import * as styles from './HoneyCardYellowShadow.css';

const HoneyCardYellowShadow = (props: { children: ReactNode }) => (
  <div className={styles.card}>{props.children}</div>
);

export default HoneyCardYellowShadow;
