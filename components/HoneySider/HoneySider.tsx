import React, { useEffect } from 'react';
import * as styles from './HoneySider.css';
import c from 'classnames';
import { HoneySiderProps } from './types';

const HoneySider = ({ isMobileSidebarVisible, children }: HoneySiderProps) => {
  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  });

  const isSticky = () => {
    const height = document.querySelector('.hasNoSider');
    const sidebar = document.querySelector('.sidebar');
    const scrollTop = window.scrollY;

    if (height != null) {
      if (sidebar != null) {
        scrollTop >= height.clientHeight + 12
          ? sidebar.classList.add('is-sticky')
          : sidebar.classList.remove('is-sticky');
      }
    } else {
      if (sidebar != null) {
        scrollTop >= 12
          ? sidebar.classList.add('is-sticky')
          : sidebar.classList.remove('is-sticky');
      }
    }
  };

  return (
    <div
      className={c(styles.honeySider, 'sidebar', {
        [styles.isVisible]: isMobileSidebarVisible
      })}
    >
      {children}
    </div>
  );
};

export default HoneySider;
