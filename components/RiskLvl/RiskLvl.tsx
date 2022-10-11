import React, { FC } from 'react';
import * as style from './RiskLvl.css';
import { RiskLvlProps, RiskLvlPoint } from './types';
import { formatNumber } from '../../helpers/format';

const { formatPercent: fp } = formatNumber;

const RiskLvl: FC<RiskLvlProps> = props => {
  const { riskLvl } = props;

  const getStatus = (riskLvl: number): React.ReactNode => {
    if (RiskLvlPoint.Safe <= riskLvl && riskLvl < RiskLvlPoint.Warning) {
      return (
        <div className={style.risk.safe}>
          <span className={style.valueCell}>{fp(riskLvl)}</span>{' '}
          <span className={style.riskText}>Risk lvl</span>
        </div>
      );
    }
    if (RiskLvlPoint.Warning <= riskLvl && riskLvl < RiskLvlPoint.Danger) {
      return (
        <div className={style.risk.warning}>
          <span className={style.valueCell}>{fp(riskLvl)}</span>{' '}
          <span className={style.riskText}>Risk lvl</span>
        </div>
      )
    }
    if (RiskLvlPoint.Danger <= riskLvl && riskLvl < RiskLvlPoint.Max) {
      return (
        <div className={style.risk.danger}>
          <span className={style.valueCell}>{fp(riskLvl)}</span>{' '}
          <span className={style.riskText}>Risk lvl</span>
        </div>
      )
    }
    return (
      <div className={style.valueCell}>NaN</div>
    )
  };

  return (
    <>
      {riskLvl && getStatus(riskLvl)}
    </>
  );
};

export default RiskLvl;
