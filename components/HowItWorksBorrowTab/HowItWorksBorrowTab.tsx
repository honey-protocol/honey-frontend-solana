import React, { FC, useEffect, useState } from 'react';
import * as styles from './HowItWorksBorrowTab.css';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import HoneyToggle from '../HoneyToggle/HoneyToggle';
import HoneyButton from '../HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Link from 'antd/lib/typography/Link';
import SectionTitle from '../SectionTitle/SectionTitle';
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
          <SectionTitle title="How to create a new market" />

          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>1</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              Add a collection name. Add a magic eden link for the collection
              image. Add the verified creator address.
            </span>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>2</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              Create an Oracle on Switchboard and add it to the config.
            </span>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>3</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              Setup market parameters like liquidation fee, admin fee and
              liquidation threshold to manage risks.
            </span>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>4</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              Select an asset risk level. It regulates how much lenders are
              going to earn depending on the market&apos;s assets. The higher
              risk — the higher the rewards lenders will get.
            </span>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIcon}>
              <HexaBoxContainer>
                <div className={styles.listIconNumber}>5</div>
              </HexaBoxContainer>
            </div>
            <span className={styles.listText}>
              Deploy the market programs. Deploy SOL reserve. Create a Github
              Pull Request to add your market to the Open Source frontend.
            </span>
          </div>
        </div>
      </div>
    </SidebarScroll>
  );
};

export default HowItWorksBorrowTab;
