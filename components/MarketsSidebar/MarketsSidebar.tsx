import React, { useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import BorrowForm from '../BorrowForm/BorrowForm';
import { Tabs } from 'antd';
import RepayForm from '../RepayForm/RepayForm';

const items = [
  { label: 'Borrow', key: 'borrow', children: 'Borrow' },
  { label: 'Repay', key: 'repay', children: 'Repay' }
];

type Tab = 'borrow' | 'repay';

const MarketsSidebar = (props: MarketsSidebarProps) => {
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
      <div className={styles.content}>
        {activeTab === 'borrow' && <BorrowForm />}
        {activeTab === 'repay' && <RepayForm />}
      </div>
    </div>
  );
};

export default MarketsSidebar;
