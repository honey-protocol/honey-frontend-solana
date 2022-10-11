import React from 'react';
import * as styles from './NotificationCard.css';
import { NotificationCardProps } from './types';

const NotificationCard = (props: NotificationCardProps) => {
  const { title, description } = props;
  return (
    <div className={styles.notificationCard}>
      <div className={styles.notificationTitle}>{title}</div>

      <div className={styles.notificationDescription}>
        <p className={styles.notificationText}>{description}</p>

        <span className={styles.notificationShow}>more</span>
      </div>

      <div className={styles.important} />
    </div>
  );
};

export default NotificationCard;
