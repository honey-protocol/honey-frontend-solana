import React, { useEffect, useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import BorrowForm from '../BorrowForm/BorrowForm';
import { Typography } from 'antd';
import RepayForm from '../RepayForm/RepayForm';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Borrow', key: 'borrow' },
  { label: 'Repay', key: 'repay' }
];

const { Text } = Typography;

type Tab = 'borrow' | 'repay';

const MarketsSidebar = (props: MarketsSidebarProps) => {
  const wallet = useConnectedWallet();
  const {
    collectionId,
    availableNFTs,
    openPositions,
    nftPrice,
    userAllowance,
    userDebt,
    userUSDCBalance,
    loanToValue,
    hideMobileSidebar,
    executeDepositNFT, executeWithdrawNFT, executeBorrow, executeRepay,
  } = props;

  const [activeTab, setActiveTab] = useState<Tab>('borrow');
  const { connect } = useWalletKit();

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  useEffect(() => {
  }, [openPositions, availableNFTs]);

  return (
    <div className={styles.marketsSidebarContainer}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(collectionId)}
      >
        {!wallet?.connected ? (
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
            {
              activeTab === 'borrow' &&
                <BorrowForm
                  userDebt={userDebt}
                  executeBorrow={executeBorrow}
                  availableNFTs={availableNFTs}
                  openPositions={openPositions}
                  nftPrice={nftPrice}
                  executeDepositNFT={executeDepositNFT}
                  userAllowance={userAllowance}
                  loanToValue={loanToValue}
                  hideMobileSidebar={hideMobileSidebar}
                />
            }
            {
              (activeTab === 'repay' && openPositions.length) &&
                <RepayForm
                  executeRepay={executeRepay}
                  openPositions={openPositions}
                  availableNFTs={availableNFTs}
                  nftPrice={nftPrice}
                  executeWithdrawNFT={executeWithdrawNFT}
                  userDebt={userDebt}
                  userAllowance={userAllowance}
                  userUSDCBalance={userUSDCBalance}
                  loanToValue={loanToValue}
                  hideMobileSidebar={hideMobileSidebar}
                />
              }
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default MarketsSidebar;
