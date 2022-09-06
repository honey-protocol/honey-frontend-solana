import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import { MarketTableRow } from '../../types/markets';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { formatNumber } from '../../helpers/format';
import Image from 'next/image';
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import { Key } from 'antd/lib/table/interface';
import HoneyToggle from '../../components/HoneyToggle/HoneyToggle';
import debounce from 'lodash/debounce';
import SearchInput from '../../components/SearchInput/SearchInput';

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

  const columns: ColumnType<MarketTableRow>[] = useMemo(
    () => [
      {
        title: SearchForm,
        dataIndex: 'name',
        render: (name: string) => {
          return (
            <div className={style.nameCell}>
              <div className={style.collectionLogo}>
                <Image src={mockNftImage} />
              </div>
              <div className={style.collectionName}>{name}</div>
            </div>
          );
        }
      },
      {
        title: 'Rate',
        dataIndex: 'rate',
        render: (rate: number) => {
          return <div className={style.rateCell}>{fp(rate * 100)}</div>;
        }
      },
      {
        title: 'Available',
        dataIndex: 'available',
        render: (available: number) => {
          return <div className={style.availableCell}>{fu(available)}</div>;
        }
      },
      {
        title: 'Value',
        dataIndex: 'value',
        render: (value: number) => {
          return <div className={style.valueCell}>{fu(value)}</div>;
        }
      },
      {
        title: MyCollectionsToggle,
        dataIndex: '',
        render: (_: null, row: MarketTableRow) => {
          return (
            <div className={style.buttonsCell}>
              <button onClick={() => toggleRowExpand(row)}>View</button>
            </div>
          );
        }
      }
    ],
    [isMyCollectionsFilterEnabled, tableData, searchQuery]
  );

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    const mockData: MarketTableRow[] = [
      {
        key: '0',
        name: 'Test 2',
        rate: 0.1,
        available: 100,
        value: 100000
      },
      {
        key: '1',
        name: 'Very long collection name very long',
        rate: 0.1,
        available: 100,
        value: 100000
      }
    ];

    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, []);

  return (
    <LayoutRedesign>
      <Content>
        <HoneyTable
          columns={columns}
          dataSource={tableDataFiltered}
          pagination={false}
          rowClassName={getRowClassName}
          expandable={{
            // we use our own custom expand column
            showExpandColumn: false,
            expandedRowKeys: expandedRowKeys,
            expandedRowRender: record => {
              return (
                <div className={style.expandSection}>
                  WIP: add expand section
                </div>
              );
            }
          }}
        />
      </Content>
      <Sider width={350}>
        <MarketsSidebar />
      </Sider>
    </LayoutRedesign>
  );
};

export default Markets;
