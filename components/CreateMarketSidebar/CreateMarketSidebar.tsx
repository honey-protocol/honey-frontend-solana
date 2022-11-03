import React, { FC, useState } from 'react';
import * as styles from './CreateMarketSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import HowItWorksBorrowTab from '../HowItWorksBorrowTab/HowItWorksBorrowTab';
import { CreateMarketSidebarProps } from './types';
import { noop } from 'lodash';
import CreateMarketTab from './CreateMarketTab/CreateMarketTab';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'How it works', key: 'how_it_works' },
  { label: 'Create', key: 'create' }
];
type Tab = 'how_it_works' | 'create';

// I think it is a good place to send to collect data from all steps and send transactions
// CreateMarketTab contains all steps and can pass all data in onSave prop
const CreateMarketSidebar: FC<CreateMarketSidebarProps> = (
  props: CreateMarketSidebarProps
) => {
  const { onCancel, wallet, honeyClient } = props;
  const [activeTab, setActiveTab] = useState<Tab>('how_it_works');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  return (
    <div className={styles.createMarketSidebar}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={true}
      >
        {!wallet ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a proposal"
          />
        ) : (
          <>
            {activeTab === 'how_it_works' && (
              <HowItWorksBorrowTab onCancel={onCancel} />
            )}
            {activeTab === 'create' && (
              <CreateMarketTab wallet={wallet} honeyClient={honeyClient} />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default CreateMarketSidebar;
