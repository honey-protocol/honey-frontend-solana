import { Table, Tabs, Typography } from 'antd';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import * as styles from './HoneyTabs.css';
import TabBgLeft from './TabBgLeft';
import TabBgRight from './TabBgRight';

export type HoneyTabItem = {
  label: string;
  key: string;
};

const HoneyTabs = (props: {
  items: [HoneyTabItem, HoneyTabItem];
  children: ReactNode;
  activeKey: string;
  active: boolean;
  onTabChange: Function;
}) => {
  return (
    <div className={styles.tabs}>
      <div className={styles.tabsNav}>
        {props.activeKey === props.items[0].key ? (
          <TabBgLeft />
        ) : (
          <TabBgRight />
        )}

        {props.items.map((tabInfo, i) => (
          <div
            key={tabInfo.key}
            className={classNames(styles.tab,
              props.activeKey === tabInfo.key ? styles.activeText : styles.inactiveText
            )}
            onClick={() => props.onTabChange(tabInfo.key)}
          >
            <Typography.Text className={styles.tabText}>
              {tabInfo.label}
            </Typography.Text>
          </div>
        ))}
      </div>

      <div
        className={classNames(
          styles.content,
          props.active ? styles.active : styles.inactive,
          props.activeKey === props.items[0].key ? styles.activeBorderLeft : styles.activeBorderRight
        )}
      >
        {props.children}
      </div>
    </div>
  );
};

export default HoneyTabs;
