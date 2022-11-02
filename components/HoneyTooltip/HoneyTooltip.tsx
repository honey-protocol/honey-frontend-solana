import React, { ReactNode } from 'react';
import * as styles from './HoneyTooltip.css';
import { Tooltip } from 'antd';
import {TooltipPlacement} from "antd/lib/tooltip";

interface HoneyTooltipProps {
  label: string | ReactNode;
  children?: ReactNode;
  placement?: TooltipPlacement;
  tooltipIcon?: boolean;
}

const HoneyTooltip = (props: HoneyTooltipProps) => {
  return (
    <Tooltip
      placement={props.placement ? props.placement : "bottom"}
      title={props.label}
      overlayClassName={styles.tooltip}
    >
      {props.children && <div className={styles.container}>{props.children}</div>}
      {props.tooltipIcon && <div className={styles.tooltipIcon} />}
    </Tooltip>
  );
};

export default HoneyTooltip;
