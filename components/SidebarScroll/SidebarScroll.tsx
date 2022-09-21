import React, { FC, ReactNode } from 'react';
import * as styles from './SidebarScroll.css';
import c from 'classnames';

interface SidebarScrollProps {
  children: ReactNode;
  footer?: ReactNode;
}

const SidebarScroll: FC<SidebarScrollProps> = ({ children, footer }) => {
  return (
    <div className={styles.SidebarScroll}>
      <div className={c(styles.content, { [styles.hasFooter]: footer })}>
        {children}
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default SidebarScroll;
