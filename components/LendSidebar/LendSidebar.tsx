import React, { useState } from 'react';
import * as styles from './LendSidebar.css';
import { LendSidebarProps } from './types';
import { Tabs, Typography } from 'antd';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import classNames from 'classnames';
import DepositForm from '../DepositForm/DepositForm';
import WithdrawForm from '../WithdrawForm/WithdrawForm';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Deposit', key: 'deposit' },
  { label: 'Withdraw', key: 'withdraw' }
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
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(collectionId)}
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
      </HoneyTabs>
    </div>
  );
};

export default LendSidebar;
