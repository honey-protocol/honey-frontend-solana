import React from 'react';
import * as styles from './NotificationsList.css';
import HoneyToggle from '../HoneyToggle/HoneyToggle';
import { notificationListProps } from './types';
import NotificationCard from '../NotificationCard/NotificationCard';

const NotificationsList = (props: notificationListProps) => {
  const { data } = props;

  return (
    <div className={styles.notificationList}>
      <div className={styles.notification}>
        <div className={styles.notificationTitle}>
          Notification
        </div>

        <div className={styles.notificationToggle}>
          <HoneyToggle />
          <span>Only important</span>
        </div>
      </div>

      {data.map((item, index) => (
          <div className={styles.hasBorder} key={index}>
            <NotificationCard {...item} />
          </div>
        ))
      }
    </div>
  );
};

export default NotificationsList;
