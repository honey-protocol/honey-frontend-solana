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
        const buffer = 24;
        scrollTop <= height.clientHeight + buffer
          ? sidebar.classList.remove('is-sticky')
          : sidebar.classList.add('is-sticky');
      }
    } else {
      if (sidebar != null) {
        const buffer = 12;
        scrollTop >= buffer
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
