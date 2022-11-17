import React, { useEffect, useState } from 'react';
import * as styles from './RiskModelStep.css';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';
import { HoneyButtonTabs } from '../../HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';
import HoneyLink from '../../HoneyLink/HoneyLink';
import { HoneyLineChart } from '../../HoneyLineChart/HoneyLineChart';
import { generateMockHistoryData } from '../../../helpers/chartUtils';

export enum RiskModelTab {
  LOW = 'low',
  DEFAULT = 'default',
  HIGH = 'high'
}

interface RiskModelStepProps {
  setRiskModel: any;
}

export const RiskModelStep = (props: RiskModelStepProps) => {
  const { setRiskModel } = props;
  const [activeTab, setActiveTab] = useState(RiskModelTab.DEFAULT);
  const isMock = true;

  useEffect(() => {
    setRiskModel(RiskModelTab.DEFAULT);
  }, []);

  const renderWarning = () => {
    if (activeTab === RiskModelTab.LOW) {
      return (
        <HoneyWarning message="LOW Risk Description">
          <HoneyLink link="#" target="_blank">
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }

    if (activeTab === RiskModelTab.DEFAULT) {
      return (
        <HoneyWarning message="The Default risk model establishes an average income for lenders with keeping good risk management.">
          <HoneyLink link="#" target="_blank">
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }

    if (activeTab === RiskModelTab.HIGH) {
      return (
        <HoneyWarning message="The High risk model establishes an average income for lenders with keeping good risk management.">
          <HoneyLink link="#" target="_blank">
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }
  };

  const lowRiskChartData = [
    { x: 5, y: 0 },
    { x: 60, y: 50 },
    { x: 80, y: 80 },
    { x: 100, y: 200 }
  ];

  const defaultRiskChartData = [
    { x: 10, y: 0 },
    { x: 40, y: 25 },
    { x: 80, y: 40 },
    { x: 100, y: 140 }
  ];

  const highRiskChartData = [
    { x: 20, y: 0 },
    { x: 40, y: 20 },
    { x: 60, y: 40 },
    { x: 100, y: 180 }
  ];

  const getChartData = () => {
    switch (activeTab) {
      case RiskModelTab.LOW:
        return lowRiskChartData;
      case RiskModelTab.DEFAULT:
        return defaultRiskChartData;
      case RiskModelTab.HIGH:
        return highRiskChartData;

      default:
        return lowRiskChartData;
    }
  };

  const renderGraph = () => {
    return (
      <HoneyLineChart
        data={getChartData()}
        xAxisLabel="Utilisation rate (%)"
        yAxisLabel="Interest rate"
      />
    );
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
          onClick={slug => {
            setActiveTab(slug as RiskModelTab);
            setRiskModel(slug);
          }}
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
