import * as styles from './Header.css';
import { FC } from 'react';
import { Space } from 'antd';
import HeaderLinks from 'components/HeaderLinks/HeaderLinks';
import WalletMenu from 'components/WalletMenu/WalletMenu';
import HoneyCardYellowShadow from '../HoneyCardYellowShadow/HoneyCardYellowShadow';

const Header: FC = () => {
  const wallet = true;
  return (
    <div className={styles.headerContainer}>
      <HoneyCardYellowShadow>
        <Space className={styles.content}>
          <Space size="small">
            <div className={styles.menuToggle} />
            <div className={styles.logo} />
          </Space>
          <HeaderLinks />
          <WalletMenu />
        </Space>
      </HoneyCardYellowShadow>
    </div>
  );
};

export default Header;
