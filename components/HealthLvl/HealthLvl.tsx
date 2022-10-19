import React, { FC } from 'react';
import * as style from './HealthLvl.css';
import { HealthLvlProps, HealthLvlPoint } from './types';
import { formatNumber } from '../../helpers/format';

// const { formatPercent: fp } = formatNumber;

const HealthLvl: FC<HealthLvlProps> = props => {
  const { healthLvl } = props;

  const getStatus = (healthLvl: number): React.ReactNode => {
    if (
      healthLvl > HealthLvlPoint.Warning &&
      healthLvl <= HealthLvlPoint.Safe
    ) {
      return (
        <div className={style.health.safe}>
          <span className={style.valueCell}>{`${healthLvl.toFixed()}%`}</span>{' '}
          <span className={style.healthText}>Health</span>
        </div>
      );
    }
    if (
      healthLvl <= HealthLvlPoint.Warning &&
      healthLvl > HealthLvlPoint.Danger
    ) {
      return (
        <div className={style.health.warning}>
          <span className={style.valueCell}>{`${healthLvl.toFixed()}%`}</span>{' '}
          <span className={style.healthText}>Health</span>
        </div>
      );
    }
    if (healthLvl <= HealthLvlPoint.Danger && healthLvl > HealthLvlPoint.Min) {
      return (
        <div className={style.health.danger}>
          <span className={style.valueCell}>{`${healthLvl.toFixed()}%`}</span>{' '}
          <span className={style.healthText}>Health</span>
        </div>
      );
    }
    return <div className={style.valueCell}>NaN</div>;
  };

  return <>{healthLvl && getStatus(healthLvl)}</>;
};

export default HealthLvl;
