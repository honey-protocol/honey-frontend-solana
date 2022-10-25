import React, { ReactNode } from 'react';
import * as styles from './TabTitle.css';
import c from "classnames";

interface TabTitleProps {
  title: string;
  className?: string;
  tooltip?: ReactNode;
}

const TabTitle = (props: TabTitleProps) => {
  return (
    <div className={c(styles.tabTitle, props.className)}>{props.title} {props.tooltip}</div>
  );
};

export default TabTitle;
