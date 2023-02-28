import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { LendTableRow } from '../../types/lend';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import * as style from '../../styles/markets.css';
import c from 'classnames';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { Key } from 'antd/lib/table/interface';
import { formatNumber } from '../../helpers/format';
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
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import {
  calcNFT,
  fetchSolPrice,
  populateMarketData
} from 'helpers/loanHelpers/userCollection';
import { ToastProps } from 'hooks/useToast';
import { Skeleton, Typography, Space } from 'antd';
import { pageDescription, pageTitle, center } from 'styles/common.css';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';

import {
  HONEY_GENESIS_BEE_MARKET_NAME,
  HONEY_PROGRAM_ID,
  marketIDs,
  ROOT_CLIENT,
  ROOT_SSR
} from '../../helpers/marketHelpers';
import { HONEY_GENESIS_MARKET_ID } from '../../helpers/marketHelpers/index';
import { marketCollections } from '../../helpers/marketHelpers';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { renderMarket, renderMarketImageByName } from 'helpers/marketHelpers';
import SorterIcon from 'icons/Sorter';
import HoneyToggle from 'components/HoneyToggle/HoneyToggle';
// TODO: fetch based on config
const network = 'mainnet-beta';

const createMarketObject = async (marketData: any) => {
  try {
    return Promise.all(
      marketData.map(async (marketObject: any) => {
        const marketId = marketObject.market.address.toString();
        const { utilization, interestRate } =
          await marketObject.reserves[0].getUtilizationAndInterestRate();
        const totalMarketDebt =
          await marketObject.reserves[0].getReserveState();
        const totalMarketDeposits =
          await marketObject.reserves[0].getReserveState().totalDeposits;
        const nftPrice = await marketObject.market.fetchNFTFloorPriceInReserve(
          0
        );
        const allowanceAndDebt = await marketObject.user.fetchAllowanceAndDebt(
          0,
          'mainnet-beta'
        );

        const allowance = await allowanceAndDebt.allowance;
        const liquidationThreshold =
          await allowanceAndDebt.liquidationThreshold;
        const ltv = await allowanceAndDebt.ltv;
        const ratio = await allowanceAndDebt.ratio.toString();

        const positions = marketObject.positions.map((pos: any) => {
          return {
            obligation: pos.obligation,
            debt: pos.debt,
            owner: pos.owner.toString(),
            ltv: pos.ltv,
            is_healthy: pos.is_healthy,
            highest_bid: pos.highest_bid,
            verifiedCreator: pos.verifiedCreator.toString()
          };
        });

        return {
          marketId,
          utilization: utilization,
          interestRate: interestRate,
          totalMarketDebt: totalMarketDebt,
          totalMarketDeposits: totalMarketDeposits,
          // totalMarketValue: totalMarketDebt + totalMarketDeposits,
          nftPrice: nftPrice,
          bids: marketObject.bids,
          allowance,
          liquidationThreshold,
          ltv,
          ratio,
          positions
        };
      })
    );
  } catch (error) {
    return {};
  }
};

export async function getStaticProps() {
  const createConnection = () => {
    // @ts-ignore
    return new Connection(process.env.NEXT_PUBLIC_RPC_NODE, 'mainnet-beta');
  };

  const arrayOfMarketIds = await marketIDs(marketCollections);

  const response = await fetchAllMarkets(
    createConnection(),
    null,
    HONEY_PROGRAM_ID,
    arrayOfMarketIds,
    false
  );

  return createMarketObject(response).then(res => {
    return {
      props: { res, revalidate: 30 }
    };
  });
}

