import React, { useContext, useState } from 'react';
import * as styles from './LiquidateSidebar.css';
import { LendSidebarProps } from './types';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import BidForm from '../BidForm/BidForm';
import BidsList from '../BidsList/BidsList';
import { WalletModalContext } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Place a bid', key: 'bid' },
  { label: 'Current bids', key: 'current' }
];

type Tab = 'bid' | 'current';

const LiquidateSidebar = (props: LendSidebarProps) => {
  const {
    collectionId,
    userBalance,
    biddingArray,
    highestBiddingValue,
    highestBiddingAddress,
    currentUserBid,
    fetchedReservePrice,
    currentMarketId,
    stringyfiedWalletPK,
    isFetchingData,
    handleRevokeBid,
    handleIncreaseBid,
    handlePlaceBid,
    onCancel
  } = props;
  const wallet = useWallet();
  const { setVisible: setWalletModalVisible } = useContext(WalletModalContext);
  const [activeTab, setActiveTab] = useState<Tab>('bid');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  return (
    <div className={styles.liquidateSidebarContainer}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(collectionId)}
      >
        {!wallet.connected ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a NFT collection"
            buttons={[
              {
                title: 'CONNECT',
                onClick: () => setWalletModalVisible(true)
              },
              {
                title: 'RETURN',
                onClick: () => onCancel(),
                variant: 'secondary'
              }
            ]}
          />
        ) : !collectionId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (
          <>
            {activeTab === 'bid' && (
              <BidForm
                currentUserBid={currentUserBid}
                highestBiddingAddress={highestBiddingAddress}
                userBalance={userBalance}
                stringyfiedWalletPK={stringyfiedWalletPK}
                highestBiddingValue={highestBiddingValue}
                handleRevokeBid={handleRevokeBid}
                handleIncreaseBid={handleIncreaseBid}
                handlePlaceBid={handlePlaceBid}
                fetchedReservePrice={fetchedReservePrice}
                onCancel={onCancel}
                currentMarketId={currentMarketId}
                isFetchingData={isFetchingData}
              />
            )}
            {activeTab === 'current' && (
              <BidsList
                isFetchingData={isFetchingData}
                biddingArray={biddingArray}
                fetchedReservePrice={fetchedReservePrice}
              />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default LiquidateSidebar;
