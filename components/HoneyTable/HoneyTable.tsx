import { Table, TableProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyTable.css';
import c from 'classnames';

const HoneyTable: FC<TableProps<any>> = props => {
  const { className, rowClassName, ...rest } = props;
  return (
    <Table
      {...rest}
      className={styles.honeyTableContainer}
      rowClassName={c(rowClassName, styles.honeyTableRow)}
    />
  );
};

export default HoneyTable;
