import React, { useState } from 'react';
import * as styles from './LendSidebar.css';
import { LendSidebarProps } from './types';
import { Tabs, Typography } from 'antd';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import classNames from 'classnames';
import DepositForm from '../DepositForm/DepositForm';
import WithdrawForm from '../WithdrawForm/WithdrawForm';

const items = [
  { label: 'Deposit', key: 'deposit', children: 'Deposit' },
  { label: 'Withdraw', key: 'withdraw', children: 'Withdraw' }
];

const { Text } = Typography;

type Tab = 'deposit' | 'withdraw';

const LendSidebar = (props: LendSidebarProps) => {
  const wallet = true;
  const { collectionId } = props;
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.lendSidebarContainer}>
      <div className={styles.tabs}>
        <Tabs onChange={handleTabChange}>
          {items.map(tabInfo => {
            return <Tabs.TabPane tab={tabInfo.label} key={tabInfo.key} />;
          })}
        </Tabs>
      </div>
      <div
        className={classNames(
          styles.content,
          collectionId ? styles.active : styles.inactive
        )}
      >
        {!wallet ? (
          <div className={styles.emptyStateContent}>
            <div className={styles.lightIcon} />
            <Text className={styles.emptyStateTitle}>
              You didn’t connect any wallet yet
            </Text>
            <Text type="secondary" className={styles.emptyStateDescription}>
              First, choose a NFT collection
            </Text>
            <HoneyButton type="primary" className={styles.emptyStateWalletBtn}>
              CONNECT WALLET
            </HoneyButton>
          </div>
        ) : !collectionId ? (
          <div className={styles.emptyStateContent}>
            <div className={styles.boltIcon} />
            <Text className={styles.emptyStateTitle}>Manage panel</Text>
            <Text type="secondary" className={styles.emptyStateDescription}>
              First, choose a NFT collection
            </Text>
          </div>
        ) : (
          <>
            {activeTab === 'deposit' && <DepositForm />}
            {activeTab === 'withdraw' && <WithdrawForm />}
          </>
        )}
      </div>
    </div>
  );
};

export default LendSidebar;
