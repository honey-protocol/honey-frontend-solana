import React, { useCallback, useEffect, useState } from 'react';
import * as styles from './LendingSidebar.css';
import { LendingSidebarProps } from './types';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';
import { CounterOfferTab } from '../CounterOfferTab/CounterOfferTab';
import { OfferItem } from '../CounterOfferTab/types';
import LendForm from '../LendForm/LendForm';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { extractMetaData } from 'helpers/utils';

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
  const { collectionId, collectionName, onCancel, loan } = props;
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('lend');
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [nftDetails, setNFTDetails] = useState<NFT>();
  const connection = useConnection();

  const fetchLoanMetadata = useCallback(async () => {
    if (!loan) return;
    try {
      setIsLoadingDetails(true);
      const nftDetails = await extractMetaData(loan.nftMint, connection);
      setNFTDetails(nftDetails);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [connection, loan]);
  useEffect(() => {
    fetchLoanMetadata();
  }, [fetchLoanMetadata]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  console.log({ loan });

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
        ) : !collectionId || !loan ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (
          <>
            {activeTab === 'lend' && (
              <LendForm
                name={nftDetails?.name ?? ''}
                imageUrl={nftDetails?.image}
                collectionName={collectionName}
                loan={loan}
                borrowerTelegram={'sak'}
                borrowerDiscord={'ad'}
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
