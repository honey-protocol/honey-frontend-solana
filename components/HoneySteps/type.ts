import { ReactNode } from 'react';

export interface Props {
  currentStep: number;
  setCurrentStep?: Function;
  steps: MarketStepsProps[];
}

export interface MarketStepsProps {
  step: number;
  content: ReactNode;
}
