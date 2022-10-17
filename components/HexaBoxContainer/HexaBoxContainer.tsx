import React, { ReactNode } from 'react';
import * as styles from './HexaBoxContainer.css';
import c from 'classnames';
import { vars } from '../../styles/theme.css';

interface HexaBoxContainerProps {
  borderColor?: 'black' | 'gray' | 'green' | 'red' | 'brownLight';
  shadowColor?: 'black' | 'gray' | 'green' | 'red' | 'brownLight';
  children: ReactNode;
}

const HexaBoxContainer = (props: HexaBoxContainerProps) => {
  return (
    <div className={styles.container}>
      <div
        className={c(
          styles.shadow,
          props.shadowColor
            ? styles[props.shadowColor]
            : props.borderColor
            ? styles[props.borderColor]
            : styles.black
        )}
      />
      <div
        className={c(
          styles.content,
          props.borderColor ? styles[props.borderColor] : styles.black
        )}
      >
        <div className={styles.white}>{props.children}</div>
      </div>
    </div>
  );
};

export default HexaBoxContainer;
