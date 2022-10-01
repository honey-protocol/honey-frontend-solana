import React, { ReactNode } from 'react';
import * as styles from './HexaBoxContainer.css';
import c from "classnames";

interface HexaBoxContainerProps {
  borderColor?: 'black' | 'gray' | 'green' | 'red';
  children: ReactNode;
}

const HexaBoxContainer = (props: HexaBoxContainerProps) => {
  return (
    <div className={styles.container}>
      <div className={c(
          styles.shadow,
          props.borderColor ? styles[props.borderColor] : styles.black,
          )} />
      <div className={c(
          styles.content,
          props.borderColor ? styles[props.borderColor] : styles.black,
      )}>
          <div className={styles.white}>
              {props.children}
          </div>
      </div>
    </div>
  );
};

export default HexaBoxContainer;
