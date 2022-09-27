import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import LiquidateSidebar from '../../components/LiquidateSidebar/LiquidateSidebar';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import classNames from 'classnames';
import * as style from '../../styles/markets.css';
import EmptyStateDetails from '../../components/EmptyStateDetails/EmptyStateDetails';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Key } from 'antd/lib/table/interface';
import HoneyToggle from '../../components/HoneyToggle/HoneyToggle';
import debounce from 'lodash/debounce';
import SearchInput from '../../components/SearchInput/SearchInput';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyEyes from '/public/nfts/honeyEyes.png';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { formatNumber } from '../../helpers/format';
import { LiquidateTableRow } from '../../types/liquidate';
import { LiquidateExpandTable } from '../../components/LiquidateExpandTable/LiquidateExpandTable';
import { useAnchor, LiquidatorClient, useAllPositions, NftPosition } from '@honey-finance/sdk';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { useConnectedWallet } from '@saberhq/use-solana';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const { formatPercent: fp, formatUsd: fu } = formatNumber;

const Liquidate: NextPage = () => {
  // start sdk integration
  // init anchor
  const { program } = useAnchor();
  // create wallet instance for PK
  const wallet = useConnectedWallet();
  /**
    * @description sets program | market | connection | wallet
    * @params none
    * @returns connection with sdk
  */
  const sdkConfig = ConfigureSDK();
  /**
    * @description fetches open nft positions
    * @params connection | wallet | honeyprogramID | honeymarketID
    * @returns loading | nft positions | error
  */
  const { ...status } = useAllPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  /**
    * @description declare state
    * @params none
    * @returns open positions | bidding data | userbid | user position
  */
  const [fetchedPositions, setFetchedPositions] = useState<Array<NftPosition>>();
  const [hasPosition, setHasPosition] = useState(false);
  const [highestBiddingAddress, setHighestBiddingAddress] = useState('');
  const [highestBiddingValue, setHighestBiddingValue] = useState(0);
  const [currentUserBid, setCurrentUserBid] = useState(0);
  const [userInput, setUserInput] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [refetchState, setRefetchState] = useState(false);
  // create stringyfied instance of walletPK
  let stringyfiedWalletPK = sdkConfig.sdkWallet?.publicKey.toString();

  /**
   * @description sets the state if user has open bid
   * @params array of bids
   * @returns state change
  */
  async function handleBiddingState(biddingArray: any, positions: any) {
    biddingArray.map((obligation: any) => {
      if (obligation.bidder == stringyfiedWalletPK) {
        setHasPosition(true);
        setCurrentUserBid(Number(obligation.bidLimit / LAMPORTS_PER_SOL));
      }
    });

    let sorted = await positions.sort((first: any,second: any) => first.is_healthy - second.is_healthy).reverse();
    let highestBid = biddingArray.sort((first: any, second: any) => first.bidLimit - second.bidLimit).reverse();

    if (highestBid[0]) {
      setHighestBiddingAddress(highestBid[0].bidder);
      setHighestBiddingValue(highestBid[0].bidLimit / LAMPORTS_PER_SOL);
    }

    setFetchedPositions(sorted);
    console.log('these are the positions', sorted);
  }

  const [statusState, setStatusState] = useState(false);

  /**
   * @description checks if there are positions, if so set state
   * @params none
   * @returns state positions && bids
  */
  useEffect(() => {
    if (status.positions) {
      setStatusState(true);
      // if (status.bids) handleBiddingState(status.bids, status.positions);
    }

    return;
  }, [status.positions]);

  // triggers if there are positions - inits fetch positions
  useEffect(() => {
    if (statusState == true && status.bids && status.positions) {
      // handleHealthPositions(status)
      handleBiddingState(status.bids, status.positions);
    }

    return;
  }, [statusState]);


  const [tableData, setTableData] = useState<LiquidateTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<
    LiquidateTableRow[]
  >([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [isMyBidsFilterEnabled, setIsMyBidsFilterEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    const mockData: LiquidateTableRow[] = [
      {
        key: '0',
        name: 'Honey Eyes',
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
          }
        ]
      },
    ];

    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsMyBidsFilterEnabled(checked);
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
                    <Image src={honeyEyes} />
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
          const sortOrder = getColumnSortStatus(sortColumns, 'risk');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Risk</span>
              <div className={style.sortIcon[sortOrder]} />
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
              <span>Liq %</span>
              <div className={style.sortIcon[sortOrder]} />
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
              <span>TVL</span>
              <div className={style.sortIcon[sortOrder]} />
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
              checked={isMyBidsFilterEnabled}
              onChange={handleToggle}
            />
            <span className={style.toggleText}>my bids</span>
          </div>
        ),
        render: (_: null, row: LiquidateTableRow) => {
          return (
            <div className={style.buttonsCell}>
              <HoneyButton variant="text">
                View <div className={style.arrowIcon} />
              </HoneyButton>
            </div>
          );
        }
      }
    ],
    [isMyBidsFilterEnabled, tableData, searchQuery]
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
          className={classNames(style.table, {
            [style.emptyTable]: !tableDataFiltered.length
          })}
          expandable={{
            // we use our own custom expand column
            showExpandColumn: false,
            onExpand: (expanded, row) =>
              setExpandedRowKeys(expanded ? [row.key] : []),
            expandedRowKeys,
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
          (isMyBidsFilterEnabled ? (
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
