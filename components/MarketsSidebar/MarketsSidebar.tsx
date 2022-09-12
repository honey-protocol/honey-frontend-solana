import React, { useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import BorrowForm from '../BorrowForm/BorrowForm';
import { Image, Tabs, Typography } from 'antd';
import RepayForm from '../RepayForm/RepayForm';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import classNames from 'classnames';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Borrow', key: 'borrow' },
  { label: 'Repay', key: 'repay' }
];

const { Text } = Typography;

type Tab = 'borrow' | 'repay';

const MarketsSidebar = (props: MarketsSidebarProps) => {
  const wallet = true;
  const { collectionId } = props;
  const [activeTab, setActiveTab] = useState<Tab>('borrow');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.marketsSidebarContainer}>
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
            {activeTab === 'borrow' && <BorrowForm />}
            {activeTab === 'repay' && <RepayForm />}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default MarketsSidebar;
