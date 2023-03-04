import React from 'react';
import * as styles from './RiskModelStep.css';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import SectionTitle from '../../SectionTitle/SectionTitle';
import { HoneyButtonTabs } from '../../HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';
import HoneyLink from '../../HoneyLink/HoneyLink';
import { HoneyLineChart } from '../../HoneyLineChart/HoneyLineChart';

export enum RiskModelTab {
  LOW = 'low',
  DEFAULT = 'default',
  HIGH = 'high'
}

interface RiskModelStepProps {
  setRiskModel: Function;
  riskModel: RiskModelTab | undefined;
}

export const RiskModelStep = (props: RiskModelStepProps) => {
  const { setRiskModel, riskModel } = props;

  const renderWarning = () => {
    if (riskModel === RiskModelTab.LOW) {
      return (
        <HoneyWarning message="LOW Risk : This model is intended for low risk collateral. It aims to maintain utilisation between 60% and 80%.">
          <HoneyLink
            link="https://docs.honey.finance/lending-protocol/interest-rates/protocol-math-solana/low-risk-model"
            target="_blank"
            className={styles.marginTop}
          >
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }

    if (riskModel === RiskModelTab.DEFAULT) {
      return (
        <HoneyWarning message="DEFAULT risk: This model attempts to establish an above average income for lenders while maintaining low exposure to NFT risk.">
          <HoneyLink
            link="https://docs.honey.finance/lending-protocol/interest-rates/protocol-math-solana/default-risk-model"
            target="_blank"
            className={styles.marginTop}
          >
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }

    if (riskModel === RiskModelTab.HIGH) {
      return (
        <HoneyWarning message="HIGH risk: This model is tailored for high risk collateral. It aims to maintain optimal utilisation between 40% and 60%, while attempting to minimise the risk of 100% utilisation. ">
          <HoneyLink
            link="https://docs.honey.finance/lending-protocol/interest-rates/protocol-math-solana/high-risk-model"
            target="_blank"
            className={styles.marginTop}
          >
            Learn More
          </HoneyLink>
        </HoneyWarning>
      );
    }
  };

  const defaultRiskChartData = [
    { x: 5, y: 0 },
    { x: 60, y: 50 },
    { x: 80, y: 80 },
    { x: 100, y: 200 }
  ];

  const lowRiskChartData = [
    { x: 10, y: 0 },
    { x: 40, y: 25 },
    { x: 80, y: 40 },
    { x: 100, y: 140 }
  ];

  const highRiskChartData = [
    { x: 0, y: 10 },
    { x: 40, y: 70 },
    { x: 60, y: 80 },
    { x: 100, y: 300 }
  ];

  const getChartData = () => {
    switch (riskModel) {
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
      <div className={styles.SectionTitle}>
        <SectionTitle
          title="Select your asset risk model"
          tooltip={
            <HoneyTooltip
              tooltipIcon
              placement="top"
              title={'TODO: add tooltip'}
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
          activeItemSlug={riskModel || ''}
          onClick={slug => {
            setRiskModel(slug);
          }}
        />
      </div>

      <div className={styles.graphContainer}>
        <div className={styles.graphTitle}>
          <SectionTitle title="Interest rate" />
        </div>
        <div className={styles.graphWrapper}>{renderGraph()}</div>
      </div>

      <div className={styles.warningContainer}>{renderWarning()}</div>
    </div>
  );
};
