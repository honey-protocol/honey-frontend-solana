import { Content } from 'antd/lib/layout/layout';
import React, { ReactNode } from 'react';
import * as styles from './HoneyContent.css';
import c from 'classnames';

export interface HoneyContentProps {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

const HoneyContent = ({ children, sidebar, className }: HoneyContentProps) => {
  return (
    <Content
      className={c(styles.honeyContent, className, { ['hasNoSider']: !sidebar })}
      id={'scrollSider'}
    >
      {children}

      {sidebar}
    </Content>
  );
};

export default HoneyContent;
