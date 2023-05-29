import React, { useContext, useState } from 'react';
import * as styles from './LendSidebar.css';
import { LendSidebarProps } from './types';
import DepositForm from '../DepositForm/DepositForm';
import WithdrawForm from '../WithdrawForm/WithdrawForm';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import { WalletModalContext } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { mobileReturnButton } from 'styles/common.css';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Deposit', key: 'deposit' },
  { label: 'Withdraw', key: 'withdraw' }
];

type Tab = 'deposit' | 'withdraw';

const LendSidebar = (props: LendSidebarProps) => {
  const {
    collectionId,
    executeDeposit,
    executeWithdraw,
    userTotalDeposits,
    available,
    value,
    userWalletBalance,
    fetchedReservePrice,
    marketImage,
    currentMarketId,
    onCancel,
    activeInterestRate,
    isFetchingData
  } = props;
  const wallet = useWallet();
  const { setVisible: setWalletModalVisible } = useContext(WalletModalContext);
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.lendSidebarContainer}>
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
                onClick: () => setWalletModalVisible(true),
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
        ) : !collectionId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (
          <>
            {activeTab === 'deposit' && (
              <DepositForm
                executeDeposit={executeDeposit}
                userTotalDeposits={userTotalDeposits}
                available={available}
                value={value}
                userWalletBalance={userWalletBalance}
                fetchedReservePrice={fetchedReservePrice}
                marketImage={marketImage}
                currentMarketId={currentMarketId}
                onCancel={onCancel}
                activeInterestRate={activeInterestRate}
                isFetchingData={isFetchingData}
              />
            )}
            {activeTab === 'withdraw' && (
              <WithdrawForm
                executeWithdraw={executeWithdraw}
                userTotalDeposits={userTotalDeposits}
                available={available}
                value={value}
                fetchedReservePrice={fetchedReservePrice}
                marketImage={marketImage}
                currentMarketId={currentMarketId}
                onCancel={onCancel}
                activeInterestRate={activeInterestRate}
                isFetchingData={isFetchingData}
              />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default LendSidebar;
