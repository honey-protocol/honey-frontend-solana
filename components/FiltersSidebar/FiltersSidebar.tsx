import * as styles from './FiltersSidebar.css';
import { useConnectedWallet } from "@saberhq/use-solana";
import { useWalletKit } from "@gokiprotocol/walletkit";
import React, { useState } from "react";
import HoneyTabs, {HoneyTabItem} from "../HoneyTabs/HoneyTabs";
import { Tab } from "../BorrowP2PSidebar/types";
import EmptyStateDetails from "../EmptyStateDetails/EmptyStateDetails";
import { mobileReturnButton } from "../../styles/common.css";
import { LendP2PFiltersTab } from "./LendP2PFiltersTab/LendP2PFiltersTab";
import { FiltersSidebarProps } from "./types";



export const FiltersSidebar = ({ tags, rules, initParams }: FiltersSidebarProps) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<string>('filters');
  const [interestRangeValues, setInterestRangeValues] = useState<[number, number]>(
    [initParams.minInterest, initParams.maxInterest]);
  const [totalRequestedRangeValues, setTotalRequestedRangeValues] = useState<[number, number]>([
    initParams.minTotalRequest, initParams.maxTotalRequest]);
  const [totalSuppliedRangeValues, setTotalSuppliedRangeValues] = useState<[number, number]>([
    initParams.minTotalSupplied, initParams.maxTotalSupplied]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tabs: [HoneyTabItem, HoneyTabItem?] = [
    { label: 'Filters', key: 'filters' }
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.filtersSidebar}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={tabs}
        active={true}
      >
        {!wallet ? (
          <EmptyStateDetails
            icon={<div className={styles.lightLogoWrapper} />}
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
                onClick: () => console.log('press'),
                variant: 'secondary',
                className: mobileReturnButton
              }
            ]}
          />
        ) : (
            <LendP2PFiltersTab
              tags={tags}
              rules={rules}
              totalRequestedRange={totalRequestedRangeValues}
              onChangeTotalRequestedRange={setTotalRequestedRangeValues}
              maxTotalRequest={initParams.maxTotalRequest}
              minTotalRequest={initParams.minTotalRequest}
              maxInterest={initParams.maxInterest}
              minInterest={initParams.minInterest}
              maxTotalSupplied={initParams.maxTotalSupplied}
              minTotalSupplied={initParams.minTotalSupplied}
              selectedTags={selectedTags}
              onChangeSelectedTags={setSelectedTags}
              interestRange={interestRangeValues}
              onChangeInterestRange={setInterestRangeValues}
              totalSuppliedRange={totalSuppliedRangeValues}
              onChangeTotalSuppliedRange={setTotalSuppliedRangeValues}
            />
        )}
      </HoneyTabs>
    </div>
  )
}