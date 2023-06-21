import React, { useState } from 'react';
import * as styles from './LendingSidebar.css';
import { LendingSidebarProps } from './types';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';
import { CounterOfferTab } from '../CounterOfferTab/CounterOfferTab';
import { OfferItem } from '../CounterOfferTab/types';
import LendForm from '../LendForm/LendForm';
import { useMediaQuery } from 'react-responsive';
import { MQ_DESKTOP_BP } from 'constants/breakpoints';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Lend', key: 'lend' },
  { label: 'Counter offer', key: 'counter_offer' }
];

type Tab = 'lend' | 'counter_offer';

const mockOffersArray: OfferItem[] = [
  {
    address: '2ijWvdsnOP1vnjds8dsa12edasd1dw',
    end: 1668888000000,
    rate: 12,
    start: 1668024000000
  },
  {
    address: '2ijWvdsnOP1vnjds8dsa12edasd1dw',
    end: 1668888000000,
    rate: 12,
    start: 1668024000000
  },
  {
    address: '2ijWvdsnOP1vnjds8dsa12edasd1dw',
    end: 1668888000000,
    rate: 12,
    start: 1668024000000
  },
  {
    address: '2ijWvdsnOP1vnjds8dsa12edasd1dw',
    end: 1668888000000,
    rate: 12,
    start: 1668024000000
  }
];

const LendingSidebar = (props: LendingSidebarProps) => {
  const {
    collectionId,
    onCancel,
    name,
    imageUrl,
    collectionName,
    borrowerTelegram,
    borrowerDiscord,
    duePeriod,
    loanStart,
    walletAddress,
    ir,
    request,
    total
  } = props;
  const isMobile = useMediaQuery({ maxWidth: MQ_DESKTOP_BP });
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('lend');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.lendingSidebarContainer}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(collectionId)}
      >
        {!wallet ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a NFT collection"
            buttons={
              isMobile
                ? [
                    {
                      title: 'CONNECT',
                      onClick: connect,
                      variant: 'primary'
                    },
                    {
                      title: 'RETURN',
                      onClick: () => onCancel(),
                      variant: 'secondary',
                      className: mobileReturnButton
                    }
                  ]
                : [
                    {
                      title: 'CONNECT',
                      onClick: connect,
                      variant: 'primary'
                    }
                  ]
            }
          />
        ) : !collectionId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (
          <>
            {activeTab === 'lend' && (
              <LendForm
                name={name}
                imageUrl={imageUrl}
                collectionName={collectionName}
                request={request}
                ir={ir}
                total={total}
                duePeriod={duePeriod}
                loanStart={loanStart}
                walletAddress={walletAddress}
                borrowerTelegram={borrowerTelegram}
                borrowerDiscord={borrowerDiscord}
              />
            )}
            {activeTab === 'counter_offer' && (
              <CounterOfferTab offers={mockOffersArray} />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default LendingSidebar;
