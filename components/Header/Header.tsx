import * as styles from './Header.css';
import { FC } from 'react';
import { Space } from 'antd';
import HeaderStats from 'components/HeaderStats/HeaderStats';
import HeaderLinks from 'components/HeaderLinks/HeaderLinks';
import WalletMenu from 'components/WalletMenu/WalletMenu';
import { WalletIcon } from 'icons/WalletIcon';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HoneyCardYellowShadow from '../HoneyCardYellowShadow/HoneyCardYellowShadow';

const Header: FC = () => {
  const wallet = true;
  return (
    <div className={styles.headerContainer}>
      <HoneyCardYellowShadow>
        <Space className={styles.content}>
          <div className={styles.logo} />
          <HeaderLinks />
          <WalletMenu />
        </Space>
      </HoneyCardYellowShadow>
    </div>
  );
};

export default Header;
