import React, { useState } from 'react';
import * as styles from './GovernanceSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import VoteForm from './VoteForm/VoteForm';
import GovernanceDescription from './GovernanceDescription/GovernanceDescription';
import { governanceSidebar } from './GovernanceSidebar.css';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { ProposalInfo, useProposal } from 'hooks/tribeca/useProposals';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';

type GovernanceSidebarProps = {
  selectedProposalId?: number;
  setSidebarMode: Function;
  onCancel: Function;
};

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Vote', key: 'vote' },
  { label: 'Description', key: 'description' }
];

type Tab = 'vote' | 'description';

const GovernanceSidebar = ({
  selectedProposalId,
  setSidebarMode,
  onCancel
}: GovernanceSidebarProps) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('vote');
  const { info: proposalInfo } = useProposal(
    parseInt(selectedProposalId?.toString() || '')
  );

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.governanceSidebar}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(selectedProposalId?.toString())}
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
        ) : !selectedProposalId?.toString() ? (
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
                description={
                  proposalInfo?.proposalMetaData?.descriptionLink || ''
                }
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
