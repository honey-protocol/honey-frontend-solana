import * as styles from './Header.css';
import { FC } from 'react';
import { Button, Space, Typography } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import HeaderStats from 'components/HeaderStats/HeaderStats';
import HeaderDropdownMenu from 'components/HeaderDropdownMenu/HeaderDropdownMenu';
import WalletMenu from 'components/WalletMenu/WalletMenu';
import { WalletIcon } from 'icons/WalletIcon';

const Header: FC = () => {
  const wallet = true;
  return (
    <Space className={styles.headerContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.logo} />
        <HeaderDropdownMenu />
      </div>

      <HeaderStats />

      {wallet ? (
        <WalletMenu />
      ) : (
        <Button
          shape="round"
          type="primary"
          icon={<WalletIcon />}
          className={styles.walletBtn}
        >
          <Typography.Text>CONNECT WALLET</Typography.Text>
        </Button>
      )}
    </Space>
  );
};

export default Header;
