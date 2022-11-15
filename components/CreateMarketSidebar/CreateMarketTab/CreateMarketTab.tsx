import { FC, useState } from 'react';
import * as styles from './CreateMarketTab.css';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import LiquidationMarketsStep from '../../LiquidationMarketsStep/LiquidationMarketsStep';
import { AddOracleStep } from '../AddOracleStep/AddOracleStep';
import { HoneySteps } from '../../HoneySteps/HoneySteps';
import { MarketStepsProps } from '../../HoneySteps/type';
import SectionTitle from '../../SectionTitle/SectionTitle';
import { AboutMarketStep } from '../AboutMarketStep/AboutMarketStep';
import { SettingMarketStep } from '../SettingMarketStep/SettingMarketStep';
import { RiskModelStep } from '../RiskModelStep/RiskModelStep';

const CreateMarketTab: FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps: MarketStepsProps[] = [
    {
      step: 1,
      content: <AboutMarketStep />
    },
    {
      step: 2,
      content: <LiquidationMarketsStep />
    },
    {
      step: 3,
      content: <AddOracleStep />
    },
    {
      step: 4,
      content: <SettingMarketStep />
    },
    {
      step: 5,
      content: <RiskModelStep />
    }
  ];

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton
              variant="secondary"
              disabled={currentStep === 0}
              onClick={() => prev()}
            >
              Back
            </HoneyButton>
          </div>
          <div className={styles.bigCol}>
            {currentStep < steps.length - 1 && (
              <HoneyButton variant="primary" block onClick={() => next()}>
                Next step
              </HoneyButton>
            )}
            {currentStep === steps.length - 1 && (
              <HoneyButton variant="primary" block>
                Create market
              </HoneyButton>
            )}
          </div>
        </div>
      }
    >
      <div className={styles.createMarketTab}>
        <SectionTitle title="Create market" className={styles.createMarket} />

        <HoneySteps steps={steps} currentStep={currentStep} />

        <div className={styles.createSteps}>{steps[currentStep].content}</div>
      </div>
    </SidebarScroll>
  );
};

export default CreateMarketTab;
