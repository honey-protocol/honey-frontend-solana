import * as styles from './BorrowP2PSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import React, { useState } from 'react';
import { BorrowP2PRequestFormTab } from './BorrowP2PRequestTab/BorrowP2PRequestFormTab';
import { RepayP2PTab } from './RepayP2PTab/RepayP2PTab';
import { BorrowP2PSidebarProps, Tab } from './types';
import { P2PLoan, P2PPosition } from '../../types/p2p';
import { LoansListTab } from './LoansListTab/LoansListTab';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from '../../styles/common.css';
import { requestLoan } from 'helpers/p2p/apiServices';

const tabs: [HoneyTabItem, HoneyTabItem] = [
  { label: 'borrow', key: 'borrow' },
  { label: 'applied borrow', key: 'applied_borrow' }
];

export const BorrowP2PSidebar = ({
  userAppliedLoans,
  selectedPosition,
  onClose
}: BorrowP2PSidebarProps) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();

  const [activeTab, setActiveTab] = useState<Tab>('borrow');
  const [selectedUserPosition, setSelectedUserPosition] = useState<P2PLoan>();

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
    );
  };

  const renderBorrowTab = () => {
    if (!wallet || !wallet.connected) {
      return renderConnectWallet();
    }

    if (selectedPosition) {
      return (
        <BorrowP2PRequestFormTab
          collectionName={selectedPosition.name}
          NFT={selectedPosition}
          isVerifiedCollection={true} //get verified status
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

  const renderAppliedBorrowTab = () => {
    if (!wallet || !wallet.connected) {
      return renderConnectWallet();
    }

    if (selectedUserPosition) {
      return <RepayP2PTab position={selectedUserPosition} onClose={onCancel} />;
    }

    if (!Object.keys(userAppliedLoans).length) {
      return (
        <EmptyStateDetails
          icon={<div className={styles.boltIcon} />}
          title="No loans found"
          description=""
        />
      );
    } else {
      return <LoansListTab loans={userAppliedLoans} onSelect={() => {}} />;
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
        {activeTab === 'borrow' ? renderBorrowTab() : renderAppliedBorrowTab()}
      </HoneyTabs>
    </div>
  );
};
