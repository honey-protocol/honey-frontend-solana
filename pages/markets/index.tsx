import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import { MarketTableRow, MarketTableToken } from '../../types/markets';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { formatNumber } from '../../helpers/format';
import Image from 'next/image';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import { Key, SortOrder } from 'antd/lib/table/interface';
import HoneyToggle from '../../components/HoneyToggle/HoneyToggle';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import debounce from 'lodash/debounce';
import SearchInput from '../../components/SearchInput/SearchInput';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { ArrowIcon } from '../../icons/Arrow';

const { formatPercent: fp, formatUsd: fu } = formatNumber;

const Markets: NextPage = () => {
  const [tableData, setTableData] = useState<MarketTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<MarketTableRow[]>(
    []
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    const mockData: MarketTableRow[] = [
      {
        key: '0',
        name: 'Test 2',
        rate: 0.1,
        available: 100,
        value: 100000,
        tokens: [
          {
            name: 'Doodles #1291',
            riskLvl: 33,
            debt: 0,
            available: 600,
            value: 1000
          },
          {
            name: 'Doodles #1321',
            riskLvl: 0,
            debt: 0,
            available: 600,
            value: 1000
          }
        ]
      },
      {
        key: '1',
        name: 'Very long collection name very long',
        rate: 0.2,
        available: 150,
        value: 160000,
        tokens: [
          {
            name: 'Doodles #1292',
            riskLvl: 0.1,
            debt: 0,
            available: 600,
            value: 1000
          }
        ]
      }
    ];

    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, []);

  const isExpandedRow = (key: Key): boolean => {
    return expandedRowKeys.includes(key);
  };

  const getRowClassName = (row: MarketTableRow): string => {
    if (!expandedRowKeys || !expandedRowKeys.length) {
      return '';
    }
    return isExpandedRow(row.key) ? style.expandedRow : style.inactiveRow;
  };

  const toggleRowExpand = useCallback((row: MarketTableRow) => {
    const { key } = row;
    setExpandedRowKeys(prevState => {
      let newState = [...prevState];
      if (prevState.includes(key)) {
        const index = prevState.findIndex(v => v === key);
        newState.splice(index, 1);
      } else {
        // uncomment this if you want to support multiple expanded rows
        // newState.push(key);
        newState = [key];
      }
      return newState;
    });
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsMyCollectionsFilterEnabled(checked);
  };

  const MyCollectionsToggle = () => (
    <div className={style.toggle}>
      <HoneyToggle
        checked={isMyCollectionsFilterEnabled}
        onChange={handleToggle}
      />
      <span className={style.toggleText}>my collections</span>
    </div>
  );

  const getColumnSortStatus = (
    sortColumns:
      | { column: ColumnType<MarketTableRow>; order: SortOrder }[]
      | undefined,
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

  const onSearch = (searchTerm: string): MarketTableRow[] => {
    if (!searchTerm) {
      return [...tableData];
    }
    const r = new RegExp(searchTerm, 'gmi');
    return [...tableData].filter(row => {
      return r.test(row.name);
    });
  };

  const debouncedSearch = useCallback(
    debounce(searchQuery => {
      setTableDataFiltered(onSearch(searchQuery));
    }, 500),
    [tableData]
  );
  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [tableData]
  );

  // Apply search if initial markets list changed
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [tableData]);

  const SearchForm = () => {
    return (
      <SearchInput
        onChange={handleSearchInputChange}
        placeholder="Search by name"
        value={searchQuery}
      />
    );
  };
  const columnsWidth: Array<number | string> = [250, 90, 150, 150, 200];

  const columns: ColumnType<MarketTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        title: SearchForm,
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => {
          return (
            <div className={style.nameCell}>
              <div className={style.logoWrapper}>
                <div className={style.collectionLogo}>
                  <HexaBoxContainer>
                    <Image src={mockNftImage} />
                  </HexaBoxContainer>
                </div>
              </div>
              <div className={style.collectionName}>{name}</div>
            </div>
          );
        }
      },
      {
        width: columnsWidth[1],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'rate');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Rate</span> <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'rate',
        sorter: (a, b) => a.rate - b.rate,
        render: (rate: number) => {
          return <div className={style.rateCell}>{fp(rate * 100)}</div>;
        }
      },
      {
        width: columnsWidth[2],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'available');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Available</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'available',
        sorter: (a, b) => a.available - b.available,
        render: (available: number) => {
          return <div className={style.availableCell}>{fu(available)}</div>;
        }
      },
      {
        width: columnsWidth[3],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'value');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Value</span> <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'value',
        sorter: (a, b) => a.value - b.value,
        render: (value: number) => {
          return <div className={style.valueCell}>{fu(value)}</div>;
        }
      },
      {
        width: columnsWidth[4],
        title: MyCollectionsToggle,
        render: (_: null, row: MarketTableRow) => {
          return (
            <div className={style.buttonsCell}>
              <HoneyButton variant="text" onClick={() => toggleRowExpand(row)}>
                View <div className={style.arrowIcon} />
              </HoneyButton>
            </div>
          );
        }
      }
    ],
    [isMyCollectionsFilterEnabled, tableData, searchQuery]
  );

  const expandColumns: ColumnType<MarketTableToken>[] = [
    {
      dataIndex: 'name',
      width: columnsWidth[0],
      render: (name, record) => (
        <div className={style.expandedRowNameCell}>
          <div className={style.expandedRowIcon} />
          <div className={style.collectionLogo}>
            <HexaBoxContainer>
              <Image src={mockNftImage} />
            </HexaBoxContainer>
          </div>
          <div className={style.nameCellText}>
            <div className={style.collectionName}>{name}</div>
            <div className={style.risk.safe}>
              <span className={style.valueCell}>{fp(record.riskLvl)}</span>{' '}
              <span className={style.riskText}>Risk lvl</span>
            </div>
          </div>
        </div>
      )
    },
    {
      dataIndex: 'debt',
      width: columnsWidth[1],
      render: debt => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Debt:'} value={fu(debt)} />
        </div>
      )
    },
    {
      dataIndex: 'available',
      width: columnsWidth[2],
      render: available => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Available:'} value={fu(available)} />
        </div>
      )
    },
    {
      dataIndex: 'value',
      width: columnsWidth[3],
      render: value => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Value:'} value={fu(value)} />
        </div>
      )
    },
    {
      width: columnsWidth[4],
      title: '',
      render: () => (
        <div className={style.buttonsCell}>
          <HoneyButton variant="text">
            Manage <div className={style.arrowRightIcon} />
          </HoneyButton>
        </div>
      )
    }
  ];

  const ExpandedTableFooter = () => (
    <div className={style.expandedSectionFooter}>
      <div className={style.expandedRowIcon} />
      <div className={style.lampIcon} />
      <div className={style.footerText}>
        <span className={style.footerTitle}>
          You can’t add one more NFT to this market
        </span>
        <span className={style.footerDescription}>
          Choose another market or connect another wallet
        </span>
      </div>
      <div className={style.footerButton}>
        <HoneyButton variant="secondary">
          <div className={style.swapWalletIcon} /> Connect another wallet
        </HoneyButton>
      </div>
    </div>
  );

  return (
    <LayoutRedesign>
      <Content>
        <HoneyTable
          hasRowsShadow={true}
          tableLayout="fixed"
          columns={columns}
          dataSource={tableDataFiltered}
          pagination={false}
          rowClassName={getRowClassName}
          className={style.table}
          expandable={{
            // we use our own custom expand column
            showExpandColumn: false,
            expandedRowKeys: expandedRowKeys,
            expandedRowRender: record => {
              return (
                <div className={style.expandSection}>
                  <div className={style.dashedDivider} />
                  <HoneyTable
                    tableLayout="fixed"
                    className={style.expandContentTable}
                    columns={expandColumns}
                    dataSource={record.tokens}
                    pagination={false}
                    showHeader={false}
                    footer={ExpandedTableFooter}
                  />
                </div>
              );
            }
          }}
        />
      </Content>
      <Sider width={350}>
        <MarketsSidebar collectionId="s" />
      </Sider>
    </LayoutRedesign>
  );
};

export default Markets;
