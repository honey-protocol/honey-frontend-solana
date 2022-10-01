import { Content } from 'antd/lib/layout/layout';
import React, { ReactNode } from 'react';
import * as styles from './HoneyContent.css';
import c from 'classnames';

export interface HoneyContentProps {
  children: ReactNode;
  hasNoSider?: boolean;
}

const HoneyContent = ({ hasNoSider, children }: HoneyContentProps) => {
  return (
    <Content
      className={c(styles.honeyContent, { [styles.hasNoSider]: hasNoSider })}
    >
      {children}
    </Content>
  );
};

export default HoneyContent;
