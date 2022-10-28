import React, { useEffect, useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import BorrowForm from '../BorrowForm/BorrowForm';
import { Typography } from 'antd';
import RepayForm from '../RepayForm/RepayForm';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';

const { Text } = Typography;

type Tab = 'borrow' | 'repay';

const MarketsSidebar = (props: MarketsSidebarProps) => {
  const wallet = useConnectedWallet();
  const { disconnect } = useSolana();
  const {
    collectionId,
    availableNFTs,
    openPositions,
    nftPrice,
    userAllowance,
    userDebt,
    userUSDCBalance,
    loanToValue,
    fetchedSolPrice,
    calculatedInterestRate,
    hideMobileSidebar,
    executeDepositNFT,
    executeWithdrawNFT,
    executeBorrow,
    executeRepay
  } = props;

  const [activeTab, setActiveTab] = useState<Tab>('borrow');
  const { connect } = useWalletKit();

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  useEffect(() => {}, [openPositions, availableNFTs]);

  const items: [HoneyTabItem, HoneyTabItem] = [
    { label: 'Borrow', key: 'borrow' },
    { label: 'Repay', key: 'repay', disabled: !Boolean(openPositions.length) }
  ];

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
            buttons={[
              {
                title: 'CONNECT WALLET',
                onClick: connect,
                variant: 'primary'
              },
              {
                title: 'RETURN',
                onClick: hideMobileSidebar,
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
        ) : (!availableNFTs || availableNFTs.length === 0) && (!openPositions || openPositions.length === 0) ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="No NFTs found"
            description="You don't have any NFTs of this collection in this wallet"
            buttons={[
              {
                title: 'connect another wallet',
                onClick: disconnect,
                variant: 'secondary'
              },
              {
                title: 'RETURN',
                onClick: hideMobileSidebar,
                variant: 'secondary',
                className: mobileReturnButton
              }
            ]}
          />
        ) : (
          <>
            {activeTab === 'borrow' && (
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
                fetchedSolPrice={fetchedSolPrice}
                calculatedInterestRate={calculatedInterestRate}
              />
            )}
            {activeTab === 'repay' && Boolean(openPositions.length) && (
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
                changeTab={handleTabChange}
                fetchedSolPrice={fetchedSolPrice}
              />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default MarketsSidebar;
