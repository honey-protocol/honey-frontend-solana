import React, { ReactNode, ReactPropTypes, useRef, useState } from 'react';
import * as styles from './HoneyTooltip.css';
import cs from 'classnames';
import HoneyCardYellowShadow from 'components/HoneyCardYellowShadow/HoneyCardYellowShadow';

interface HoneyTooltipProps {
  label: string | ReactNode;
  children: ReactNode;
}

const HoneyTooltip = (props: HoneyTooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const toolTipRef = useRef<HTMLDivElement>(null);

  const isTooltipInView = () => {
    if (!toolTipRef.current) return;
    const tooltipRect = toolTipRef.current?.getBoundingClientRect();
    if (tooltipRect.left < 0) {
      toolTipRef.current.style.transform = `translateX(${
        tooltipRect.left * -1
      }px)`;
    }
    if (tooltipRect.right >= window.innerWidth) {
      toolTipRef.current.style.transform = `translateX(${
        window.innerWidth - tooltipRect.right
      }px)`;
    }
  };

  const onMouseOut = () => {
    setShowTooltip(false);
  };

  const onMouseOver = () => {
    setShowTooltip(true);
    setTimeout(isTooltipInView, 50);
  };

  return (
    <div className={styles.container}>
      <div onMouseOut={onMouseOut} onMouseOver={onMouseOver}>
        {props.children}
      </div>
      {showTooltip && (
        <div ref={toolTipRef} className={cs(styles.tooltip)}>
          <HoneyCardYellowShadow>
            <div className={styles.label}>{props.label}</div>
          </HoneyCardYellowShadow>
        </div>
      )}
    </div>
  );
};

export default HoneyTooltip;
