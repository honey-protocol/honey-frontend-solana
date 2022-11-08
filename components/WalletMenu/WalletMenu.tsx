import { Dropdown, Menu, Space, Typography } from 'antd';
import React from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/addressUtils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { DialectNotifications } from 'components/DialectNotifications/DialectNotifications';

const { Title } = Typography;

const isDialectNotificationsButtonEnabled = false;

const WalletMenu = () => {
  const { disconnect } = useSolana();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const walletAddress = wallet?.publicKey.toString();

  function handleClick(e: any) {
    if (e.key == '4') disconnect();
  }

  const menu = (
    <Menu
      onClick={handleClick}
      selectable
      items={[
        {
          key: '4',
          label: 'Disconnect'
        }
      ]}
    />
  );
  return !walletAddress ? (
    <HoneyButton variant="primary" icon={<WalletIcon />} onClick={connect}>
      CONNECT WALLET
    </HoneyButton>
  ) : (
    <div className={styles.walletDropdownWrapper}>
      <div className={styles.dialectIconWrapper}>
        {isDialectNotificationsButtonEnabled && <DialectNotifications />}
      </div>
      <Dropdown overlay={menu}>
        <a onClick={e => e.preventDefault()}>
          <Space size="small" align="center">
            <div className={styles.userIcon} />
            <Space size={0} direction="vertical">
              <Title level={4} className={styles.title}>
                {formatAddress(walletAddress)}
              </Title>
            </Space>
            <DownIcon />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default WalletMenu;
