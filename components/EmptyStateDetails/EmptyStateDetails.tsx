import HoneyButton from 'components/HoneyButton/HoneyButton';
import React, { ReactNode } from 'react';
import * as styles from './EmptyStateDetails.css';
import { Typography } from 'antd';

interface EmptyStateDetailsProps {
  icon: ReactNode;
  title: string;
  description: string;
  btnTitle?: string;
  onBtnClick?: () => void;
}

const { Text } = Typography;
const EmptyStateDetails = (props: EmptyStateDetailsProps) => {
  return (
    <div className={styles.emptyStateContent}>
      {props.icon}
      <Text className={styles.emptyStateTitle}>{props.title}</Text>
      <Text type="secondary" className={styles.emptyStateDescription}>
        {props.description}
      </Text>
      {props.btnTitle && (
        <HoneyButton
          onClick={props.onBtnClick || (() => {})}
          type="primary"
          className={styles.emptyStateWalletBtn}
        >
          {props.btnTitle}
        </HoneyButton>
      )}
    </div>
  );
};

export default EmptyStateDetails;
