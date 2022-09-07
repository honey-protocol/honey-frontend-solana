import React, { ReactNode } from 'react';
import * as styles from './HexaBoxContainer.css';

interface HexaBoxContainerProps {
  children: ReactNode;
}

const HexaBoxContainer = (props: HexaBoxContainerProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.shadow} />
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default HexaBoxContainer;
