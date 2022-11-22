import { ReserveConfig } from '@honey-finance/sdk';
import BN from 'bn.js';
import { RiskModelTab } from '../RiskModelStep/RiskModelStep';

// ## Default values
// Base rate: 10%
// Kink1: 40%
// APR@K1: 25%
// Kink2: 80%
// APR@K2: 40%
// Max APR: 140%
const defaultConfig = {
  utilizationRate1: 4000,
  utilizationRate2: 8000,
  borrowRate0: 1000,
  borrowRate1: 2500,
  borrowRate2: 4000,
  borrowRate3: 14000,
  minCollateralRatio: 15384,
  liquidationPremium: 100,
  manageFeeRate: 50,
  manageFeeCollectionThreshold: new BN(10),
  loanOriginationFee: 500
} as ReserveConfig;

// ## High risk values
// Base rate: 20%
// Kink1: 60%
// APR@K1: 50%
// Kink2: 80%
// APR@K2: 80%
// Max APR: 200%
const highRiskConfig = {
  utilizationRate1: 6000,
  utilizationRate2: 8000,
  borrowRate0: 2000,
  borrowRate1: 5000,
  borrowRate2: 8000,
  borrowRate3: 20000,
  minCollateralRatio: 15384,
  liquidationPremium: 100,
  manageFeeRate: 50,
  manageFeeCollectionThreshold: new BN(10),
  loanOriginationFee: 500
} as ReserveConfig;

// ## Low risk values
// Base rate: 5%
// Kink1: 40%
// APR@K1: 20%
// Kink2: 60%
// APR@K2: 40%
// Max APR: 180%
const lowRiskConfig = {
  utilizationRate1: 4000,
  utilizationRate2: 6000,
  borrowRate0: 500,
  borrowRate1: 2000,
  borrowRate2: 4000,
  borrowRate3: 18000,
  minCollateralRatio: 15384,
  liquidationPremium: 100,
  manageFeeRate: 50,
  manageFeeCollectionThreshold: new BN(10),
  loanOriginationFee: 500
} as ReserveConfig;

export const buildReserveConfig = (riskModel: any, marketConfigOpts: any) => {
  let config = defaultConfig;
  if (riskModel == RiskModelTab.HIGH) {
    config = highRiskConfig;
  } else if (riskModel == RiskModelTab.LOW) {
    config = lowRiskConfig;
  }

  config.manageFeeRate = marketConfigOpts.adminFee * 100;
  config.minCollateralRatio = Math.round(
    (1 / (marketConfigOpts.liquidationThreshold / 100)) * 10000
  );
  config.liquidationPremium = marketConfigOpts.liquidationFee * 100;

  return config;
};