// @ts-ignore
const Lend: NextPage = ({ res }: { res: any }) => {
  // market specific constants - calculations / ratios / debt / allowance etc.
  const [userTotalDeposits, setUserTotalDeposits] = useState<number>(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
  const [fetchedReservePrice, setFetchedReservePrice] = useState(0);
  const [activeMarketSupplied, setActiveMarketSupplied] = useState(0);
  const [activeMarketAvailable, setActiveMarketAvailable] = useState(0);
  const [marketData, setMarketData] = useState<MarketBundle[]>([]);
  const isMock = true;
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const [activeInterestRate, setActiveInterestRate] = useState(0);
  const [tableData, setTableData] = useState<LendTableRow[]>(marketCollections);
  const [fetchedDataObject, setFetchedDataObject] = useState<MarketBundle>();
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
  const [currentMarketId, setCurrentMarketId] = useState(
    HONEY_GENESIS_MARKET_ID
  );
  const [currentMarketName, setCurrentMarketName] = useState(
    HONEY_GENESIS_BEE_MARKET_NAME
  );
  const [showWeeklyRates, setShowWeeklyRates] = useState(false);

  // init wallet and sdkConfiguration file
  const sdkConfig = ConfigureSDK();
  let walletPK = sdkConfig.sdkWallet?.publicKey;
  /**
   * @description sets the market ID based on market click
   * @params Honey table record - contains all info about a table (aka market)
   * @returns sets the market ID which re-renders page state and fetches market specific data
   */
  async function handleMarketId(record: any) {
    const marketData = renderMarket(record.id);
    setCurrentMarketId(marketData[0].id);
    setCurrentMarketName(marketData[0].name);
  }

  /**
   * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
   * @params value to be formatted
   * @returns requested format
   */
  const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;

  // ************* HOOKS *************
  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
   */
  const { marketReserveInfo, parsedReserves, fetchMarket } = useHoney();

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
  // ************* END OF HOOKS *************
  const [dataRoot, setDataRoot] = useState<String>();

  //  ************* START FETCH MARKET DATA *************
  async function fetchAllMarketData(marketIDs: string[]) {
    const data = await fetchAllMarkets(
      sdkConfig.saberHqConnection,
      sdkConfig.sdkWallet,
      sdkConfig.honeyId,
      marketIDs,
      false
    );
    setDataRoot(ROOT_CLIENT);
    setMarketData(data as unknown as MarketBundle[]);
  }

  useEffect(() => {
    if (!sdkConfig.sdkWallet) return;
    const marketIDs = marketCollections.map(market => market.id);
    fetchAllMarketData(marketIDs);
  }, [sdkConfig.sdkWallet]);

  useEffect(() => {
    console.log('@@-- SSR refresh');
    setDataRoot(ROOT_SSR);
    setMarketData(res as unknown as MarketBundle[]);
  }, [res]);

  //  ************* END FETCH MARKET DATA *************

  //  ************* START FETCH USER BALANCE *************
  // fetches the users balance
  async function fetchWalletBalance(key: PublicKey) {
    try {
      const userBalance =
        (await sdkConfig.saberHqConnection.getBalance(key)) / LAMPORTS_PER_SOL;
      setUserWalletBalance(userBalance);
    } catch (error) {
      console.log('Error', error);
    }
  }

  useEffect(() => {
    if (walletPK) fetchWalletBalance(walletPK);
  }, [walletPK]);
  //  ************* END FETCH USER BALANCE *************

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
      fetchReserveValue(parsedReserves[0], sdkConfig.saberHqConnection);
    }
  }, [parsedReserves]);
  //  ************* END FETCH CURRENT RESERVE PRICE *************

  /**
   * @description deposits X amount of SPL from market
   * @params value: being amount to withdraw | toast: notifications
   * @returns succes | failure
   */
  async function executeDeposit(value?: number, toast?: ToastProps['toast']) {
    if (!toast) return;
    try {
      if (!value) return toast.error('Deposit failed');
      const tokenAmount = new BN(value * LAMPORTS_PER_SOL);
      toast.processing();

      const depositTokenMint = new PublicKey(
        'So11111111111111111111111111111111111111112'
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

        await fetchMarket();

        if (fetchedDataObject) {
          await fetchedDataObject.reserves[0].refresh();
          await fetchedDataObject.user.refresh();

          honeyReservesChange === 0
            ? setHoneyReservesChange(1)
            : setHoneyReservesChange(0);

          if (walletPK) await fetchWalletBalance(walletPK);

          toast.success(
            'Deposit success',
            `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
          );
        } else {
          honeyReservesChange === 0
            ? setHoneyReservesChange(1)
            : setHoneyReservesChange(0);

          if (walletPK) await fetchWalletBalance(walletPK);

          toast.success(
            'Deposit success',
            `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
          );
        }
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
    if (!toast) return;
    try {
      if (!value) return toast.error('Withdraw failed');

      const tokenAmount = new BN(value * LAMPORTS_PER_SOL);
      const depositTokenMint = new PublicKey(
        'So11111111111111111111111111111111111111112'
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

        await fetchMarket();

        if (fetchedDataObject) {
          await fetchedDataObject.reserves[0].refresh();
          await fetchedDataObject.user.refresh();

          honeyReservesChange === 0
            ? setHoneyReservesChange(1)
            : setHoneyReservesChange(0);

          if (walletPK) await fetchWalletBalance(walletPK);

          toast.success(
            'Deposit success',
            `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
          );
        } else {
          honeyReservesChange === 0
            ? setHoneyReservesChange(1)
            : setHoneyReservesChange(0);

          if (walletPK) await fetchWalletBalance(walletPK);

          toast.success(
            'Deposit success',
            `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
          );
        }
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

  /**
   * @description inits each market with their data | happening in userCollection.tsx
   * @params none
   * @returns market object filled with data
   */
  useEffect(() => {
    if (sdkConfig.saberHqConnection) {
      function getData() {
        return Promise.all(
          marketCollections.map(async collection => {
            if (
              collection.id == '' ||
              (initState === true && collection.id !== currentMarketId)
            )
              return collection;

            if (marketData.length) {
              if (
                dataRoot === ROOT_CLIENT &&
                collection.id === currentMarketId
              ) {
                collection.marketData = marketData.filter(
                  marketObject =>
                    marketObject.market.address.toString() === collection.id
                );

                const honeyUser = collection.marketData[0].user;
                const honeyMarket = collection.marketData[0].market;
                const honeyClient = collection.marketData[0].client;
                const parsedReserves =
                  collection.marketData[0].reserves[0].data;
                const mData = collection.marketData[0].reserves[0];

                await populateMarketData(
                  'LEND',
                  ROOT_CLIENT,
                  collection,
                  sdkConfig.saberHqConnection,
                  sdkConfig.sdkWallet,
                  currentMarketId,
                  false,
                  collection.marketData[0].positions,
                  true,
                  honeyClient,
                  honeyMarket,
                  honeyUser,
                  parsedReserves,
                  mData
                );

                collection.stats = getPositionData();

                setActiveInterestRate(collection.rate);
                setActiveMarketSupplied(collection.value);
                setActiveMarketAvailable(collection.available);
                setNftPrice(RoundHalfDown(Number(collection.nftPrice)));
                setFetchedDataObject(collection.marketData[0]);
                collection.userTotalDeposits
                  ? setUserTotalDeposits(collection.userTotalDeposits)
                  : setUserTotalDeposits(0);

                setTimeout(() => {
                  setIsFetchingClientData(false);
                  setIsFetchingData(false);
                }, 2000); // shows 0 for some values for a second before showing values so delay for 2 sec
                return collection;
              } else if (dataRoot === ROOT_SSR) {
                collection.marketData = marketData.filter(
                  marketObject =>
                    //@ts-ignore
                    marketObject.marketId === collection.id
                );
                collection.rate =
                  // @ts-ignore
                  collection.marketData[0].interestRate *
                  100 *
                  // @ts-ignore
                  collection.marketData[0].utilization;
                // @ts-ignore
                collection.allowance = collection.marketData[0].allowance;
                // @ts-ignore
                collection.available =
                  // @ts-ignore
                  collection.marketData[0].totalMarketDeposits;
                collection.value =
                  // @ts-ignore
                  collection.marketData[0].totalMarketDeposits +
                  // @ts-ignore
                  collection.marketData[0].totalMarketDebt.outstandingDebt;
                // @ts-ignore
                collection.connection = sdkConfig.saberHqConnection;
                // @ts-ignore
                collection.nftPrice = collection.marketData[0].nftPrice;
                // @ts-ignore
                collection.utilizationRate =
                  // @ts-ignore
                  collection.marketData[0].utilization;

                setIsFetchingData(false);
                return collection;
              }
            }
            return collection;
          })
        );
      }

      getData()
        .then(result => {
          if (marketData.length) setInitState(true);
          setTableData(result);
          setTableDataFiltered(result);
        })
        .catch(() => setIsFetchingData(false));
    }
  }, [
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    marketData,
    userTotalDeposits,
    currentMarketId,
    honeyReservesChange
  ]);

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
        render: (name: string) => {
          return (
            <div className={style.nameCell}>
              <div className={style.logoWrapper}>
                <div className={style.collectionLogo}>
                  <HexaBoxContainer>
                    {renderMarketImageByName(name)}
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
          return (
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
            <div className={style.valueCell}>{fs(value)}</div>
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
            <div className={style.availableCell}>{fs(available)}</div>
          )
      },
      {
        width: columnsWidth[4],
        title: WeeklyToggle,
        render: (_: null, row: LendTableRow) => {
          return (
            <div className={style.buttonsCell}>
              <HoneyButton variant="text">
                Manage <div className={style.arrowRightIcon} />
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
                    </div>
                    <div className={style.nameCellMobile}>
                      <div className={style.collectionName}>{name}</div>
                    </div>
                  </>
                }
                rightSide={
                  <div className={style.buttonsCell}>
                    <HoneyButton variant="text">
                      Manage <div className={style.arrowRightIcon} />
                    </HoneyButton>
                  </div>
                }
              />

              <HoneyTableRow>
                <div className={c(style.rateCell, style.lendRate)}>
                  {fp(row.rate / (showWeeklyRates ? 52 : 1))}
                </div>
                <div className={style.valueCell}>{fs(row.value)}</div>
                <div className={style.availableCell}>{fs(row.available)}</div>
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
      showWeeklyRates
    ]
  );

  const lendSidebar = () => (
    <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
      <LendSidebar
        collectionId="s"
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
                href="https://buy.moonpay.com"
                rel="noreferrer"
              >
                <HoneyButton style={{ display: 'inline' }} variant="text">
                  Need crypto?
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
