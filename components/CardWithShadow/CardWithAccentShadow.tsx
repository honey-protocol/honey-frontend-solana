import React, { ReactNode } from 'react';
import * as styles from './CardWithAccentShadow.css';

const CardWithAccentShadow = (props: { children: ReactNode }) => (
  <div className={styles.card}>{props.children}</div>
);

export default CardWithAccentShadow;
