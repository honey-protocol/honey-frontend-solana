import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import LiquidateSidebar from "../../components/LiquidateSidebar/LiquidateSidebar";
import HoneyTable from "../../components/HoneyTable/HoneyTable";
import classNames from "classnames";
import * as style from "../../styles/markets.css";
import EmptyStateDetails from "../../components/EmptyStateDetails/EmptyStateDetails";
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {Key} from "antd/lib/table/interface";
import HoneyToggle from "../../components/HoneyToggle/HoneyToggle";
import debounce from "lodash/debounce";
import SearchInput from "../../components/SearchInput/SearchInput";
import {ColumnType} from "antd/lib/table";
import HexaBoxContainer from "../../components/HexaBoxContainer/HexaBoxContainer";
import Image from "next/image";
import mockNftImage from '/public/images/mock-collection-image@2x.png';
import {getColumnSortStatus} from "../../helpers/tableUtils";
import HoneyButton from "../../components/HoneyButton/HoneyButton";
import {formatNumber} from "../../helpers/format";
import {LiquidateTableRow} from "../../types/liquidate";
import {LiquidateExpandTable} from "../../components/LiquidateExpandTable/LiquidateExpandTable";
const { formatPercent: fp, formatUsd: fu } = formatNumber;

const Liquidate: NextPage = () => {
  const [tableData, setTableData] = useState<LiquidateTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<LiquidateTableRow[]>(
    []
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    const mockData: LiquidateTableRow[] = [
      {
        key: '0',
        name: 'Test 2',
        risk: 0.1,
        liqThreshold: 0.75,
        totalDebt: 1000,
        tvl: 100000,
        positions: [
          {
            name: 'Doodles #1291',
            riskLvl: 40,
            untilLiquidation: 1600,
            debt: 100,
            estimatedValue: 1000
          },
          {
            name: 'Doodles #1292',
            riskLvl: 33,
            untilLiquidation: 1234,
            debt: 150,
            estimatedValue: 1500
          },
          {
            name: 'Doodles #1293',
            riskLvl: 50,
            untilLiquidation: 1800,
            debt: 200,
            estimatedValue: 1700
          },
          {
            name: 'Doodles #1293',
            riskLvl: 52,
            untilLiquidation: 200,
            debt: 50,
            estimatedValue: 90
          },
        ]
      },
      {
        key: '1',
        name: 'Test 3',
        risk: 0.3,
        liqThreshold: 0.70,
        totalDebt: 1500,
        tvl: 150000,
        positions: [
          {
            name: 'Doodles #1291',
            riskLvl: 33,
            untilLiquidation: 1234,
            debt: 0,
            estimatedValue: 1000
          },
        ]
      },
    ];

    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, []);

  const isExpandedRow = (key: Key): boolean => {
    return expandedRowKeys.includes(key);
  };

  const getRowClassName = (row: LiquidateTableRow): string => {
    if (!expandedRowKeys || !expandedRowKeys.length) {
      return '';
    }
    return isExpandedRow(row.key) ? style.expandedRow : style.inactiveRow;
  };

  const toggleRowExpand = useCallback((row: LiquidateTableRow) => {
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

  const onSearch = (searchTerm: string): LiquidateTableRow[] => {
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

  // Apply search if initial liquidations list changed
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [tableData]);

  const columnsWidth: Array<number | string> = [250, 90, 150, 150, 200];

  const columns: ColumnType<LiquidateTableRow>[] = useMemo(
    () => [
      {
        title: (
          <SearchInput
            onChange={handleSearchInputChange}
            placeholder="Search by name"
            value={searchQuery}
          />
        ),
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
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'risk');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                  ]
              }
            >
              <span>Risk</span> <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'risk',
        sorter: (a, b) => a.risk - b.risk,
        render: (rate: number) => {
          return <div className={style.rateCell}>{fp(rate * 100)}</div>;
        }
      },
      {
        width: columnsWidth[2],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'liqThreshold');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                  ]
              }
            >
              <span>Liq Threshold</span> <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'liqThreshold',
        sorter: (a, b) => a.liqThreshold - b.liqThreshold,
        render: (rate: number) => {
          return <div className={style.rateCell}>{fp(rate * 100)}</div>;
        }
      },
      {
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'totalDebt');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                  ]
              }
            >
              <span>Total Debt</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'totalDebt',
        sorter: (a, b) => a.totalDebt - b.totalDebt,
        render: (available: number) => {
          return <div className={style.availableCell}>{fu(available)}</div>;
        }
      },
      {
        width: columnsWidth[3],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'tvl');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                  ]
              }
            >
              <span>TVL</span> <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'tvl',
        sorter: (a, b) => a.tvl - b.tvl,
        render: (value: number) => {
          return <div className={style.valueCell}>{fu(value)}</div>;
        }
      },
      {
        title: (
          <div className={style.toggle}>
            <HoneyToggle
              checked={isMyCollectionsFilterEnabled}
              onChange={handleToggle}
            />
            <span className={style.toggleText}>my bids</span>
          </div>
        ),
        render: (_: null, row: LiquidateTableRow) => {
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
                className={classNames(style.table, {
                  [style.emptyTable]: !tableDataFiltered.length
                })}
                expandable={{
                  // we use our own custom expand column
                  showExpandColumn: false,
                  expandedRowKeys: expandedRowKeys,
                  expandedRowRender: record => {
                    return (
                      <div className={style.expandSection}>
                        <div className={style.dashedDivider} />
                        <LiquidateExpandTable data={record.positions} />
                      </div>
                    );
                  }
                }}
              />
              {!tableDataFiltered.length &&
                (isMyCollectionsFilterEnabled ? (
                  <div className={style.emptyStateContainer}>
                    <EmptyStateDetails
                      icon={<div className={style.docIcon} />}
                      title="You didn’t use any collections yet"
                      description="Turn off the filter my collection and choose any collection to borrow money"
                    />
                  </div>
                ) : (
                  <div className={style.emptyStateContainer}>
                    <EmptyStateDetails
                      icon={<div className={style.docIcon} />}
                      title="No collections to display"
                      description="Turn off all filters and clear search inputs"
                    />
                  </div>
                ))}
            </Content>
            <Sider width={350}>
                <LiquidateSidebar collectionId="0" />
            </Sider>
        </LayoutRedesign>
    );
};

export default Liquidate;
