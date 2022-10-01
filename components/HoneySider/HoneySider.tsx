import React, { ReactNode } from 'react';
import * as styles from './HoneySider.css';
import c from 'classnames';

export interface HoneySiderProps {
  children: ReactNode;
  isMobileSidebarVisible?: boolean;
  page?: 'governance';
}

const HoneySider = ({
  isMobileSidebarVisible,
  children,
  page
}: HoneySiderProps) => {
  return (
    <div
      className={c(styles.honeySider, {
        [styles.honeySiderShow]: isMobileSidebarVisible,
        [styles.governancePage]: page === 'governance'
      })}
    >
      {children}
    </div>
  );
};

export default HoneySider;
