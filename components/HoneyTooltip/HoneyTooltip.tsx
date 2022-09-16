import React, { ReactNode } from 'react';
import * as styles from './HoneyTooltip.css';
import { Tooltip } from 'antd';

interface HoneyTooltipProps {
  label: string | ReactNode;
  children: ReactNode;
}

const HoneyTooltip = (props: HoneyTooltipProps) => {
  return (
    <Tooltip
      placement="bottom"
      title={props.label}
      overlayClassName={styles.tooltip}
    >
      <div className={styles.container}>{props.children}</div>
    </Tooltip>
  );
};

export default HoneyTooltip;
