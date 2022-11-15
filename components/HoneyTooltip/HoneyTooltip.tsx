import React, { ReactNode } from 'react';
import * as styles from './HoneyTooltip.css';
import { Tooltip, TooltipProps } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';

type HoneyTooltipProps = TooltipProps & {
  tooltipIcon?: boolean;
  customIcon?: string;
};

const HoneyTooltip = (props: HoneyTooltipProps) => {
  const { children, placement, ...rest } = props;
  return (
    <Tooltip
      placement={placement ? placement : 'bottom'}
      overlayClassName={styles.tooltip}
      {...rest}
    >
      {props.children && (
        <div className={styles.container}>{props.children}</div>
      )}
      {props.tooltipIcon && (
        <div
          className={props.customIcon ? props.customIcon : styles.tooltipIcon}
        />
      )}
    </Tooltip>
  );
};

export default HoneyTooltip;
