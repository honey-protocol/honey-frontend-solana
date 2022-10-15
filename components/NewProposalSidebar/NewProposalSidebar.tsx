import React, { useEffect, useState } from 'react';
import * as styles from './NewProposalSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import CreateProposalTab from './CreateProposalTab/CreateProposalTab';
import HowItWorksTab from './HowItWorksTab/HowItWorksTab';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'How it works', key: 'how_it_works' },
  { label: 'Create', key: 'create' }
];

type Tab = 'how_it_works' | 'create';

const NewProposalSidebar = () => {
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
            btnTitle="CONNECT WALLET"
            onBtnClick={connect}
          />
        ) : (
          <>
            {activeTab === 'how_it_works' && (
              <HowItWorksTab
                hasReadHowItWorks={hasReadHowItWorks}
                setHasReadHowItWorks={setHasReadHowItWorks}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'create' && <CreateProposalTab />}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default NewProposalSidebar;
