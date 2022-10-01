import React, { useState } from 'react';
import * as styles from './NewProposalSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import CreateProposalTab from './CreateProposalTab/CreateProposalTab';
import HowItWorksTab from './HowItWorksTab/HowItWorksTab';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'How it works', key: 'how_it_works' },
  { label: 'Create', key: 'create' }
];

type Tab = 'how_it_works' | 'create';

const NewProposalSidebar = () => {
  const [activeTab, setActiveTab] = useState<Tab>('how_it_works');
  const wallet = true;

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.newProposalSidebar}>
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
            btnTitle="CONNECT WALLET"
          />
        ) : (
          <>
            {activeTab === 'how_it_works' && <HowItWorksTab />}
            {activeTab === 'create' && <CreateProposalTab />}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default NewProposalSidebar;
