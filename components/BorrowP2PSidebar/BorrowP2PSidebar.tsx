import * as styles from './BorrowP2PSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import React, { useState } from 'react';
import { BorrowP2PRequestFormTab } from './BorrowP2PRequestTab/BorrowP2PRequestFormTab';
import { RepayP2PTab } from './RepayP2PTab/RepayP2PTab';
import { BorrowP2PSidebarProps, Tab } from './types';
import { P2PPosition } from '../../types/p2p';
import { LoansListTab } from './LoansListTab/LoansListTab';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from '../../styles/common.css';
import { useMediaQuery } from 'react-responsive';
import { MQ_DESKTOP_BP } from 'constants/breakpoints';

const tabs: [HoneyTabItem, HoneyTabItem] = [
  { label: 'borrow', key: 'borrow' },
  { label: 'Your Loans', key: 'repay' }
];

export const BorrowP2PSidebar = ({
  userBorrowedPositions,
  selectedPosition,
  onClose
}: BorrowP2PSidebarProps) => {
  const isMobile = useMediaQuery({ maxWidth: MQ_DESKTOP_BP });
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();

  const [activeTab, setActiveTab] = useState<Tab>('borrow');
  const [selectedUserPosition, setSelectedUserPosition] =
    useState<P2PPosition>();

  const handleOpenedPositionsSelect = (address: string) => {
    const userPosition = userBorrowedPositions.find(p => p.address === address);
    setSelectedUserPosition(userPosition);
  };

  const onCancel = () => {
    setSelectedUserPosition(undefined);
    onClose();
  };

  const renderConnectWallet = () => {
    return (
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
    );
  };

  const renderBorrowTab = () => {
    if (!wallet || !wallet.connected) {
      return renderConnectWallet();
    }

    if (selectedPosition) {
      return (
        <BorrowP2PRequestFormTab
          collectionName={selectedPosition.collectionName}
          NFTName={selectedPosition.name}
          NFTLogo={selectedPosition.imageUrl}
          isVerifiedCollection={selectedPosition.verified}
          onClose={onCancel}
        />
      );
    } else {
      return (
        <EmptyStateDetails
          icon={<div className={styles.boltIcon} />}
          title="Manage panel"
          description="First, choose NFT in the list"
        />
      );
    }
  };

  const renderRepayTab = () => {
    if (!wallet || !wallet.connected) {
      return renderConnectWallet();
    }

    if (selectedUserPosition) {
      return <RepayP2PTab position={selectedUserPosition} onClose={onCancel} />;
    }

    if (!userBorrowedPositions || !userBorrowedPositions.length) {
      return (
        <EmptyStateDetails
          icon={<div className={styles.boltIcon} />}
          title="No loans found"
          description=""
        />
      );
    }

    if (userBorrowedPositions && userBorrowedPositions.length) {
      return (
        <LoansListTab
          loans={userBorrowedPositions}
          onSelect={handleOpenedPositionsSelect}
        />
      );
    }
  };

  return (
    <div className={styles.BorrowP2PSidebar}>
      <HoneyTabs
        items={tabs}
        activeKey={activeTab}
        active={true}
        onTabChange={setActiveTab}
      >
        {activeTab === 'borrow' ? renderBorrowTab() : renderRepayTab()}
      </HoneyTabs>
    </div>
  );
};
