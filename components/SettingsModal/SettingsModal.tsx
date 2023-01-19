import { Space } from 'antd';
import HoneyCardYellowShadow from 'components/HoneyCardYellowShadow/HoneyCardYellowShadow';
import { HoneySelect } from 'components/HoneySelect/HoneySelect';
import ModalContainer from 'components/ModalContainer/ModalContainer';
import { useTheme } from 'degen';
import { HoneyThemeContext } from 'pages/_app';
import React, { useContext } from 'react';
import * as styles from './SettingsModal.css';

const SettingsModal = (props: { visible: boolean; onClose: Function }) => {
  // const { network, setNetwork } = useHoneyNetwork();
  const { theme, setTheme } = useContext(HoneyThemeContext);
  const degenTheme = useTheme();
  return (
    <ModalContainer isVisible={props.visible} onClose={props.onClose}>
      <HoneyCardYellowShadow>
        <Space direction="vertical" className={styles.settingsModalContent}>
          <h2>Settings</h2>
          <div className={styles.divider} />
          <Space className={styles.row}>
            <div>Select chain</div>
            <HoneySelect
              options={[
                { value: 'polygon', label: 'Testnet' },
                { value: 'solana', label: 'Solana' }
              ]}
              defaultValue="solana"
            />
          </Space>
          <Space className={styles.row}>
            <div>Select network</div>
            <HoneySelect
              options={[
                { value: 'mainnet', label: 'Mainnet' },
                { value: 'devnet', label: 'Devnet' }
              ]}
              defaultValue={'devnet'}
              onChange={value => {}}
            />
          </Space>
          <Space className={styles.row}>
            <div>Language</div>
            <HoneySelect
              options={[{ value: 'en', label: 'EN' }]}
              defaultValue="en"
            />
          </Space>
          <Space className={styles.row}>
            <div>Mode</div>
            <HoneySelect
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'dusk', label: 'Dusk' }
              ]}
              defaultValue={theme}
              onChange={value => {
                setTheme(value);
                degenTheme.setMode(
                  ['dark', 'dusk'].includes(theme) ? 'dark' : 'light'
                );
              }}
            />
          </Space>
        </Space>
      </HoneyCardYellowShadow>
    </ModalContainer>
  );
};

export default SettingsModal;
