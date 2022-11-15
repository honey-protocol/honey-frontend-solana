import React, { useState } from 'react';
import * as styles from './GetVeHoneySidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import StakePHoney from './StakePHoney/StakePHoney';
import LockHoneyForm from './LockHoneyForm/LockHoneyForm';
import BurnNftsForm from './BurnNftsForm/BurnNftsForm';
import ClaimRewards from './ClaimRewards/ClaimRewards';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';

const items: HoneyTabItem[] = [
  { label: 'Stake pre-Honey', key: 'stake_phoney' },
  { label: 'Lock Honey', key: 'lock_honey' },
  { label: 'Burn Nfts', key: 'burn_nfts' },
  { label: 'Claim Rewards', key: 'claim_rewards' }
];

type Tab = 'stake_phoney' | 'lock_honey' | 'burn_nfts' | 'claim_rewards';

const GetVeHoneySidebar = (props: { onCancel: Function }) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('stake_phoney');

  const handleTabChange = (tabKey: string) => {
    // if (tabKey === 'burn_nfts') return;
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
            {activeTab === 'stake_phoney' && (
              <StakePHoney onCancel={props.onCancel} />
            )}
            {activeTab === 'lock_honey' && (
              <LockHoneyForm onCancel={props.onCancel} />
            )}
            {activeTab === 'burn_nfts' && (
              <BurnNftsForm onCancel={props.onCancel} />
            )}
            {activeTab === 'claim_rewards' && (
              <ClaimRewards onCancel={props.onCancel} />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default GetVeHoneySidebar;
