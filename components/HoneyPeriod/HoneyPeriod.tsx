import React, { FC, useMemo } from 'react';
import * as styles from './HoneyPeriod.css';
import { Duration, HoneyPeriodProps } from './types';

const DateWrapper = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className={styles.dateWrapper}>
      <span className={styles.value}>{value}</span>
      <span className={styles.dateLetter}>{label}</span>
    </div>
  );
};

const HoneyPeriod: FC<HoneyPeriodProps> = ({ from = Date.now(), to }) => {
  const duration: Duration = useMemo(() => {
    const diff = to - from;
    const oneDay = 24 * 60 * 60 * 1000;
    const oneYear = 365 * oneDay;
    const oneMonth = 30 * oneDay;

    const year = Math.floor(diff / oneYear);
    const month = Math.floor((diff - year * oneYear) / oneMonth);
    const day = Math.floor((diff - year * oneYear - month * oneMonth) / oneDay);
    return {
      year: year,
      month: month,
      day: day
    };
  }, [from, to]);

  return (
    <div className={styles.honeyPeriod}>
      <DateWrapper value={duration.year} label="y" />
      <DateWrapper value={duration.month} label="m" />
      <DateWrapper value={duration.day} label="d" />
    </div>
  );
};

export default HoneyPeriod;
