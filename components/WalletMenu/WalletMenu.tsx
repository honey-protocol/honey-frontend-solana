import { Dropdown, Menu, Space, Typography } from 'antd';
import { MetamaskIcon } from 'icons/MetamaskIcon';
import { DownOutlined } from '@ant-design/icons';
import React from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';

const { Title, Text } = Typography;

const WalletMenu = () => {
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
  return (
    <Dropdown overlay={menu}>
      <a onClick={e => e.preventDefault()}>
        <Space size="middle">
          <MetamaskIcon />
          <Space size={0} direction="vertical">
            <Title level={4} className={styles.title}>
              DDNfaA...z8faTk
            </Title>
            <Text type="secondary" className={styles.caption}>
              Metamask wallet
            </Text>
          </Space>
          <DownIcon />
        </Space>
      </a>
    </Dropdown>
  );
};

export default WalletMenu;
