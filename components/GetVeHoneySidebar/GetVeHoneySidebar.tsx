import React, { useState } from 'react';
import * as styles from './GetVeHoneySidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import LockHoneyForm from './LockHoneyForm/LockHoneyForm';
import BurnNftsForm from './BurnNftsForm/BurnNftsForm';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Lock Honey', key: 'lock_honey' },
  { label: 'Burn Nfts', key: 'burn_nfts' }
];

type Tab = 'lock_honey' | 'burn_nfts';

const GetVeHoneySidebar = (props: { onCancel: Function }) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('lock_honey');

  const handleTabChange = (tabKey: string) => {
    if (tabKey === 'burn_nfts') return;
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.getVeHoneySidebar}>
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
            {activeTab === 'lock_honey' && (
              <LockHoneyForm onCancel={props.onCancel} />
            )}
            {activeTab === 'burn_nfts' && (
              <BurnNftsForm onCancel={props.onCancel} />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default GetVeHoneySidebar;
