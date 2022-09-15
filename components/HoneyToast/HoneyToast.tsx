import { Space, Typography } from 'antd';
import React from 'react';
import * as styles from './HoneyToast.css';
import {
  CheckOutlined,
  Loading3QuartersOutlined,
  WarningOutlined
} from '@ant-design/icons';
import cs from 'classnames';

export type ToastState = 'loading' | 'success' | 'error';

export interface HoneyToastProps {
  state: ToastState;
  primaryText: string;
  secondaryLink?: string;
}

export const toastRemoveDelay = 5000;

const HoneyToast = (props: HoneyToastProps) => {
  const IconComp = () => {
    switch (props.state) {
      case 'loading':
        return <Loading3QuartersOutlined spin />;
      case 'success':
        return <CheckOutlined />;
      case 'error':
        return <WarningOutlined />;
    }
  };

  return (
    <div className={cs(styles.toast, styles[props.state] || styles.loading)}>
      <div className={styles.row}>
        <Typography.Text className={styles.primaryText}>
          {props.primaryText}
        </Typography.Text>
        <IconComp />
      </div>
      {props.secondaryLink && (
        <a
          href={props.secondaryLink}
          target="_blank"
          className={styles.row}
          rel="noreferrer"
        >
          <Typography.Text className={styles.secondaryText}>
            {props.secondaryLink}
          </Typography.Text>
          <div className={styles.newPageArrow} />
        </a>
      )}
    </div>
  );
};

export default HoneyToast;
