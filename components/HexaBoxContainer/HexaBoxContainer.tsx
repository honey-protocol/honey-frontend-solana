import React, { ReactNode } from 'react';
import * as styles from './HexaBoxContainer.css';
import c from "classnames";

interface HexaBoxContainerProps {
  variant?: 'black' | 'gray';
  children: ReactNode;
}

const HexaBoxContainer = (props: HexaBoxContainerProps) => {
  return (
    <div className={styles.container}>
      <div className={c(
          styles.shadow,
          props.variant ? styles[props.variant] : styles.black,
          )} />
      <div className={c(
          styles.content,
          props.variant ? styles[props.variant] : styles.black,
      )}>
          <div className={props.variant ? styles.white : styles.black}>
              {props.children}
          </div>
      </div>
    </div>
  );
};

export default HexaBoxContainer;
