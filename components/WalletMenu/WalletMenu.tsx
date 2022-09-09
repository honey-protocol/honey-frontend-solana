import { Dropdown, Menu, Space, Typography } from 'antd';
import { MetamaskIcon } from 'icons/MetamaskIcon';
import { DownOutlined } from '@ant-design/icons';
import React from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/addressUtils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';

const { Title, Text } = Typography;

const WalletMenu = () => {
  const walletAddress = 'FZXg6PdjCjoz542TT5Tvq97Y9hnpWCLsCqPmfCHSSWYx';
  const menu = (
    <Menu
      selectable
      items={[
        {
          key: '1',
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.antgroup.com"
            >
              Connect different wallet
            </a>
          )
        },
        {
          key: '4',
          label: 'Disconnect'
        }
      ]}
    />
  );
  return !walletAddress ? (
    <HoneyButton variant="primary" icon={<WalletIcon />}>
      CONNECT WALLET
    </HoneyButton>
  ) : (
    <Dropdown overlay={menu}>
      <a onClick={e => e.preventDefault()}>
        <Space size="small" align="center">
          <MetamaskIcon />
          <Space size={0} direction="vertical">
            <Title level={4} className={styles.title}>
              {formatAddress(walletAddress)}
            </Title>
          </Space>
          <DownIcon />
        </Space>
      </a>
    </Dropdown>
  );
};

export default WalletMenu;
