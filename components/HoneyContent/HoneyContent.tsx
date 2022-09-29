import { Content } from 'antd/lib/layout/layout';
import React, { ReactNode } from 'react';
import * as styles from './HoneyContent.css';

export interface HoneyContentProps {
  children: ReactNode;
}

const HoneyContent = (props: HoneyContentProps) => {
  return (
    <Content className={styles.honeyContent}>
      {props.children}
    </Content>
  );
};

export default HoneyContent;
