import type { NextPage } from 'next';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import React from 'react';
import * as styles from '../../styles/dashboard.css';
import { HoneyPositionsSlider } from '../../components/HoneyPositionsSlider/HoneyPositionsSlider';

const Dashboard: NextPage = () => {
  return (
    <LayoutRedesign>
      <HoneyContent hasNoSider>
        <div className={styles.pageHeader}>
          <div className={styles.chartContainer}>Chart</div>
          <div className={styles.notificationsWrapper}>Notifications</div>
        </div>
        <HoneyPositionsSlider />
      </HoneyContent>
      <HoneyContent hasNoSider>
        <div className={styles.pageContent}>
          <div className={styles.pageTitle}>My assets</div>
          <div className={styles.pageContentElements}>
            <div className={styles.gridWrapper}>Grid with cards</div>
            <div className={styles.sidebarWrapper}>Sidebar</div>
          </div>
        </div>
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Dashboard;
