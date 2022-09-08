import React, { useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import BorrowForm from '../BorrowForm/BorrowForm';
import { Image, Tabs, Typography } from 'antd';
import RepayForm from '../RepayForm/RepayForm';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import classNames from 'classnames';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';

const items = [
  { label: 'Borrow', key: 'borrow', children: 'Borrow' },
  { label: 'Repay', key: 'repay', children: 'Repay' }
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
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a NFT collection"
            btnTitle="CONNECT WALLET"
          />
        ) : !collectionId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (
          <>
            {activeTab === 'borrow' && <BorrowForm />}
            {activeTab === 'repay' && <RepayForm />}
          </>
        )}
      </div>
    </div>
  );
};

export default MarketsSidebar;
