import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { LendTableRow } from '../../types/lend';
import React, {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import * as style from '../../styles/markets.css';
import c from 'classnames';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { Key } from 'antd/lib/table/interface';
import { formatNFTName, formatNumber } from '../../helpers/format';
import SearchInput from '../../components/SearchInput/SearchInput';
import debounce from 'lodash/debounce';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import HoneySider from '../../components/HoneySider/HoneySider';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import { RoundHalfDown } from 'helpers/utils';
import {
  deposit,
  withdraw,
  useMarket,
  useHoney,
  fetchAllMarkets,
  MarketBundle,
  waitForConfirmation,
  fetchReservePrice,
  TReserve
} from '@honey-finance/sdk';
import { BnToDecimal, ConfigureSDK } from '../../helpers/loanHelpers/index';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { populateMarketData } from 'helpers/loanHelpers/userCollection';
import { ToastProps } from 'hooks/useToast';
import { Skeleton, Typography, Space } from 'antd';
import { pageDescription, pageTitle, center } from 'styles/common.css';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';

import {
  HONEY_GENESIS_BEE_MARKET_NAME,
  HONEY_PROGRAM_ID,
  marketIDs,
  marketsTokens,
  renderMarketCurrencyImageByID,
  ROOT_CLIENT,
  ROOT_SSR
} from '../../helpers/marketHelpers';
import { HONEY_GENESIS_MARKET_ID } from '../../helpers/marketHelpers/index';
import { marketCollections } from '../../helpers/marketHelpers';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { renderMarket, renderMarketImageByName } from 'helpers/marketHelpers';
import SorterIcon from 'icons/Sorter';
import HoneyToggle from 'components/HoneyToggle/HoneyToggle';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';
import { FETCH_USER_MARKET_DATA } from 'constants/apiEndpoints';
import { useSolBalance, useTokenBalance } from 'hooks/useSolBalance';
import Image from 'next/image';
// TODO: fetch based on config
const network = 'mainnet-beta';

const Lend: NextPage = () => {
  // init wallet and sdkConfiguration file
  const sdkConfig = ConfigureSDK();
  let walletPK = sdkConfig.sdkWallet?.publicKey;
  let stringyfiedWalletPK = sdkConfig.sdkWallet?.publicKey.toString();

  // whenever a users wallet changes it stores the PK in LS
  useEffect(() => {
    if (stringyfiedWalletPK !== undefined) {
      localStorage.setItem('walletPK', stringyfiedWalletPK);
    }
  }, [stringyfiedWalletPK]);

  // market specific constants - calculations / ratios / debt / allowance etc.
  const [userTotalDeposits, setUserTotalDeposits] = useState<number>(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [fetchedReservePrice, setFetchedReservePrice] = useState(0);
  const [activeMarketSupplied, setActiveMarketSupplied] = useState(0);
  const [activeMarketAvailable, setActiveMarketAvailable] = useState(0);
  const [marketData, setMarketData] = useState<MarketBundle[]>([]);
  const isMock = true;
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const [activeInterestRate, setActiveInterestRate] = useState(0);
  const [tableData, setTableData] = useState<LendTableRow[]>(marketCollections);
  const [tableDataFiltered, setTableDataFiltered] =
    useState<LendTableRow[]>(marketCollections);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isFetchingClientData, setIsFetchingClientData] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);
  const [honeyReservesChange, setHoneyReservesChange] = useState(0);
  const [initState, setInitState] = useState(false);
  // Sets market ID which is used for fetching market specific data
  // each market currently is a different call and re-renders the page
  const [currentMarketId, setCurrentMarketId] = useState('');
  const [currentMarketName, setCurrentMarketName] = useState('');
  const [showWeeklyRates, setShowWeeklyRates] = useState(false);

  const selectedMarket = marketCollections.find(
    collection => collection.id === currentMarketId
  );
  //Wallet balance
  const {
    balance: walletSolBalance,
    loading: isLoadingSolBalance,
    refetch: refetchSolBalance
  } = useSolBalance();

  const {
    balance: walletLoanTokenBalance,
    loading: isLoadingWalletLoanTokenBalance,
    refetch: refetchWalletLoanTokenBalance
  } = useTokenBalance(
    selectedMarket?.constants.marketLoanCurrencyTokenMintAddress ?? ''
  );

  const userWalletBalance =
    selectedMarket?.loanCurrency === 'SOL'
      ? walletSolBalance
      : walletLoanTokenBalance;
  const isLoadingWalletBalance =
    selectedMarket?.loanCurrency === 'SOL'
      ? isLoadingSolBalance
      : isLoadingWalletLoanTokenBalance;
  const refetchWalletBalance =
    selectedMarket?.loanCurrency === 'SOL'
      ? refetchSolBalance
      : refetchWalletLoanTokenBalance;

  /**
   * @description sets the market ID based on market click
   * @params Honey table record - contains all info about a table (aka market)
   * @returns sets the market ID which re-renders page state and fetches market specific data
   */
  async function handleMarketId(record: any) {
    const marketData = renderMarket(record.id);
    setCurrentMarketId(marketData[0].id);
    setCurrentMarketName(marketData[0].name);
    setIsFetchingClientData(true);
    window.history.pushState({}, '', `/lend?id=${record.id}`);
  }

  /**
   * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
   * @params value to be formatted
   * @returns requested format
   */
  const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;
  const [parsedReserves, setParsedReserves] = useState<TReserve>();

  // ************* HOOKS *************
  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
   */
  // const { marketReserveInfo, parsedReserves, fetchMarket } = useHoney();

  /**
   * @description calls upon the honey sdk
   * @params  useConnection func. | useConnectedWallet func. | honeyID | marketID
   * @returns honeyUser | honeyReserves - used for interaction regarding the SDK
   */
  const { honeyUser, honeyReserves, honeyMarket } = useMarket(
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    sdkConfig.honeyId,
    currentMarketId
  );

  useEffect(() => {
    if (honeyReserves) setParsedReserves(honeyReserves[0].data);
  }, honeyReserves);

  // ************* END OF HOOKS *************
  const [dataRoot, setDataRoot] = useState<String>();

  //  ************* START FETCH MARKET DATA *************

  console.log({ isFetchingData }, '@dataload');

  const onUrlChange = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const market = marketCollections.find(collection => collection.id === id);
    if (id && market) {
      setCurrentMarketId(id);
      if (!isFetchingData) {
        setExpandedRowKeys([market.key]);
        setIsFetchingClientData(true);
      }
    }
  }, [isFetchingData]);

  useEffect(() => {
    //call on url change on mount so that the initial id can be gotten the the url if any
    onUrlChange();
  }, [onUrlChange]);

  useEffect(() => {
    window.addEventListener('popstate', onUrlChange);
    () => window.removeEventListener('popstate', onUrlChange);
  }, [onUrlChange]);

  // fetches market level data from API
  const fetchMarketLevelDataFromAPI = useCallback(async () => {
    try {
      setIsFetchingData(true);
      const response = await fetch(FETCH_USER_MARKET_DATA);
      const result: MarketBundle[] = await response.json();

      setDataRoot(ROOT_SSR);
      // setMarketData(result as unknown as MarketBundle[]);
      console.log({ result }, '@result', 'server side');

      const marketDataResult = marketCollections.map(collection => {
        if (result.length) {
          collection.marketData = result.filter(
            marketObject =>
              // @ts-ignore
              marketObject.marketId === collection.id
          );

          console.log({ collection }, '@data ssr');

          // @ts-ignore
          const {
            interestRate,
            utilization,
            allowance,
            totalMarketDeposits,
            totalMarketDebt,
            nftPrice
            // @ts-ignore
          } = collection.marketData[0].data;

          collection.rate = interestRate * 100 * utilization;
          collection.allowance = allowance;
          collection.available = totalMarketDeposits;
          collection.value = totalMarketDebt
            ? totalMarketDebt + totalMarketDeposits
            : totalMarketDeposits;
          collection.nftPrice = nftPrice;
          collection.utilizationRate = utilization;
          collection.connection = sdkConfig.saberHqConnection;

          return collection;
        }

        return collection;
      });

      // if (marketData.length) setInitState(true);
      setTableData(marketDataResult);
      setTableDataFiltered(marketDataResult);

      return marketDataResult;
    } catch (error) {
      console.log(`Error fetching SSR: ${error}`);
    } finally {
      setIsFetchingData(false);
    }
  }, [sdkConfig.saberHqConnection]);

  useEffect(() => {
    fetchMarketLevelDataFromAPI();
  }, [fetchMarketLevelDataFromAPI]);

  //fetch market data and user data from sdk
  const marketDataCache: MutableRefObject<{
    [id: string]: Array<MarketBundle>;
  }> = useRef({});

  const fetchMarketDataObj = useCallback(
    async (marketId, connection, wallet, honeyId) => {
      //Check cache if object exists
      if (marketDataCache.current[marketId]) {
        return marketDataCache.current[marketId];
      }

      const data: MarketBundle[] = await fetchAllMarkets(
        connection,
        wallet,
        honeyId,
        [marketId],
        false
      );

      //Update cache
      marketDataCache.current[marketId] = data;
      return data;
    },
    []
  );

  const fetchCurrentMarketData = useCallback(
    async (silentRefresh?: boolean) => {
      if (!currentMarketId) return;

      const collection = marketCollections.find(
        collection => collection.id === currentMarketId
      );

      if (!collection) return;

      if (!silentRefresh) {
        setIsFetchingClientData(true);
      }

      try {
        const totalMarketDeposits =
          honeyUser.reserves[0].getReserveState().totalDeposits;
        const totalMarketDebt =
          honeyUser.reserves[0].getReserveState().outstandingDebt;
        const totalMarketValue = totalMarketDeposits + totalMarketDebt;
        const { utilization, interestRate } =
          honeyUser.reserves[0].getUtilizationAndInterestRate();

        const totalUserDeposits = await honeyUser.fetchUserDeposits(0);
        setUserTotalDeposits(totalUserDeposits);

        collection.available = totalMarketDeposits;
        collection.value = totalMarketValue;
        // TODO: fix util rate based off object coming in
        collection.utilizationRate = utilization;
        collection.rate = interestRate * 100 * utilization;

        // collection.stats = getPositionData();

        setActiveInterestRate(collection.rate);
        setActiveMarketSupplied(collection.value);
        setActiveMarketAvailable(collection.available);
        // setFetchedDataObject(collection.marketData[0]);

        const newMarketData = marketCollections.map(marketCollection =>
          marketCollection.id === collection.id ? collection : marketCollection
        );

        // Update market table data
        setTableData(newMarketData);
        setTableDataFiltered(newMarketData);
      } catch (error) {
        console.log('Error fetching selected market data', '@current');
      } finally {
        console.log('@dataload');
        setIsFetchingData(false);
        setIsFetchingClientData(false);
      }
    },
    [honeyUser, honeyReservesChange]
  );

  useEffect(() => {
    fetchCurrentMarketData();
  }, [fetchCurrentMarketData]);

  //  ************* END FETCH MARKET DATA *************

  //  ************* START FETCH CURRENT RESERVE PRICE *************
  // fetches the current reserve price
  async function fetchReserveValue(reserves: TReserve, connection: Connection) {
    const reservePrice = await fetchReservePrice(reserves, connection);
    setFetchedReservePrice(reservePrice);
  }

  /**
   * @description sets state of marketValue by parsing lamports outstanding debt amount to SOL
   * @params none, requires parsedReserves
   * @returns updates marketValue
   */
  useEffect(() => {
    if (parsedReserves) {
      fetchReserveValue(parsedReserves, sdkConfig.saberHqConnection);
    }
  }, [parsedReserves]);
  //  ************* END FETCH CURRENT RESERVE PRICE *************

  /**
   * @description deposits X amount of SPL from market
   * @params value: being amount to withdraw | toast: notifications
   * @returns succes | failure
   */
  async function executeDeposit(value?: number, toast?: ToastProps['toast']) {
    if (!toast || !selectedMarket) return;
    try {
      if (!value) return toast.error('Deposit failed');
      const tokenAmount = new BN(
        value * marketsTokens[selectedMarket.loanCurrency].decimals
      );
      toast.processing();

      const depositTokenMint = new PublicKey(
        selectedMarket?.constants.marketLoanCurrencyTokenMintAddress
      );

      const tx = await deposit(
        honeyUser,
        tokenAmount,
        depositTokenMint,
        honeyReserves
      );

      if (tx[0] == 'SUCCESS') {
        const confirmation = tx[1];
        const confirmationHash = confirmation[0];

        await waitForConfirmation(
          sdkConfig.saberHqConnection,
          confirmationHash
        );

        // await fetchMarket();

        await fetchCurrentMarketData(true);

        // if (fetchedDataObject) {
        await honeyUser.reserves[0].refresh();
        await honeyUser.refresh();

        honeyReservesChange === 0
          ? setHoneyReservesChange(1)
          : setHoneyReservesChange(0);

        if (walletPK) await refetchWalletBalance();

        toast.success(
          'Deposit success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
        // } else {
        //   honeyReservesChange === 0
        //     ? setHoneyReservesChange(1)
        //     : setHoneyReservesChange(0);

        //   if (walletPK) await refetchWalletBalance();

        //   toast.success(
        //     'Deposit success',
        //     `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        //   );
        // }
      } else {
        return toast.error('Deposit failed');
      }
    } catch (error) {
      return toast.error('Deposit failed');
    }
  }
  /**
   * @description withdraws X amount of SPL token from market
   * @params value: being amount to withdraw | toast: notifications
   * @returns succes | failure
   */
  async function executeWithdraw(value: number, toast?: ToastProps['toast']) {
    if (!toast || !selectedMarket) return;
    try {
      if (!value) return toast.error('Withdraw failed');

      const tokenAmount = new BN(
        value * marketsTokens[selectedMarket.loanCurrency].decimals
      );
      const depositTokenMint = new PublicKey(
        selectedMarket?.constants.marketLoanCurrencyTokenMintAddress
      );

      toast.processing();
      const tx = await withdraw(
        honeyUser,
        tokenAmount,
        depositTokenMint,
        honeyReserves
      );

      if (tx[0] == 'SUCCESS') {
        const confirmation = tx[1];
        const confirmationHash = confirmation[0];

        await waitForConfirmation(
          sdkConfig.saberHqConnection,
          confirmationHash
        );

        // await fetchMarket();

        await fetchCurrentMarketData(true);

        // if (fetchedDataObject) {
        //   await fetchedDataObject.reserves[0].refresh();
        //   await fetchedDataObject.user.refresh();
        await honeyUser.reserves[0].refresh();
        await honeyUser.refresh();

        honeyReservesChange === 0
          ? setHoneyReservesChange(1)
          : setHoneyReservesChange(0);

        if (walletPK) refetchWalletBalance();

        toast.success(
          'Withdraw success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
      } else {
        return toast.error('Withdraw failed ');
      }
    } catch (error) {
      return toast.error('Withdraw failed ');
    }
  }

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };
  /**
   * @description
   * @params
   * @returns
   */
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

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const onSearch = (searchTerm: string): LendTableRow[] => {
    if (!searchTerm) {
      return [...tableData];
    }
    const r = new RegExp(searchTerm, 'mi');
    return [...tableData].filter(row => {
      return r.test(row.name);
    });
  };

  const handleRowClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    record: LendTableRow
  ) => {
    setCurrentMarketId(record.id);
    showMobileSidebar();
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

  const handleToggle = (checked: boolean) => {
    setIsMyCollectionsFilterEnabled(checked);
  };

  const WeeklyToggle = () => (
    <div className={style.headerCell['disabled']}>
      <Space direction="horizontal">
        <HoneyToggle
          defaultChecked
          onChange={value => {
            setShowWeeklyRates(value);
          }}
          title="Weekly"
          checked={showWeeklyRates}
        />{' '}
        WEEKLY
      </Space>
    </div>
  );

  const MyCollectionsToggle = () => null;
  // handle search form- filter collections
  const SearchForm = () => {
    return (
      <SearchInput
        onChange={handleSearchInputChange}
        placeholder="Search by name"
        value={searchQuery}
      />
    );
  };

  const columnsWidth: Array<number | string> = [240, 150, 150, 150, 150];
  // Render Desktop Data
  const columns: ColumnType<LendTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        title: SearchForm,
        dataIndex: 'name',
        key: 'name',
        render: (name: string, data: LendTableRow) => {
          return (
            <HoneyTooltip
              trigger={['hover']}
              title={`${data.name}/${data.loanCurrency}`}
            >
              <div className={style.nameCell}>
                <div className={style.logoWrapper}>
                  <div className={style.collectionLogo}>
                    <HexaBoxContainer>
                      {renderMarketImageByName(name)}
                    </HexaBoxContainer>
                  </div>

                  <div className={c(style.collectionLogo, style.secondaryLogo)}>
                    <HexaBoxContainer>
                      {renderMarketCurrencyImageByID(data.id)}
                    </HexaBoxContainer>
                  </div>
                </div>
                <div
                  className={style.collectionName}
                >{`${data.name}/${data.loanCurrency}`}</div>
              </div>
            </HoneyTooltip>
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
              {showWeeklyRates ? (
                <>
                  {' '}
                  <span>Weekly rate</span>{' '}
                </>
              ) : (
                <>
                  {' '}
                  <span>Yearly rate</span>{' '}
                </>
              )}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'rate',
        sorter: (a: any = 0, b: any = 0) => a.rate - b.rate,
        render: (rate: number, market: any) => {
          return isFetchingData ? (
            <div className={center}>
              <Skeleton.Button size="small" active />
            </div>
          ) : (
            <div className={c(style.rateCell, style.lendRate)}>
              {fp(rate / (showWeeklyRates ? 52 : 1))}
            </div>
          );
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
              <span>Supplied</span>{' '}
              <div className={style.sortIcon[sortOrder]}>
                <SorterIcon active={sortOrder !== 'disabled'} />
              </div>
            </div>
          );
        },
        dataIndex: 'value',
        sorter: (a, b) => a.value - b.value,
        render: (value: number, market: any) =>
          isFetchingData ? (
            <div className={center}>
              <Skeleton.Button size="small" active />
            </div>
          ) : (
            <div className={style.currencyValueCell}>
              <Image
                src={market.constants.marketLoanCurrencyImage}
                alt={market.loanCurrency}
                width={20}
                height={20}
              />
              <div className={style.valueCell}>{fs(value)}</div>
            </div>
          )
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
              <div className={style.sortIcon[sortOrder]}>
                <SorterIcon active={sortOrder !== 'disabled'} />
              </div>
            </div>
          );
        },
        dataIndex: 'available',
        sorter: (a, b) => a.available - b.available,
        render: (available: number, market: any) =>
          isFetchingData ? (
            <div className={center}>
              <Skeleton.Button size="small" active />
            </div>
          ) : (
            <div className={style.currencyValueCell}>
              <Image
                src={market.constants.marketLoanCurrencyImage}
                alt={market.loanCurrency}
                width={20}
                height={20}
              />
              <div className={style.availableCell}>{fs(available)}</div>
            </div>
          )
      },
      {
        width: columnsWidth[4],
        title: WeeklyToggle,
        render: (_: null, row: LendTableRow) => {
          return (
            <div className={style.buttonsCell}>
              <HoneyButton variant="text">
                Select <div className={style.arrowRightIcon} />
              </HoneyButton>
            </div>
          );
        }
      }
    ],
    [
      tableData,
      isMyCollectionsFilterEnabled,
      searchQuery,
      tableDataFiltered,
      currentMarketId,
      isFetchingData,
      showWeeklyRates,
      currentMarketId
    ]
  );
  // Render Mobile Data
  const columnsMobile: ColumnType<LendTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        dataIndex: 'name',
        key: 'name',
        render: (name: string, row: LendTableRow) => {
          return (
            <>
              <HoneyTableNameCell
                leftSide={
                  <>
                    <div className={style.logoWrapper}>
                      <div className={style.collectionLogo}>
                        <HexaBoxContainer>
                          {renderMarketImageByName(name)}
                        </HexaBoxContainer>
                      </div>

                      <div
                        className={c(style.collectionLogo, style.secondaryLogo)}
                      >
                        <HexaBoxContainer>
                          {renderMarketCurrencyImageByID(row.id)}
                        </HexaBoxContainer>
                      </div>
                    </div>
                    <div className={style.nameCellMobile}>
                      <div className={style.collectionName}>
                        {formatNFTName(`${name}/${row.loanCurrency}`, 20)}
                      </div>
                    </div>
                  </>
                }
                rightSide={
                  <div className={style.buttonsCell}>
                    <HoneyButton variant="text">
                      Select <div className={style.arrowRightIcon} />
                    </HoneyButton>
                  </div>
                }
              />

              <HoneyTableRow>
                <div className={c(style.rateCell, style.lendRate)}>
                  {fp(row.rate / (showWeeklyRates ? 52 : 1))}
                </div>
                <div className={style.valueCell}>
                  <div className={style.currencyValueCell}>
                    <Image
                      src={row.constants?.marketLoanCurrencyImage ?? ''}
                      alt={row.loanCurrency}
                      width={16}
                      height={16}
                    />
                    {fs(row.value)}
                  </div>
                </div>
                <div className={style.availableCell}>
                  <div className={style.currencyValueCell}>
                    <Image
                      src={row.constants?.marketLoanCurrencyImage ?? ''}
                      alt={row.loanCurrency}
                      width={16}
                      height={16}
                    />
                    {fs(row.available)}
                  </div>
                </div>
              </HoneyTableRow>
            </>
          );
        }
      }
    ],
    [
      isMyCollectionsFilterEnabled,
      tableData,
      searchQuery,
      currentMarketId,
      showWeeklyRates,
      isFetchingData
    ]
  );

  const lendSidebar = () => (
    <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
      <LendSidebar
        executeDeposit={executeDeposit}
        executeWithdraw={executeWithdraw}
        userTotalDeposits={userTotalDeposits}
        available={activeMarketAvailable}
        value={activeMarketSupplied}
        userWalletBalance={userWalletBalance}
        fetchedReservePrice={fetchedReservePrice}
        onCancel={hideMobileSidebar}
        marketImage={renderMarketImageByName(currentMarketName)}
        currentMarketId={currentMarketId}
        activeInterestRate={activeInterestRate}
        isFetchingData={isFetchingClientData}
      />
    </HoneySider>
  );

  return (
    <LayoutRedesign>
      <HoneyContent sidebar={lendSidebar()}>
        <div>
          <Typography.Title className={pageTitle}>Lend</Typography.Title>
          <Typography.Text className={pageDescription}>
            Earn yield by depositing crypto into NFT markets.{' '}
            <span>
              <a
                target="_blank"
                href="https://docs.honey.finance/lending-protocol/lending"
                rel="noreferrer"
              >
                <HoneyButton style={{ display: 'inline' }} variant="text">
                  How it works?
                </HoneyButton>
              </a>
            </span>
          </Typography.Text>
        </div>
        <div className={style.hideTablet}>
          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            columns={columns}
            dataSource={tableDataFiltered}
            pagination={false}
            isLoading={isFetchingData}
            className={style.table}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleMarketId(record)
              };
            }}
            selectedRowsKeys={[
              tableDataFiltered.find(data => data.id === currentMarketId)
                ?.key || ''
            ]}

            // TODO: uncomment when the chart has been replaced and implemented
            // expandable={{
            //   // we use our own custom expand column
            //   showExpandColumn: false,
            //   onExpand: (expanded, row) =>
            //     setExpandedRowKeys(expanded ? [row.key] : []),
            //   expandedRowKeys,
            //   expandedRowRender: record => {
            //     return (
            //       <div className={style.expandSection}>
            //         <div className={style.dashedDivider} />
            //         <HoneyChart title="Interest rate" data={record.stats} />
            //       </div>
            //   );
            // }
            // }}
          />
        </div>
        <div className={style.showTablet}>
          <div
            className={c(
              style.mobileTableHeader,
              style.mobileSearchAndToggleContainer
            )}
          >
            <div className={c(style.mobileRow, style.mobileSearchContainer)}>
              <SearchForm />
            </div>
            <div className={c(style.mobileToggleContainer)}>
              <WeeklyToggle />
            </div>
          </div>
          <div className={c(style.mobileTableHeader)}>
            <div className={style.tableCell}>Interest</div>
            <div className={style.tableCell}>Supplied</div>
            <div className={style.tableCell}>Available</div>
          </div>
          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            columns={columnsMobile}
            dataSource={tableDataFiltered}
            pagination={false}
            showHeader={false}
            className={style.table}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleRowClick(event, record)
              };
            }}
          />
        </div>
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Lend;
