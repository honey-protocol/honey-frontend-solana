import React, { ReactNode } from 'react';
import * as style from './HoneyTableNameCell.css';

export type HoneyTableMobileProps = {
  leftSide: ReactNode;
  rightSide: ReactNode;
};

const HoneyTableNameCell = (props: HoneyTableMobileProps) => {
  const { leftSide, rightSide } = props;

  return (
    <div className={style.tableTitle}>
      <div className={style.tableTitleLeft}>
        {leftSide}
      </div>
      <div className={style.tableTitleRight}>
        {rightSide}
      </div>
    </div>
  );
};

export default HoneyTableNameCell;
