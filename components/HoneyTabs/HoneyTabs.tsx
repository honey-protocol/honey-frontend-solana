import React, { ReactNode } from 'react';
import { Typography } from 'antd';
import classNames from 'classnames';
import TabBgLeft from './TabBgLeft';
import TabBgRight from './TabBgRight';

import * as styles from './HoneyTabs.css';

export type HoneyTabItem = {
  label: string;
  key: string;
  disabled?: boolean;
};

const HoneyTabs = (props: {
  items: HoneyTabItem[];
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
            key={tabInfo?.key}
            className={classNames(
              styles.tab,
              props.activeKey === tabInfo?.key
                ? styles.activeText
                : styles.inactiveText,
              tabInfo?.disabled ? styles.disabled : ''
            )}
            onClick={() =>
              tabInfo?.disabled ? null : props.onTabChange(tabInfo?.key)
            }
          >
            <Typography.Text className={styles.tabText}>
              {tabInfo?.label}
            </Typography.Text>
          </div>
        ))}
      </div>

      <div
        className={classNames(
          styles.content,
          props.active ? styles.active : styles.inactive,
          props.activeKey === props.items[0].key
            ? styles.activeBorderLeft
            : styles.activeBorderRight
        )}
      >
        {props.children}
      </div>
    </div>
  );
};

export default HoneyTabs;
