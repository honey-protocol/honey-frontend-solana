import { Dropdown, Menu, MenuProps, Select, Space, Typography } from 'antd';
import React, { useContext, useState } from 'react';
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
import { SettingsIcon } from 'icons/SettingsIcon';
import cs from 'classnames';
import { useTheme } from 'degen';
import { SunlightIcon } from 'icons/SunlightIcon';
import { PolygonIcon } from 'icons/PolygonIcon';
import { SolanaCircleIcon } from 'icons/SolanaCircleIcon';
import { NightIcon } from 'icons/NightIcon';
import { DuskIcon } from 'icons/DuskIcon';
const { Title } = Typography;

const WalletMenu = () => {
  const { disconnect } = useSolana();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const walletAddress = wallet?.publicKey.toString();
  const { theme, setTheme } = useContext(HoneyThemeContext);
  const { setMode } = useTheme();

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

  const settingsMenu = (
    <Menu selectable className={styles.userMenu}>
      <Space
        direction="vertical"
        className={styles.settingsModalContent}
        size="middle"
      >
        <Space className={styles.row}>
          <div className={styles.settingTitle}>Select chain</div>
          <Select
            value="solana"
            options={[
              {
                value: 'solana',
                label: (
                  <Space align="center">
                    <SolanaCircleIcon />
                    <span>Solana</span>
                  </Space>
                )
              },
              {
                value: 'polygon',
                label: (
                  <Space align="center">
                    <PolygonIcon />
                    <span>Polygon</span>
                  </Space>
                )
              }
            ]}
            defaultValue="solana"
            onChange={value => {
              if (value === 'polygon') {
                window.open('https://evm-redesign.vercel.app/borrow');
              }
            }}
            className={styles.dropdownSelect}
            dropdownClassName={styles.selectDropdownList}
            suffixIcon={
              <DownIcon
                fill={['dark', 'dusk'].includes(theme) ? 'gray' : 'black'}
              />
            }
          />
        </Space>
        <Space className={styles.row}>
          <div className={styles.settingTitle}>Select network</div>
          <Select
            options={[
              { value: 'mainnet', label: 'Mainnet' },
              { value: 'devnet', label: 'Devnet' }
            ]}
            defaultValue="mainnet"
            onChange={value => {}}
            className={styles.dropdownSelect}
            dropdownClassName={styles.selectDropdownList}
            suffixIcon={
              <DownIcon
                fill={['dark', 'dusk'].includes(theme) ? 'gray' : 'black'}
              />
            }
          />
        </Space>
        <Space className={styles.row}>
          <div className={styles.settingTitle}>Language</div>
          <Select
            options={[{ value: 'en', label: 'EN' }]}
            defaultValue="en"
            className={styles.dropdownSelect}
            dropdownClassName={styles.selectDropdownList}
            suffixIcon={
              <DownIcon
                fill={['dark', 'dusk'].includes(theme) ? 'gray' : 'black'}
              />
            }
          />
        </Space>
        <Space className={styles.row}>
          <div className={styles.settingTitle}>Mode</div>
          <Select
            options={[
              {
                value: 'light',
                label: (
                  <Space>
                    <SunlightIcon
                      fill={
                        ['dusk', 'dark'].includes(theme) ? 'white' : 'black'
                      }
                    />
                    Day
                  </Space>
                )
              },
              {
                value: 'dusk',
                label: (
                  <Space>
                    <DuskIcon
                      fill={
                        ['dusk', 'dark'].includes(theme) ? 'white' : 'black'
                      }
                    />
                    Dusk
                  </Space>
                )
              },
              {
                value: 'dark',
                label: (
                  <Space>
                    <NightIcon
                      fill={
                        ['dusk', 'dark'].includes(theme) ? 'white' : 'black'
                      }
                    />
                    Night
                  </Space>
                )
              }
            ]}
            defaultValue={theme}
            className={styles.dropdownSelect}
            dropdownClassName={styles.selectDropdownList}
            suffixIcon={
              <DownIcon
                fill={['dark', 'dusk'].includes(theme) ? 'gray' : 'black'}
              />
            }
            onChange={value => {
              setTheme(value);
              setMode(['dark', 'dusk'].includes(theme) ? 'dark' : 'light');
            }}
          />
        </Space>
      </Space>
    </Menu>
  );
  return !walletAddress ? (
    <Space size="small">
      <Dropdown
        placement="bottomRight"
        overlay={settingsMenu}
        className={cs(styles.settingsDropdown, styles.mr5)}
      >
        <a onClick={e => e.preventDefault()}>
          <SettingsIcon />
        </a>
      </Dropdown>
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
        <Dropdown
          placement="bottomRight"
          overlay={settingsMenu}
          className={styles.settingsDropdown}
        >
          <a onClick={e => e.preventDefault()}>
            <SettingsIcon />
          </a>
        </Dropdown>
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
