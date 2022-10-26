import React from 'react';
import * as styles from './NoMobilePopup.css';

const NoMobilePopup = () => {
  return (
    <div className={styles.secPopup}>
      <div className={styles.secPopupContainer}>
        <div className={styles.secPopupLogo}>
          <div className={styles.secPopupLogoIcon} />
          Honey Finance
        </div>

        <h1 className={styles.secPopupTitle}>
          Honey Finance is not available on mobile devices right now. Please use
          a desktop
        </h1>
      </div>
    </div>
  );
};

export default NoMobilePopup;
