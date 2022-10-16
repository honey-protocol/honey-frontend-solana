import React, { FC } from 'react';
import * as style from './HealthLvl.css';
import { HealthLvlProps, HealthLvlPoint } from './Types';
import { formatNumber } from '../../helpers/format';

const { formatPercent: fp } = formatNumber;

const HealthLvl: FC<HealthLvlProps> = props => {
  const { healthLvl } = props;

  const getStatus = (healthLvl: number): React.ReactNode => {
    if (
      HealthLvlPoint.Safe <= healthLvl &&
      healthLvl > HealthLvlPoint.Warning
    ) {
      return (
        <div className={style.health.safe}>
          <span className={style.valueCell}>{fp(healthLvl)}</span>{' '}
          <span className={style.healthText}>Health lvl</span>
        </div>
      );
    }
    if (
      HealthLvlPoint.Warning <= healthLvl &&
      healthLvl > HealthLvlPoint.Danger
    ) {
      return (
        <div className={style.health.warning}>
          <span className={style.valueCell}>{fp(healthLvl)}</span>{' '}
          <span className={style.healthText}>Health lvl</span>
        </div>
      );
    }
    if (HealthLvlPoint.Danger <= healthLvl && healthLvl > HealthLvlPoint.Min) {
      return (
        <div className={style.health.danger}>
          <span className={style.valueCell}>{fp(healthLvl)}</span>{' '}
          <span className={style.healthText}>Health lvl</span>
        </div>
      );
    }
    return <div className={style.valueCell}>NaN</div>;
  };

  return <>{healthLvl && getStatus(healthLvl)}</>;
};

export default HealthLvl;
