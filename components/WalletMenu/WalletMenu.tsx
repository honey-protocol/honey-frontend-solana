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
import { vars } from 'styles/theme.css';
import { HoneyThemeContext } from 'pages/_app';
import { SunlightIcon } from 'icons/SunlightIcon';
import { SwitchIcon } from 'icons/SwitchIcon';
import { NightIcon } from 'icons/NightIcon';
import { useTheme } from 'degen';
const { Title } = Typography;

const WalletMenu = () => {
  const { disconnect } = useSolana();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const walletAddress = wallet?.publicKey.toString();
  const { theme, setTheme } = useContext(HoneyThemeContext);
  const degenTheme = useTheme();

  function handleClick(e: any) {
    if (e.key == '4') disconnect();
  }

  const menu = (
    <Menu
      onClick={handleClick}
      selectable
      className={styles.userMenu}
      items={[
        {
          key: '0',
          label: 'Disconnect',
          onClick: disconnect,
          itemIcon: <SwitchIcon fill={theme === 'dark' ? 'white' : 'black'} />
        },
        {
          type: 'divider'
        },
        {
          key: '2',
          label: theme === 'dark' ? 'Light theme' : 'Dark theme',
          onClick: () => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
            degenTheme.setMode(theme === 'dark' ? 'light' : 'dark');
          },
          itemIcon: theme === 'dark' ? <SunlightIcon /> : <NightIcon />
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
  );
};

export default WalletMenu;
