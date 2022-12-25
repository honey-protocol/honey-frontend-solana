import { Dropdown, Menu, MenuProps, Space, Typography } from 'antd';
import React, { useContext } from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/addressUtils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { DialectNotifications } from 'components/DialectNotifications/DialectNotifications';
import { featureFlags } from '../../helpers/featureFlags';
import { vars } from 'styles/theme.css';
import HoneyToggle from 'components/HoneyToggle/HoneyToggle';
import { HoneyThemeContext } from 'pages/_app';
const { Title } = Typography;

const WalletMenu = () => {
  const { disconnect } = useSolana();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const walletAddress = wallet?.publicKey.toString();
  const { theme, setTheme } = useContext(HoneyThemeContext);

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
          label: 'Disconnect',
          onClick: disconnect
        },
        {
          key: '2',
          label: theme === 'dark' ? 'Light theme' : 'Dark theme',
          onClick:
            theme === 'dark' ? () => setTheme('light') : () => setTheme('dark')
        }
      ]}
    />
  );
  return !walletAddress ? (
    <Space size="small">
      <HoneyButton variant="primary" icon={<WalletIcon />} onClick={connect}>
        CONNECT WALLET
      </HoneyButton>
    </Space>
  ) : (
    <div className={styles.walletDropdownWrapper}>
      <div className={styles.dialectIconWrapper}>
        {<DialectNotifications />}
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
            <DownIcon fill={vars.colors.textSecondary} />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default WalletMenu;
