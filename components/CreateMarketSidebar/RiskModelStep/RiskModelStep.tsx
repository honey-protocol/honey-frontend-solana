import React, { useState } from 'react';
import * as styles from './RiskModelStep.css';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';
import { HoneyButtonTabs } from '../../HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';
import HoneyLink from '../../HoneyLink/HoneyLink';
import { HoneyLineChart } from '../../HoneyLineChart/HoneyLineChart';
import { generateMockHistoryData } from '../../../helpers/chartUtils';

enum RiskModelTab {
  LOW = 'low',
  DEFAULT = 'default',
  HIGH = 'high'
}

export const RiskModelStep = () => {
  const [activeTab, setActiveTab] = useState(RiskModelTab.DEFAULT);
  const isMock = true;

  const renderWarning = () => {
    if (activeTab === RiskModelTab.LOW) {
      return (
        <HoneyWarning message="LOW Risk Description">
          <HoneyLink link="#" target="_blank" className={styles.marginTop}>
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }

    if (activeTab === RiskModelTab.DEFAULT) {
      return (
        <HoneyWarning message="The Default risk model establishes an average income for lenders with keeping good risk management.">
          <HoneyLink link="#" target="_blank" className={styles.marginTop}>
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }

    if (activeTab === RiskModelTab.HIGH) {
      return (
        <HoneyWarning message="The High risk model establishes an average income for lenders with keeping good risk management.">
          <HoneyLink link="#" target="_blank" className={styles.marginTop}>
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }
  };

  const getChartData = () => {
    if (isMock) {
      const from = new Date()
        .setFullYear(new Date().getFullYear() - 1)
        .valueOf();
      const to = new Date().valueOf();
      return generateMockHistoryData(from, to, 10000);
    }
    return [];
  };

  const renderGraph = () => {
    if (activeTab === RiskModelTab.LOW) {
      return <HoneyLineChart data={getChartData()} />;
    }

    if (activeTab === RiskModelTab.DEFAULT) {
      return <HoneyLineChart data={getChartData()} />;
    }

    if (activeTab === RiskModelTab.HIGH) {
      return <HoneyLineChart data={getChartData()} />;
    }
  };

  return (
    <div className={styles.riskModelStep}>
      <div className={styles.tabTitle}>
        <TabTitle
          title="Select your asset risk model"
          tooltip={
            <HoneyTooltip
              tooltipIcon
              placement="top"
              label={'TODO: add tooltip'}
            />
          }
        />
      </div>

      <div className={styles.tabsContainer}>
        <HoneyButtonTabs
          items={[
            { name: 'Low Risk', slug: RiskModelTab.LOW },
            { name: 'Default', slug: RiskModelTab.DEFAULT },
            { name: 'High Risk', slug: RiskModelTab.HIGH }
          ]}
          isFullWidth
          activeItemSlug={activeTab}
          onClick={slug => setActiveTab(slug as RiskModelTab)}
        />
      </div>

      <div className={styles.graphContainer}>
        <div className={styles.graphTitle}>
          <TabTitle title="Interest rate" />
        </div>
        <div className={styles.graphWrapper}>{renderGraph()}</div>
      </div>

      <div className={styles.warningContainer}>{renderWarning()}</div>
    </div>
  );
};
