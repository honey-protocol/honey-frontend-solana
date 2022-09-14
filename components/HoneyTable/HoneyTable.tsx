import { Table, TableProps } from 'antd';
import { FC } from 'react';
import * as styles from './HoneyTable.css';
import { Key } from 'antd/lib/table/interface';
import c from 'classnames';

type HoneyTableProps = TableProps<any> & {
  hasRowsShadow?: boolean;
};

const HoneyTable: FC<HoneyTableProps> = props => {
  const {
    className,
    rowClassName,
    expandedRowClassName,
    expandable,
    hasRowsShadow,
    ...rest
  } = props;

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
    const classes = [styles.honeyTableRow];
    if (hasRowsShadow) {
      classes.push(styles.honeyTableRowShadow);
    }
    if (
      !expandable ||
      !expandable.expandedRowKeys ||
      !expandable.expandedRowKeys.length
    ) {
      return classes.join(' ');
    }

    isExpandedRow(key)
      ? classes.push(styles.honeyTableExpandedRow)
      : classes.push(styles.honeyTableInactiveRow);

    return classes.join(' ');
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
      className={c(styles.honeyTableContainer, className)}
      rowClassName={_rowClassName}
      expandedRowClassName={_expandedRowClassName}
      expandable={expandable}
      expandRowByClick
    />
  );
};

export default HoneyTable;
