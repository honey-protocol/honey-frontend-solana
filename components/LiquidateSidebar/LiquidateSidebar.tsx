import React, { useState } from 'react';
import * as styles from './LiquidateSidebar.css';
import { LendSidebarProps } from './types';
import { Tabs, Typography } from 'antd';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import classNames from 'classnames';

const items = [
    { label: 'Place a bid', key: 'bid', children: 'Place a bid' }
];

const { Text } = Typography;

type Tab = 'bid';

const LiquidateSidebar = (props: LendSidebarProps) => {
    const wallet = true;
    const { collectionId } = props;
    const [activeTab, setActiveTab] = useState<Tab>('bid');

    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey as Tab);
    };
    return (
        <div className={styles.liquidateSidebarContainer}>
            <div className={styles.tabs}>
                <Tabs onChange={handleTabChange}>
                    {items.map(tabInfo => {
                        return <Tabs.TabPane tab={tabInfo.label} key={tabInfo.key} />;
                    })}
                </Tabs>
            </div>
            <div
                className={classNames(
                    styles.content,
                    collectionId ? styles.active : styles.inactive
                )}
            >
                {!wallet ? (
                    <div className={styles.emptyStateContent}>
                        <div className={styles.lightIcon} />
                        <Text className={styles.emptyStateTitle}>
                            You didn’t connect any wallet yet
                        </Text>
                        <Text type="secondary" className={styles.emptyStateDescription}>
                            First, choose a NFT collection
                        </Text>
                        <HoneyButton type="primary" className={styles.emptyStateWalletBtn}>
                            CONNECT WALLET
                        </HoneyButton>
                    </div>
                ) : !collectionId ? (
                    <div className={styles.emptyStateContent}>
                        <div className={styles.boltIcon} />
                        <Text className={styles.emptyStateTitle}>Manage panel</Text>
                        <Text type="secondary" className={styles.emptyStateDescription}>
                            First, choose a NFT collection
                        </Text>
                    </div>
                ) : (
                    <>
                        {activeTab === 'bid' && <>Place a bid</>}
                    </>
                )}
            </div>
        </div>
    );
};

export default LiquidateSidebar;
