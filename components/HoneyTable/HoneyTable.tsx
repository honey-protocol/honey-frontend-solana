import { Table, TableProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyTable.css';
import { Key } from 'antd/lib/table/interface';

const HoneyTable: FC<TableProps<any>> = props => {
  const { className, rowClassName, expandedRowClassName, expandable, ...rest } =
    props;

  const isExpandedRow = (key: Key): boolean => {
    if (
      !expandable ||
      !expandable.expandedRowKeys ||
      !expandable.expandedRowKeys.length
    ) {
      return false;
    }
    return expandable.expandedRowKeys.includes(key);
  };

  const getRowInternalClassName = (key: Key): string => {
    const baseClass = styles.honeyTableRow;
    if (
      !expandable ||
      !expandable.expandedRowKeys ||
      !expandable.expandedRowKeys.length
    ) {
      return baseClass;
    }
    return isExpandedRow(key)
      ? `${baseClass} ${styles.honeyTableExpandedRow}`
      : `${baseClass} ${styles.honeyTableInactiveRow}`;
  };

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
    const key =
      props.rowKey && typeof props.rowKey === 'string' ? props.rowKey : 'key';
    const externalRowClassName = getRowExternalClassName(record, index, indent);
    const internalRowClassName = getRowInternalClassName(record[key]);
    return `${internalRowClassName} ${externalRowClassName}`;
  };

  const getExpandedRowExternalClassName = (
    record: any,
    index: number,
    indent: any
  ): string => {
    if (!expandedRowClassName) {
      return '';
    }
    if (typeof expandedRowClassName !== 'function') {
      return String(expandedRowClassName);
    }
    return expandedRowClassName(record, index, indent);
  };

  const _expandedRowClassName = (record: any, index: number, indent: any) => {
    const externalExpandedRowClassName = getExpandedRowExternalClassName(
      record,
      index,
      indent
    );
    const internalExpandedRowClassName = styles.expandedSectionRow;
    return `${internalExpandedRowClassName} ${externalExpandedRowClassName}`;
  };

  return (
    <Table
      {...rest}
      className={styles.honeyTableContainer}
      rowClassName={_rowClassName}
      expandedRowClassName={_expandedRowClassName}
      expandable={expandable}
    />
  );
};

export default HoneyTable;
