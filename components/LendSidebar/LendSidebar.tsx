import React, { useState } from 'react';
import * as styles from './LendSidebar.css';
import { LendSidebarProps } from './types';
import DepositForm from '../DepositForm/DepositForm';
import WithdrawForm from '../WithdrawForm/WithdrawForm';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';

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
    fetchedSolPrice
  } = props;
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
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
        {!wallet ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a NFT collection"
            btnTitle="CONNECT WALLET"
            onBtnClick={connect}
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
                fetchedSolPrice={fetchedSolPrice}
              />
            )}
            {activeTab === 'withdraw' && (
              <WithdrawForm
                executeWithdraw={executeWithdraw}
                userTotalDeposits={userTotalDeposits}
                available={available}
                value={value}
                fetchedSolPrice={fetchedSolPrice}
              />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default LendSidebar;
