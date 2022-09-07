import * as styles from './Header.css';
import { FC } from 'react';
import { Space } from 'antd';
import HeaderStats from 'components/HeaderStats/HeaderStats';
import HeaderDropdownMenu from 'components/HeaderDropdownMenu/HeaderDropdownMenu';
import WalletMenu from 'components/WalletMenu/WalletMenu';
import { WalletIcon } from 'icons/WalletIcon';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HoneyCardYellowShadow from '../HoneyCardYellowShadow/HoneyCardYellowShadow';

const Header: FC = () => {
  const wallet = false;
  return (
    <div className={styles.headerContainer}>
      <HoneyCardYellowShadow>
        <Space className={styles.content}>
          <div className={styles.leftContainer}>
            <div className={styles.logo} />
            <HeaderDropdownMenu />
          </div>

          <HeaderStats />

          {wallet ? (
            <WalletMenu />
          ) : (
            <HoneyButton variant="primary" icon={<WalletIcon />}>
              CONNECT WALLET
            </HoneyButton>
          )}
        </Space>
      </HoneyCardYellowShadow>
    </div>
  );
};

export default Header;
