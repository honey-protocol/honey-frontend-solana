import { Select, Space } from 'antd';
import HoneyCardYellowShadow from 'components/HoneyCardYellowShadow/HoneyCardYellowShadow';
import { HoneySelect } from 'components/HoneySelect/HoneySelect';
import ModalContainer from 'components/ModalContainer/ModalContainer';
import { useTheme } from 'degen';
import { DownIcon } from 'icons/DownIcon';
import { DuskIcon } from 'icons/DuskIcon';
import { NightIcon } from 'icons/NightIcon';
import { PolygonIcon } from 'icons/PolygonIcon';
import { SolanaCircleIcon } from 'icons/SolanaCircleIcon';
import { SunlightIcon } from 'icons/SunlightIcon';
import { HoneyThemeContext } from 'pages/_app';
import React, { useContext } from 'react';
import * as styles from './SettingsModal.css';

const SettingsModal = (props: { visible: boolean; onClose: Function }) => {
  const { theme, setTheme } = useContext(HoneyThemeContext);
  const { setMode } = useTheme();
  return (
    <ModalContainer isVisible={props.visible} onClose={props.onClose}>
      <HoneyCardYellowShadow>
        <Space
          direction="vertical"
          size="middle"
          className={styles.settingsModalContent}
        >
          <div className={styles.modalTitle}>Settings</div>

          <div className={styles.divider} />
          <Space className={styles.row} size="large">
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
                      <span>Testnet</span>
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
                { value: 'devnet', label: 'Devnet', disabled: true }
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
      </HoneyCardYellowShadow>
    </ModalContainer>
  );
};

export default SettingsModal;
