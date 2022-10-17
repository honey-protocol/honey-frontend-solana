import React, { ReactNode } from 'react';
import * as styles from './StatusVote.css';
import c from 'classnames';
import { PercentPoint, StatusBlockProps } from './types';

const StatusVote = (props: StatusBlockProps) => {
    const { status } = props;

    const getStatus = (status: number): ReactNode => {
    if (PercentPoint.Canceled === status) {
      return (
        <div className={c(styles.status, styles.canceled)}>
          Canceled
          <div className={c(styles.statusIcon, styles.statusCanceledIcon)} />
        </div>
      )
    }
    if (PercentPoint.Failed === status) {
      return (
        <div className={c(styles.status, styles.failed)}>
          Failed
          <div className={c(styles.statusIcon, styles.statusFailedIcon)} />
        </div>
      )
    }
    if (PercentPoint.Executed === status) {
      return (
        <div className={c(styles.status, styles.executed)}>
          Executed
          <div className={c(styles.statusIcon, styles.statusExecutedIcon)} />
        </div>
      )
    }
    return (
      <div className={styles.status}>NaN</div>
    )
  };

  return (
      <div className={styles.infoBlockContainer}>
        {getStatus(status)}
        <div className={styles.label}>Status</div>
      </div>
  );
};

export default StatusVote;
