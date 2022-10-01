import { FC, useState } from 'react';
import * as styles from './HowItWorksTab.css';
import { formatNumber } from '../../../helpers/format';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../../HoneyButton/HoneyButton';
import HoneyToggle from '../../HoneyToggle/HoneyToggle';

const ListItem: FC<{ index: number }> = ({ children, index }) => {
  return (
    <div className={styles.listItem}>
      <div className={styles.listIcon}>
        <HexaBoxContainer>
          <div className={styles.listIconNumber}>{index + 1}</div>
        </HexaBoxContainer>
      </div>
      <span>{children}</span>
    </div>
  );
};

const content = [
  'Please make sure to start a discussion on the forum to see if there is sufficient support for your proposal.',
  'Draft proposals can only be activated by a DAO member with at least 10,000 $veHONEY. All members of the DAO may vote to execute or reject the proposal.',
  'For a proposal to be executed there should be a minimum of 10,000,000 $veHONEY votes casted resulting in at least 2/3 of the votes for one option.'
];

const HowItWorksTab: FC = () => {
  return (
    <SidebarScroll
      footer={
        <div>
          <div className={styles.toggle}>
            <div className={styles.divider} />
            <div>
              <HoneyToggle />
              <span className={styles.toggleText}>Don’t show it anymore</span>
            </div>
          </div>
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="secondary">Cancel</HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton variant="primary" isFluid={true}>
                I understand
              </HoneyButton>
            </div>
          </div>
        </div>
      }
    >
      <div className={styles.howItWorksTab}>
        <div className={styles.contentWrapper}>
          <div className={styles.tabTitle}>How to create new proposal</div>

          {content.map((item, index) => (
            <ListItem key={index} index={index}>
              {item}
            </ListItem>
          ))}
        </div>
      </div>
    </SidebarScroll>
  );
};

export default HowItWorksTab;
