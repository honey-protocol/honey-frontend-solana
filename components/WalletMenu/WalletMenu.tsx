import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useState } from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/addressUtils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet } from '@saberhq/use-solana';
import { DialectNotifications } from 'components/DialectNotifications/DialectNotifications';
import { vars } from 'styles/theme.css';
import SettingsModal from 'components/SettingsModal/SettingsModal';
import { SettingsIcon } from 'icons/SettingsIcon';
const { Title } = Typography;

const WalletMenu = (props: { menu: JSX.Element }) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const walletAddress = wallet?.publicKey.toString();

  return !walletAddress ? (
    <Space size="small" className={styles.noAuthWalletMenu}>
      <div
        className={styles.settingsIcon}
        onClick={() => setShowSettingsModal(true)}
      >
        <SettingsIcon />
      </div>
      <HoneyButton
        variant="primary"
        icon={
          <span className={styles.mobileHidden}>
            <WalletIcon />
          </span>
        }
        onClick={connect}
      >
        CONNECT
      </HoneyButton>
    </Space>
  ) : (
    <>
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      <div className={styles.walletDropdownWrapper}>
        <div
          className={styles.settingsIcon}
          onClick={() => setShowSettingsModal(true)}
        >
          <SettingsIcon />
        </div>
        <div className={styles.dialectIconWrapper}>
          {<DialectNotifications />}
        </div>
        <Dropdown
          placement="bottomRight"
          overlay={props.menu}
          className={styles.mobileHidden}
        >
          <a onClick={e => e.preventDefault()}>
            <Space size="small" align="center">
              <div className={styles.userIcon} />
              <Space size="small" direction="horizontal">
                <Title level={4} className={styles.title}>
                  {formatAddress(walletAddress)}
                </Title>
                <DownIcon fill={vars.colors.textSecondary} />
              </Space>
            </Space>
          </a>
        </Dropdown>
      </div>
    </>
  );
};

export default WalletMenu;
