import React, { ReactNode } from 'react';
import * as styles from './HoneySider.css';
import c from 'classnames';

export interface HoneySiderProps {
  children: ReactNode;
  isMobileSidebarVisible?: boolean;
}

const HoneySider = ({ isMobileSidebarVisible, children }: HoneySiderProps) => {
  return (
    <div
      className={c(styles.honeySider, {
        [styles.honeySiderShow]: isMobileSidebarVisible
      })}
    >
      {children}
    </div>
  );
};

export default HoneySider;
