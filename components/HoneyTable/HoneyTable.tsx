import { Table, TableProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyTable.css';

const HoneyTable: FC<TableProps<any>> = props => {
  const { className, rowClassName, ...rest } = props;

  const getRowExternalClassName = (
    record: any,
    index: number,
    indent: any
  ): string => {
    if (!rowClassName) {
      return '';
    }
    if (typeof rowClassName !== 'function') {
      return String(rowClassName);
    }
    return rowClassName(record, index, indent);
  };

  const _rowClassName = (record: any, index: number, indent: any) => {
    const externalRowClassName = getRowExternalClassName(record, index, indent);
    const internalRowClassName = styles.honeyTableRow;
    return `${internalRowClassName} ${externalRowClassName}`;
  };

  return (
    <Table
      {...rest}
      className={styles.honeyTableContainer}
      rowClassName={_rowClassName}
    />
  );
};

export default HoneyTable;
