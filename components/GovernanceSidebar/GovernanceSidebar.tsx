import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';

import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import VoteForm from './VoteForm/VoteForm';
import GovernanceDescription from './GovernanceDescription/GovernanceDescription';
import { useProposalWithKey } from '../../hooks/useVeHoney';

import * as styles from './GovernanceSidebar.css';
import { mobileReturnButton } from '../../styles/common.css';

type GovernanceSidebarProps = {
  selectedProposalKey: PublicKey;
  setSidebarMode: Function;
  onCancel: Function;
};

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Vote', key: 'vote' },
  { label: 'Description', key: 'description' }
];

type Tab = 'vote' | 'description';

const GovernanceSidebar = ({
  selectedProposalKey,
  setSidebarMode,
  onCancel
}: GovernanceSidebarProps) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('vote');
  const { proposalInfo } = useProposalWithKey(selectedProposalKey);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  return (
    <div className={styles.governanceSidebar}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(proposalInfo?.data.index.toString())}
      >
        {!wallet?.connected ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a proposal"
            buttons={[
              {
                title: 'CONNECT WALLET',
                onClick: connect,
                variant: 'primary'
              },
              {
                title: 'RETURN',
                onClick: () => onCancel(),
                variant: 'secondary',
                className: mobileReturnButton
              }
            ]}
          />
        ) : !proposalInfo?.data.index.toString() ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a proposal"
          />
        ) : (
          <>
            {activeTab === 'vote' && (
              <VoteForm
                setSidebarMode={setSidebarMode}
                proposalInfo={proposalInfo}
                onCancel={onCancel}
              />
            )}
            {activeTab === 'description' && (
              <GovernanceDescription
                description={proposalInfo?.meta?.descriptionLink || ''}
                setActiveTab={setActiveTab}
              />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default GovernanceSidebar;
