import React, { ReactNode } from 'react';
import * as style from './HoneyTableRow.css';

export type HoneyTableMobileProps = {
  children: ReactNode;
};

const HoneyTableRow = (props: HoneyTableMobileProps) => {
  const { children } = props;

  return (
    <div className={style.tableLayout}>
      <div className={style.tableRow}>
        {children}
      </div>
    </div>
  );
};

export default HoneyTableRow;
