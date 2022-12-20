import React, { useEffect, useState } from 'react';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet } from '@saberhq/use-solana';

import CreateProposalTab from './CreateProposalTab/CreateProposalTab';
import HowItWorksTab from './HowItWorksTab/HowItWorksTab';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';

import * as styles from './NewProposalSidebar.css';
import { mobileReturnButton } from 'styles/common.css';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'How it works', key: 'how_it_works' },
  { label: 'Create', key: 'create' }
];

type Tab = 'how_it_works' | 'create';

const NewProposalSidebar = (props: { onCancel: Function }) => {
  const [hasReadHowItWorks, setHasReadHowItWorks] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();

  useEffect(() => {
    if (activeTab === 'how_it_works') return;
    const savedHasUserReadHowItWorks =
      window.localStorage.getItem('hasReadHowItWorks');
    console.log('here', activeTab);
    if (savedHasUserReadHowItWorks) {
      setHasReadHowItWorks(JSON.parse(savedHasUserReadHowItWorks));
      setActiveTab('create');
    } else {
      setActiveTab('how_it_works');
    }
  }, [activeTab]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  if (!activeTab) return null;
  return (
    <div className={styles.newProposalSidebar}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={true}
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
                onClick: () => props.onCancel(),
                variant: 'secondary',
                className: mobileReturnButton
              }
            ]}
          />
        ) : (
          <>
            {activeTab === 'how_it_works' && (
              <HowItWorksTab
                hasReadHowItWorks={hasReadHowItWorks}
                setHasReadHowItWorks={setHasReadHowItWorks}
                setActiveTab={setActiveTab}
                onCancel={props.onCancel}
              />
            )}
            {activeTab === 'create' && (
              <CreateProposalTab onCancel={props.onCancel} />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default NewProposalSidebar;
