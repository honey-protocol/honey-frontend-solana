import * as styles from './Header.css';
import { FC } from 'react';

const Header: FC = () => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.logo} />
      <div>Borrow status</div>
      <div>Wallet section</div>
    </div>
  );
};

export default Header;
