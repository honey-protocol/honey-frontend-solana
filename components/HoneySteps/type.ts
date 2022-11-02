import { ReactNode } from 'react';

export interface Props {
  currentStep: number;
  steps: MarketStepsProps[];
}

export interface MarketStepsProps {
  step: number;
  content: ReactNode;
}