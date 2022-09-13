import { ColumnType } from 'antd/lib/table';
import { SortOrder } from 'antd/lib/table/interface';

export const getColumnSortStatus = (
  sortColumns: { column: ColumnType<any>; order: SortOrder }[] | undefined,
  columnName: string
) => {
  return (
    (sortColumns &&
      sortColumns[0] &&
      sortColumns[0].column.dataIndex === columnName &&
      sortColumns[0].order) ||
    'disabled'
  );
};
