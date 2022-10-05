import type { NextPage } from 'next';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import React from 'react';
import * as styles from '../../styles/dashboard.css';
import { HoneyPositionsSlider } from '../../components/HoneyPositionsSlider/HoneyPositionsSlider';
import { CollectionPosition } from '../../components/HoneyPositionsSlider/types';

const Dashboard: NextPage = () => {
  const getMockPositions = () => {
    const mockData: CollectionPosition[] = [];

    for (let i = 0; i < 20; i++) {
      mockData.push({
        name: `Any name loooong ${i}`,
        value: Math.random() * 10000,
        difference: Math.random(),
        image: '/nfts/honeyEyes.png'
      });
    }
    return mockData;
  };
  return (
    <LayoutRedesign>
      <HoneyContent hasNoSider>
        <div className={styles.pageHeader}>
          <div className={styles.chartContainer}>Chart</div>
          <div className={styles.notificationsWrapper}>Notifications</div>
        </div>
        <HoneyPositionsSlider positions={getMockPositions()} />
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
