import * as styles from './BorrowP2PSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import React, { useContext, useState } from 'react';
import { BorrowP2PRequestFormTab } from './BorrowP2PRequestTab/BorrowP2PRequestFormTab';
import { RepayP2PTab } from './RepayP2PTab/RepayP2PTab';
import { BorrowP2PSidebarProps, Tab } from './types';
import { P2PPosition } from '../../types/p2p';
import { LoansListTab } from './LoansListTab/LoansListTab';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import { mobileReturnButton } from '../../styles/common.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalContext } from '@solana/wallet-adapter-react-ui';

const tabs: [HoneyTabItem, HoneyTabItem] = [
  { label: 'borrow', key: 'borrow' },
  { label: 'Your Loans', key: 'repay' }
];

export const BorrowP2PSidebar = ({
  userBorrowedPositions,
  selectedPosition,
  onClose
}: BorrowP2PSidebarProps) => {
  const { wallet, connected } = useWallet();
  const { setVisible } = useContext(WalletModalContext);

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
        buttons={[
          {
            title: 'CONNECT',
            onClick: () => setVisible(true),
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
    );
  };

  const renderBorrowTab = () => {
    if (!wallet || connected) {
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
    if (!wallet || connected) {
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
