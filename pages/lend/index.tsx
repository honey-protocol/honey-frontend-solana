import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { LendTableRow } from '../../types/lend';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import * as style from '../../styles/markets.css';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyEyes from '/public/nfts/honeyEyes.png';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { Key } from 'antd/lib/table/interface';
import { formatNumber } from '../../helpers/format';
import SearchInput from '../../components/SearchInput/SearchInput';
import debounce from 'lodash/debounce';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { HoneyChart } from '../../components/HoneyChart/HoneyChart';
import {
  deposit,
  withdraw,
  useMarket,
  useHoney,
} from '@honey-finance/sdk';
import {toastResponse, BnToDecimal, BnDivided, ConfigureSDK} from '../../helpers/loanHelpers/index';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

const { formatPercent: fp, formatUsd: fu } = formatNumber;

const Lend: NextPage = () => {
  // Start: SDK integration
  const sdkConfig = ConfigureSDK();

  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
  */
   const { market, marketReserveInfo, parsedReserves, fetchMarket }  = useHoney();
  
   /**
   * @description calls upon the honey sdk - market
   * @params solanas useConnection func. && useConnectedWallet func. && JET ID
   * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
  const { honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  const [totalMarkDeposits, setTotalMarketDeposits] = useState(0);
  const [userTotalDeposits, setUserTotalDeposits] = useState(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);

  /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
  */
   useEffect(() => {
    setTimeout(() => {
      let depositNoteExchangeRate = 0, loanNoteExchangeRate = 0, nftPrice = 0, cRatio = 1;
      
      if(marketReserveInfo) {
        nftPrice = 2;
        depositNoteExchangeRate = BnToDecimal(marketReserveInfo[0].depositNoteExchangeRate, 15, 5);
      }

      if(honeyUser?.deposits().length > 0) {
        // let totalDeposit = BnDivided(honeyUser.deposits()[0].amount, 10, 5) * depositNoteExchangeRate / (10 ** 4)
        let totalDeposit = honeyUser.deposits()[0].amount.div(new BN(10 ** 5)).toNumber() * depositNoteExchangeRate / (10 ** 4);
        setUserTotalDeposits(totalDeposit);
      }
    }, 3000);
  }, [marketReserveInfo, honeyUser]);

  /**
   * @description sets state of marketValue by parsing lamports outstanding debt amount to SOL
   * @params none, requires parsedReserves
   * @returns updates marketValue 
  */
  useEffect(() => {
    if (parsedReserves && parsedReserves[0].reserveState.totalDeposits) {
      let totalMarketDeposits = BnToDecimal(parsedReserves[0].reserveState.totalDeposits, 9, 2);
      setTotalMarketDeposits(totalMarketDeposits);
      // setTotalMarketDeposits(parsedReserves[0].reserveState.totalDeposits.div(new BN(10 ** 9)).toNumber());
    }
  }, [parsedReserves]);

  useEffect(() => {
  }, [reserveHoneyState]);

  /**
   * @description deposits 1 sol
   * @params optional value from user input; amount of SOL
   * @returns succes | failure
  */
  async function executeDeposit(value?: number) {
    try {
      if (!value) return toastResponse('ERROR', 'Deposit failed', 'ERROR');

      console.log('this is value', value);

      const tokenAmount =  value * LAMPORTS_PER_SOL;
      console.log('this is total amount', tokenAmount);
      
      const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
      const tx = await deposit(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
      
      if (tx[0] == 'SUCCESS') {
        toastResponse('SUCCESS', 'Deposit success', 'SUCCESS', 'DEPOSIT');
        
        let refreshedHoneyReserves = await honeyReserves[0].sendRefreshTx();
        const latestBlockHash = await sdkConfig.saberHqConnection.getLatestBlockhash()

        await sdkConfig.saberHqConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: refreshedHoneyReserves,
        });

        await fetchMarket()
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState ==  0 ? setReserveHoneyState(1) : setReserveHoneyState(0);
        });
      } else {
        return toastResponse('ERROR', 'Deposit failed', 'ERROR');
      }
    } catch (error) {
      return toastResponse('ERROR', 'Deposit failed', 'ERROR');
    }
  }

  /**
   * @description withdraws 1 sol
   * @params optional value from user input; amount of SOL
   * @returns succes | failure
  */
  async function executeWithdraw(value?: number) {
    try {
      console.log('this is the value', value)
      if (!value) return toastResponse('ERROR', 'Withdraw failed', 'ERROR');

      const tokenAmount =  value * LAMPORTS_PER_SOL;
      console.log('this is tokenAmount', tokenAmount);
      const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
      const tx = await withdraw(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
      
      if (tx[0] == 'SUCCESS') {
        toastResponse('SUCCESS', 'Withdraw success', 'SUCCESS', 'WITHDRAW');
        let refreshedHoneyReserves = await honeyReserves[0].sendRefreshTx();
        const latestBlockHash = await sdkConfig.saberHqConnection.getLatestBlockhash()

        await sdkConfig.saberHqConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: refreshedHoneyReserves,
        });

        await fetchMarket()
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState ==  0 ? setReserveHoneyState(1) : setReserveHoneyState(0);
        });
      } else {
        return toastResponse('ERROR', 'Withdraw failed ', 'ERROR');
      }
    } catch (error) {
      return toastResponse('ERROR', 'Withdraw failed ', 'ERROR');
    }
  }
  // End: SDK integration

  const isMock = true;
  const [tableData, setTableData] = useState<LendTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<LendTableRow[]>(
    []
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getPositionData = () => {
    if (isMock) {
      const from = new Date()
        .setFullYear(new Date().getFullYear() - 1)
        .valueOf();
      const to = new Date().valueOf();
      return generateMockHistoryData(from, to);
    }
    return [];
  };

  const onSearch = (searchTerm: string): LendTableRow[] => {
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

  // Apply search if initial lend list changed
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [tableData]);

  useEffect(() => {
    const mockData: LendTableRow[] = [
      {
        key: '0',
        name: 'Honey Eyes',
        interest: 10,
        available: 100,
        value: totalMarkDeposits,
        stats: getPositionData()
      }
    ];
    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, []);

  const columns: ColumnType<LendTableRow>[] = useMemo(
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
              <span>Interest</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'rate',
        sorter: (a, b) => a.interest - b.interest,
        render: (rate: number) => {
          return <div className={style.rateCell}>{fp(10)}</div>;
        }
      },
      {
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
        render: (_: null, row: LendTableRow) => {
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
    [tableData, searchQuery]
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
          className={style.table}
          expandable={{
            // we use our own custom expand column
            showExpandColumn: false,
            onExpand: (expanded, row) => setExpandedRowKeys(expanded ? [row.key] : []),
            expandedRowKeys,
            expandedRowRender: record => {
              return (
                <div className={style.expandSection}>
                  <div className={style.dashedDivider} />
                  <HoneyChart title="Interest rate" data={record.stats} />
                </div>
              );
            }
          }}
        />
      </Content>
      <Sider width={350}>
        <LendSidebar 
          collectionId="s"
          executeDeposit={executeDeposit}
          executeWithdraw={executeWithdraw}
        />
      </Sider>
    </LayoutRedesign>
  );
};

export default Lend;
