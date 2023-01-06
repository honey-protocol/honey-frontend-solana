import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useContext } from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/addressUtils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { DialectNotifications } from 'components/DialectNotifications/DialectNotifications';
import { vars } from 'styles/theme.css';
import { HoneyThemeContext } from 'pages/_app';
import { SwitchIcon } from 'icons/SwitchIcon';
import { useTheme } from 'degen';
import SettingsDropdown from 'components/SetttingsDropdown/SetttingsDropdown';
const { Title } = Typography;

const WalletMenu = () => {
  const { disconnect } = useSolana();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const walletAddress = wallet?.publicKey.toString();
  const { theme } = useContext(HoneyThemeContext);

  const menu = (
    <Menu
      selectable
      className={styles.userMenu}
      items={[
        {
          key: '0',
          label: 'Disconnect',
          onClick: disconnect,
          itemIcon: (
            <SwitchIcon
              fill={['dark', 'dusk'].includes(theme) ? 'white' : 'black'}
            />
          )
        }
      ]}
    />
  );

  return !walletAddress ? (
    <Space size="small">
      <SettingsDropdown className={styles.mr5} />
      <HoneyButton variant="primary" icon={<WalletIcon />} onClick={connect}>
        CONNECT WALLET
      </HoneyButton>
    </Space>
  ) : (
    <>
      {/* <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      /> */}
      <div className={styles.walletDropdownWrapper}>
        <SettingsDropdown />
        <div className={styles.dialectIconWrapper}>
          {<DialectNotifications />}
        </div>
        <Dropdown placement="bottomRight" overlay={menu}>
          <a onClick={e => e.preventDefault()}>
            <Space size="small" align="center">
              <div className={styles.userIcon} />
              <Space size={0} direction="vertical">
                <Title level={4} className={styles.title}>
                  {formatAddress(walletAddress)}
                </Title>
              </Space>
              <DownIcon fill={vars.colors.textSecondary} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </>
  );
};

export default WalletMenu;
