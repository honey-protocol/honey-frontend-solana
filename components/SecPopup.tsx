import React from 'react';
import HoneyButton from './HoneyButton/HoneyButton';
import * as styles from './SecPopup.css';

const SecPopup = (props: { setShowPopup: Function }) => {
  const onAgree = () => {
    localStorage.setItem('caution-agreed', 'true');
    props.setShowPopup(false);
  };
  return (
    <div className={styles.secPopup}>
      <div className={styles.secPopupContainer}>
        <div className={styles.secPopupLogo}>
          <div className={styles.secPopupLogoIcon} />
          Honey Finance
        </div>

        <h1 className={styles.secPopupTitle}>
          Honey Finance is unavailable to residents and citizens of the United
          States of America.
        </h1>

        <p className={styles.secPopupText}>
          Please take caution when using honey.finance and other defi products.
          Persons accessing the website need to be aware that they are
          responsible for themselves for the compliance with all local rules and
          regulations
        </p>

        <div className={styles.secPopupButton}>
          <HoneyButton onClick={onAgree}>
            I understand, proceed to the app
          </HoneyButton>
        </div>
      </div>
    </div>
  );
};

export default SecPopup;
