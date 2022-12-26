import React, { useState } from 'react';
import * as styles from './GetVeHoneySidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import LockHoneyForm from './LockHoneyForm/LockHoneyForm';
import BurnNftsForm from './BurnNftsForm/BurnNftsForm';
import ClaimRewards from './ClaimRewards/ClaimRewards';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';
import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import PHoneyToHoney from './StakePHoney/PHoneyToHoney';
import PHoneyToVeHoney from './StakePHoney/PHoneyToVeHoney';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Lock Honey', key: 'lock_honey' },
  { label: 'Burn Nfts', key: 'burn_nfts' }
];

type Tab = 'lock_honey' | 'burn_nfts';

const GetVeHoneySidebar = (props: { onCancel: Function }) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('lock_honey');
  const [lockHoneyMode, setLockHoneyMode] = useState('lock_honey');
  const [burnNftMode, setBurnNftMode] = useState('burn_nfts');

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
              <div className={styles.container}>
                <div className={styles.secTabsContainer}>
                  <HoneyButtonTabs
                    items={[
                      {
                        name: (
                          <>
                            <div>Honey</div>↓<div>veHoney</div>
                          </>
                        ),
                        slug: 'lock_honey'
                      },
                      {
                        name: (
                          <>
                            <div>pHoney</div>↓<div>Honey</div>
                          </>
                        ),
                        slug: 'pHoneyToHoney'
                      },
                      {
                        name: (
                          <>
                            <div>pHoney</div>↓<div>veHoney</div>
                          </>
                        ),
                        slug: 'stake_pHoney'
                      }
                    ]}
                    activeItemSlug={lockHoneyMode}
                    isFullWidth
                    onClick={setLockHoneyMode}
                  />
                </div>
                <div className={styles.formContainer}>
                  {lockHoneyMode === 'lock_honey' ? (
                    <LockHoneyForm onCancel={props.onCancel} />
                  ) : lockHoneyMode === 'pHoneyToHoney' ? (
                    <PHoneyToHoney onCancel={props.onCancel} />
                  ) : (
                    <PHoneyToVeHoney onCancel={props.onCancel} />
                  )}
                </div>
              </div>
            )}
            {activeTab === 'burn_nfts' && (
              <div className={styles.container}>
                <div className={styles.secTabsContainer}>
                  <HoneyButtonTabs
                    items={[
                      { name: 'Burn Nfts', slug: 'burn_nfts' },
                      { name: 'Claim Rewards', slug: 'claim_rewards' }
                    ]}
                    activeItemSlug={burnNftMode}
                    isFullWidth
                    onClick={setBurnNftMode}
                  />
                </div>
                <div className={styles.formContainer}>
                  {burnNftMode == 'burn_nfts' ? (
                    <BurnNftsForm onCancel={props.onCancel} />
                  ) : (
                    <ClaimRewards onCancel={props.onCancel} />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default GetVeHoneySidebar;
