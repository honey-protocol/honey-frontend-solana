import React, { FC, useEffect, useMemo, useState } from 'react';
import { useWalletKit } from '@gokiprotocol/walletkit';

import { CreateMarketSidebarProps } from './types';
import CreateMarketTab from './CreateMarketTab/CreateMarketTab';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import HowItWorksBorrowTab from 'components/HowItWorksBorrowTab/HowItWorksBorrowTab';
import { useLocker } from 'hooks/useVeHoney';

import * as styles from './CreateMarketSidebar.css';

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
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('how_it_works');
  const { votingPower } = useLocker();
  const requiredVeHONEY = 25;
  const veHoneyAmount = useMemo(
    () => (votingPower ? votingPower.asNumber : 0),
    [votingPower]
  );

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  const onClickUnderstand = () => {
    setActiveTab('create');
  };

  const [hasReadHowItWorks, setHasReadHowItWorks] = useState<boolean>(false);

  useEffect(() => {
    const hasReadHowItWorks = window.localStorage.getItem(
      'hasReadHowCreateMarketWorks'
    );
    if (hasReadHowItWorks === 'true') {
      setHasReadHowItWorks(JSON.parse(hasReadHowItWorks));
      setActiveTab('create');
    } else {
      setActiveTab('how_it_works');
    }
  }, []);

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
            description="First, connect a wallet"
            buttons={[
              {
                title: 'connect wallet',
                onClick: connect
              }
            ]}
          />
        ) : veHoneyAmount > requiredVeHONEY ? (
          <>
            {activeTab === 'how_it_works' && (
              <HowItWorksBorrowTab
                onCancel={onCancel}
                hasReadHowCreateMarketWorks={hasReadHowItWorks}
                setHasReadHowCreateMarketWorks={setHasReadHowItWorks}
                onClickUnderstand={onClickUnderstand}
              />
            )}
            {activeTab === 'create' && (
              <CreateMarketTab wallet={wallet} honeyClient={honeyClient} />
            )}
          </>
        ) : (
          <EmptyStateDetails
            icon=""
            title="Insufficient veHONEY"
            description={`You need to ${
              requiredVeHONEY - veHoneyAmount
            }  more veHONEY to create a market`}
            buttons={[{ title: 'GET VEHONEY', onClick: () => {} }]}
          />
        )}
      </HoneyTabs>
    </div>
  );
};

export default CreateMarketSidebar;
