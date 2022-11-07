import React from 'react';
import Link from 'antd/lib/typography/Link';

import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HoneyToggle from 'components/HoneyToggle/HoneyToggle';
import TabTitle from 'components/HoneyTabs/TabTitle/TabTitle';

import * as styles from './HowItWorksTab.css';

interface HowItWorksTabProps {
  setActiveTab: Function;
  setHasReadHowItWorks: Function;
  hasReadHowItWorks: boolean;
  onCancel: Function;
}

const HowItWorksTab = (props: HowItWorksTabProps) => {
  const onDontShowAgainToggle = (checked: boolean) => {
    window.localStorage.setItem('hasReadHowItWorks', JSON.stringify(checked));
    props.setHasReadHowItWorks(checked);
  };

  return (
    <SidebarScroll
      footer={
        <div>
          <div className={styles.toggle}>
            <div className={styles.divider} />
            <div>
              <HoneyToggle
                checked={props.hasReadHowItWorks}
                onChange={onDontShowAgainToggle}
              />
              <span className={styles.toggleText}>Don’t show it anymore</span>
            </div>
          </div>
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="secondary" onClick={() => props.onCancel()}>
                Cancel
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                onClick={() => props.setActiveTab('create')}
                variant="primary"
                block
              >
                I understand
              </HoneyButton>
            </div>
          </div>
        </div>
      }
    >
      <div className={styles.howItWorksTab}>
        <div className={styles.contentWrapper}>
          <TabTitle title="How to create new proposal" />
          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>1</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              Please make sure to start a discussion on the forum to see if
              there is sufficient support for your proposal.
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

export default HowItWorksTab;
