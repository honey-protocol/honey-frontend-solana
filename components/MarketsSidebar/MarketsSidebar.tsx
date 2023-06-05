import React, { useEffect, useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import BorrowForm from '../BorrowForm/BorrowForm';
import { Spin, Typography } from 'antd';
import RepayForm from '../RepayForm/RepayForm';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';
import { renderNftList } from 'helpers/marketHelpers';
import useFetchNFTByUser from 'hooks/useNFTV3';
import { spinner } from 'styles/common.css';
import { active } from 'components/HoneyTabs/HoneyTabs.css';
type Tab = 'borrow' | 'repay';

const MarketsSidebar = (props: MarketsSidebarProps) => {
  const wallet = useConnectedWallet() || null;
  const { disconnect } = useSolana();
  const [NFTs, isLoadingNfts, refetchNfts] = useFetchNFTByUser(wallet);

  const {
    isFetchingData,
    openPositions,
    nftPrice,
    userAllowance,
    userDebt,
    loanToValue,
    fetchedReservePrice,
    calculatedInterestRate,
    currentMarketId,
    hideMobileSidebar,
    executeDepositNFT,
    executeWithdrawNFT,
    executeBorrow,
    executeRepay,
    availableNFTS,
    collCount
  } = props;
  const availableNFTs = availableNFTS;
  // tab state
  const [activeTab, setActiveTab] = useState<Tab>('borrow');
  const { connect } = useWalletKit();
  // sets active tab
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  // sets active tab based on positions
  useEffect(() => {
    if (activeTab === 'borrow') {
      handleTabChange('borrow');
    }

    if (activeTab === 'repay' && openPositions.length) {
      handleTabChange('repay');
    } else {
      handleTabChange('borrow');
    }
  });
  // passed as props for child components regarding tab click
  const items: [HoneyTabItem, HoneyTabItem] = [
    { label: 'Borrow', key: 'borrow' },
    { label: 'Repay', key: 'repay', disabled: !Boolean(openPositions.length) }
  ];
  // fetches available nfts in current market
  const availableNFTsInSelectedMarket = renderNftList(
    currentMarketId,
    availableNFTS
  );

  return (
    <div className={styles.marketsSidebarContainer}>
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
            description="First, choose a NFT collection"
            buttons={[
              {
                title: 'CONNECT',
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
        ) : isLoadingNfts ? (
          <EmptyStateDetails
            icon={<Spin className={spinner} />}
            title="Fetching your NFTs"
            description=""
          />
        ) : !currentMarketId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (!availableNFTsInSelectedMarket ||
            availableNFTsInSelectedMarket.length === 0) &&
          openPositions.length === 0 ? (
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
                isFetchingData={isFetchingData}
                userDebt={userDebt}
                executeBorrow={executeBorrow}
                availableNFTs={availableNFTsInSelectedMarket}
                openPositions={openPositions}
                nftPrice={nftPrice}
                executeDepositNFT={executeDepositNFT}
                executeWithdrawNFT={executeWithdrawNFT}
                userAllowance={userAllowance}
                loanToValue={loanToValue}
                hideMobileSidebar={hideMobileSidebar}
                fetchedReservePrice={fetchedReservePrice}
                calculatedInterestRate={calculatedInterestRate}
                currentMarketId={currentMarketId}
                collCount={collCount}
              />
            )}
            {activeTab === 'repay' && Boolean(openPositions.length) && (
              <RepayForm
                executeRepay={executeRepay}
                openPositions={openPositions}
                availableNFTs={availableNFTsInSelectedMarket}
                nftPrice={nftPrice}
                executeWithdrawNFT={executeWithdrawNFT}
                userDebt={userDebt}
                userAllowance={userAllowance}
                loanToValue={loanToValue}
                hideMobileSidebar={hideMobileSidebar}
                changeTab={handleTabChange}
                fetchedReservePrice={fetchedReservePrice}
                currentMarketId={currentMarketId}
                isFetchingData={isFetchingData}
                collCount={collCount}
              />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default MarketsSidebar;
