import React, { FC } from 'react';
import * as styles from './StatusCard.css';
import c from 'classnames';
import { Typography } from 'antd';
import { StatusCardProps } from './types';

const { Text } = Typography;

export const StatusCard: FC<StatusCardProps> = ({ status, isVerified }) => {
  return (
    <div className={c(styles.statusCard, {
        [styles.verified]: isVerified,
        [styles.noVerified]: !isVerified,
    })}>
      <Text className={styles.status}>
        {status}
      </Text>
      {isVerified && <div className={styles.verifiedIcon} />}
    </div>
  );
};
