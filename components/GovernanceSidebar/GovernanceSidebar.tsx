import React, { useState } from 'react';
import * as styles from './GovernanceSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import VoteForm from './VoteForm/VoteForm';
import GovernanceDescription from './GovernanceDescription/GovernanceDescription';
import { governanceSidebar } from './GovernanceSidebar.css';

type GovernanceSidebarProps = {
  selectedProposalId?: number;
};

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Vote', key: 'vote' },
  { label: 'Description', key: 'description' }
];

type Tab = 'vote' | 'description';

const GovernanceSidebar = ({ selectedProposalId }: GovernanceSidebarProps) => {
  const wallet = true;
  const [activeTab, setActiveTab] = useState<Tab>('vote');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.governanceSidebar}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(selectedProposalId)}
      >
        {!wallet ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a proposal"
            btnTitle="CONNECT WALLET"
          />
        ) : !selectedProposalId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a proposal"
          />
        ) : (
          <>
            {activeTab === 'vote' && <VoteForm />}
            {activeTab === 'description' && <GovernanceDescription />}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default GovernanceSidebar;
