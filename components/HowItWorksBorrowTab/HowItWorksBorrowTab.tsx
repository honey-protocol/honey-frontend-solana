import React, { FC, useEffect, useState } from 'react';
import * as styles from './HowItWorksBorrowTab.css';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import HoneyToggle from '../HoneyToggle/HoneyToggle';
import HoneyButton from '../HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Link from 'antd/lib/typography/Link';
import TabTitle from '../HoneyTabs/TabTitle/TabTitle';
import { HowItWorksBorrowTabProps } from './types';

const HowItWorksBorrowTab: FC<HowItWorksBorrowTabProps> = ({
  onCancel,
  hasReadHowCreateMarketWorks,
  setHasReadHowCreateMarketWorks,
  onClickUnderstand
}) => {
  const onDontShowAgainToggle = (checked: boolean) => {
    window.localStorage.setItem(
      'hasReadHowCreateMarketWorks',
      JSON.stringify(checked)
    );
    setHasReadHowCreateMarketWorks(checked);
  };

  return (
    <SidebarScroll
      footer={
        <div>
          <div className={styles.toggle}>
            <div className={styles.divider} />
            <div>
              <HoneyToggle
                checked={hasReadHowCreateMarketWorks}
                onChange={onDontShowAgainToggle}
              />
              <span className={styles.toggleText}>Don’t show it anymore</span>
            </div>
          </div>
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="secondary" onClick={onCancel}>
                Cancel
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton onClick={onClickUnderstand} variant="primary" block>
                I understand
              </HoneyButton>
            </div>
          </div>
        </div>
      }
    >
      <div className={styles.howItWorksTab}>
        <div className={styles.contentWrapper}>
          <TabTitle title="How to create a new market" />

          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>1</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              Select an asset risk level. It regulates how much lenders gonna
              earn depending on the market&apos;s assets. The higher risk — the
              higher the rewards lenders will get.
            </span>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>2</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              Draft proposals can only be activated by a DAO member with at
              least{' '}
              <Link href="#" className={styles.listLink}>
                10,000 $veHONEY
              </Link>
              . All members of the DAO may vote to execute or reject the
              proposal.
            </span>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>3</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              For a proposal to be executed there should be a minimum of{' '}
              <Link href="#" className={styles.listLink}>
                10,000,000 $veHONEY
              </Link>{' '}
              votes casted resulting in at least 2/3 of the votes for one
              option.
            </span>
          </div>
        </div>
      </div>
    </SidebarScroll>
  );
};

export default HowItWorksBorrowTab;
