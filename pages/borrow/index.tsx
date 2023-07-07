import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import c from 'classnames';
import classNames from 'classnames';
import BN from 'bn.js';
import {
  BorrowSidebarMode,
  HoneyTableColumnType,
  MarketTablePosition,
  MarketTableRow
} from '../../types/markets';
import React, {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { formatNFTName, formatNumber } from '../../helpers/format';
import Image from 'next/image';
import { ColumnTitleProps, Key } from 'antd/lib/table/interface';
import debounce from 'lodash/debounce';
import SearchInput from '../../components/SearchInput/SearchInput';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { ConfigureSDK } from '../../helpers/loanHelpers/index';
import { FETCH_USER_MARKET_DATA } from 'constants/apiEndpoints';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import HealthLvl from '../../components/HealthLvl/HealthLvl';
import useFetchNFTByUser from 'hooks/useNFTV3';
import {
  borrowAndRefresh,
  depositNFT,
  repayAndRefresh,
  useBorrowPositions,
  useHoney,
  useMarket,
  fetchAllMarkets,
  MarketBundle,
  waitForConfirmation,
  fetchReservePrice,
  withdrawNFT,
  TReserve,
  CollateralNFTPosition,
  HoneyUser,
  useAnchor
} from '@honey-finance/sdk';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { ToastProps } from 'hooks/useToast';
import { RoundHalfDown } from 'helpers/utils';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import HoneySider from '../../components/HoneySider/HoneySider';
import { TABLET_BP } from '../../constants/breakpoints';
import useWindowSize from '../../hooks/useWindowSize';
import { Skeleton, Typography, Space, Empty, Spin } from 'antd';
import { pageDescription, pageTitle, center, spinner } from 'styles/common.css';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';
import HoneyTableNameCell from '../../components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTooltip from '../../components/HoneyTooltip/HoneyTooltip';
import {
  handleOpenPositions,
  renderMarketName,
  renderMarketImageByID,
  ROOT_SSR,
  ROOT_CLIENT,
  renderMarketCurrencyImageByID,
  marketsTokens,
  HONEY_PROGRAM_ID,
  marketIDs
} from '../../helpers/marketHelpers';
import {
  renderMarketImageByName,
  HONEY_GENESIS_MARKET_ID,
  COLLATERAL_FACTOR,
  marketCollections,
  OpenPositions
} from 'helpers/marketHelpers';

import CreateMarketSidebar from '../../components/CreateMarketSidebar/CreateMarketSidebar';
// TODO: change to dynamic value
const network = 'mainnet-beta';
import SorterIcon from 'icons/Sorter';
import ExpandedRowIcon from 'icons/ExpandedRowIcon';
import HoneyToggle from 'components/HoneyToggle/HoneyToggle';
import useFetchCollateralNFTPositions from 'hooks/useFetchCollateralNFTPositions';
import { useFetchUserLevelData } from 'hooks/useFetchUserLevelData';
import { roundTwoDecimalsUp } from 'helpers/math/math';
// import { network } from 'pages/_app';

const cloudinary_uri = process.env.CLOUDINARY_URI;

/**
 * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
 * @params value to be formatted
 * @returns requested format
 */
const {
  format: f,
  formatPercent: fp,
  formatSol: fs,
  formatShortName: fsn
} = formatNumber;

const Markets: NextPage = () => {
  // init wallet and sdkConfiguration file
  const wallet = useConnectedWallet() || null;
  const sdkConfig = ConfigureSDK();
  let stringyfiedWalletPK = sdkConfig.sdkWallet?.publicKey.toString();
  const { disconnect } = useSolana();

  // Sets market ID which is used for fetching market specific data
  // each market currently is a different call and re-renders the page

  const [currentMarketId, setCurrentMarketId] = useState('');
  const [currentVerifiedCreator, setCurrentVerifiedCreator] = useState('');
  const [fetchedDataObject, setFetchedDataObject] = useState<MarketBundle>();

  /**
   * @description fetches all nfts in users wallet
   * @params wallet
   * @returns array of:
   * [0] users nfts
   * [1] loading state
   * [2] reFetch function which can be called after deposit or withdraw and updates nft list
   */

  const selectedMarket = marketCollections.find(
    collection => collection.id === currentMarketId
  );

  const [NFTs, isLoadingNfts, refetchNfts] = useFetchNFTByUser(
    wallet,
    selectedMarket?.verifiedCreator
  );

  /**
   * @description fetches honey client | honey user | honey reserves | honey market from SDK
   * @params  useConnection func. | useConnectedWallet func. | honeyID | marketID
   * @returns honeyUser | honeyReserves - used for interaction regarding the SDK
   */
  const { honeyClient, honeyUser, honeyReserves, honeyMarket } = useMarket(
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    sdkConfig.honeyId,
    currentMarketId
  );

  // fetches the floor price of the active market and sets it
  const fetchMarketNFTFloor = useCallback(async () => {
    if (!honeyMarket) return;
    const nftPrice = await honeyMarket.fetchNFTFloorPriceInReserve(0);
    nftPrice !== 0 ? setNftPrice(RoundHalfDown(nftPrice)) : setNftPrice(0);
  }, [honeyMarket]);

  // resets the floor price based on honeyMarket change
  useEffect(() => {
    fetchMarketNFTFloor();
  }, [fetchMarketNFTFloor]);

  const { program } = useAnchor();
  const [mintArray, setMintArray] = useState<Array<PublicKey>>([]);
  // whenever a users wallet changes it stores the PK in LS
  useEffect(() => {
    refetchNfts({});
    if (stringyfiedWalletPK !== undefined) {
      localStorage.setItem('walletPK', stringyfiedWalletPK);
    }
  }, [stringyfiedWalletPK]);

  const [refreshMint, setRefreshMint] = useState(0);

  let walletPK = localStorage.getItem('walletPK');

  useEffect(() => {
    if (walletPK && currentMarketId) {
      HoneyUser.userObligationData(
        program,
        new PublicKey(currentMarketId),
        new PublicKey(walletPK),
        new PublicKey(HONEY_PROGRAM_ID)
      )
        .then(res => {
          setMintArray(res.collateralNftMint);
        })
        .catch(err => {
          setMintArray([]);
          console.log(`Error fetching mint array ${err}`);
        });
    }
  }, [refreshMint, currentMarketId, walletPK]);

  /**
   * @description fetches collateral nft positions | refresh positions (func) from SDK
   * @params useConnection func. | useConnectedWallet func. | honeyID | marketID
   * @returns collateralNFTPositions | loanPositions | loading | error
   */
  let { loading, collateralNFTPositions, error, refreshPositions } =
    useFetchCollateralNFTPositions(
      sdkConfig.saberHqConnection,
      mintArray,
      currentVerifiedCreator
    );

  /**
   * @description sets the market ID based on market click
   * @params Honey table record - contains all info about a table (aka market / collection)
   * @returns sets the market ID which re-renders page state and fetches market specific data
   */
  async function handleMarketId(record: any) {
    if (sdkConfig.sdkWallet === null) {
      setCurrentMarketId(record.id);
      setCurrentVerifiedCreator(record.verifiedCreator);
      window.history.pushState({}, '', `/borrow?id=${record.id}`);
    } else {
      setCurrentMarketId(record.id);
      setCurrentVerifiedCreator(record.verifiedCreator);
      window.history.pushState({}, '', `/borrow?id=${record.id}`);
      setIsFetchingClientData(true);
    }
    // refetchUserLevelData();
  }

  console.log({ currentMarketId });

  // market specific constants - calculations / ratios / debt / allowance etc.
  const [nftPrice, setNftPrice] = useState(0);
  const [userAllowance, setUserAllowance] = useState(0);
  const [loanToValue, setLoanToValue] = useState(0);
  const [userDebt, setUserDebt] = useState(0);
  const [fetchedReservePrice, setFetchedReservePrice] = useState(0);
  const [activeInterestRate, setActiveInterestRate] = useState(0);
  const obligationCount = collateralNFTPositions?.length;

  // calculation of health percentage
  const healthPercent = obligationCount
    ? ((nftPrice * obligationCount - userDebt / COLLATERAL_FACTOR) /
        (nftPrice * obligationCount)) *
      100
    : ((nftPrice * 2 - userDebt / COLLATERAL_FACTOR) / (nftPrice * 2)) * 100;

  // interface related constants
  const { width: windowWidth } = useWindowSize();
  const [tableData, setTableData] =
    useState<MarketTableRow[]>(marketCollections);
  const [tableDataFiltered, setTableDataFiltered] =
    useState<MarketTableRow[]>(marketCollections);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isFetchingClientData, setIsFetchingClientData] = useState(true);
  const [showWeeklyRates, setShowWeeklyRates] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<BorrowSidebarMode>(
    BorrowSidebarMode.MARKET
  );

  const [isCreateMarketAreaOnHover, setIsCreateMarketAreaOnHover] =
    useState<boolean>(false);

  const onUrlChange = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const market = marketCollections.find(collection => collection.id === id);
    if (id && market) {
      setCurrentMarketId(id);
      setCurrentVerifiedCreator(market.verifiedCreator);
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

      const marketDataResult = marketCollections.map(collection => {
        if (result.length) {
          collection.marketData = result.filter(
            marketObject =>
              // @ts-ignore
              marketObject.marketId === collection.id
          );

          // @ts-ignore
          collection.rate =
            // @ts-ignore
            collection.marketData[0].data.interestRate * 100;

          // @ts-ignore
          collection.allowance = collection.marketData[0].data.allowance;

          collection.available =
            // @ts-ignore
            collection.marketData[0].data.totalMarketDeposits;

          // @ts-ignore
          collection.value = collection.marketData[0].data.totalMarketDebt
            ? // @ts-ignore
              collection.marketData[0].data.totalMarketDebt +
              // @ts-ignore
              collection.marketData[0].data.totalMarketDeposits
            : // @ts-ignore
              collection.marketData[0].data.totalMarketDeposits;

          // @ts-ignore
          collection.connection = sdkConfig.saberHqConnection;
          // @ts-ignore

          collection.nftPrice = collection.marketData[0].data.nftPrice;
          // @ts-ignore
          collection.utilizationRate =
            // @ts-ignore
            collection.marketData[0].data.utilization;

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

  const marketDataCache: MutableRefObject<{
    [id: string]: Array<MarketBundle>;
  }> = useRef({});

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
        let { allowance, debt, liquidationThreshold, ltv } =
          await honeyUser.fetchAllowanceAndDebt(0);
        const totalMarketDebt =
          honeyUser.reserves[0].getReserveState().outstandingDebt;
        const totalMarketDeposits =
          honeyUser.reserves[0].getReserveState().totalDeposits;
        const { utilization, interestRate } =
          honeyUser.reserves[0].getUtilizationAndInterestRate();

        collection.available = totalMarketDeposits;
        collection.value = totalMarketDeposits + totalMarketDebt;
        collection.nftPrice = nftPrice;
        collection.rate = interestRate * 100;
        collection.user = honeyUser;
        collection.utilizationRate = utilization;

        setUserDebt(debt ? roundTwoDecimalsUp(debt, 2) : 0);
        setUserAllowance(allowance < 0 ? 0 : allowance);
        setLoanToValue(ltv);
        setActiveInterestRate(collection.rate);

        const newMarketData = marketCollections.map(marketCollection =>
          marketCollection.id === collection.id ? collection : marketCollection
        );

        setTableData(newMarketData);
        setTableDataFiltered(newMarketData);
      } catch (error) {
        console.log('Error fetching selected market data', '@current');
      } finally {
        setIsFetchingClientData(false);
      }
    },
    [honeyUser]
  );

  useEffect(() => {
    fetchCurrentMarketData();
  }, [fetchCurrentMarketData]);

  // fetches the sol price
  // TODO: create type for reserves and connection
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
    if (honeyReserves && honeyReserves[0]?.data) {
      fetchReserveValue(honeyReserves[0].data, sdkConfig.saberHqConnection);
    }
  }, [honeyReserves]);

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  const handleToggle = (checked: boolean) => {
    setIsMyCollectionsFilterEnabled(checked);
  };

  const WeeklyToggle = () => (
    <div className={style.headerCell['disabled']}>
      <Space direction="horizontal">
        <HoneyToggle
          defaultChecked
          checked={showWeeklyRates}
          onChange={value => {
            setShowWeeklyRates(value);
          }}
          title="Weekly"
        />{' '}
        WEEKLY
      </Space>
    </div>
  );

  const onSearch = (searchTerm: string): MarketTableRow[] => {
    if (!searchTerm) {
      return [...tableData];
    }
    const r = new RegExp(searchTerm, 'mi');
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
  const columnsWidth: Array<number | string> = [240, 150, 150, 150, 150];
  // Render func. for desktop
  // @ts-ignore
  const columns: HoneyTableColumnType<MarketTableRow>[] = useMemo(
    () =>
      [
        {
          width: columnsWidth[0],
          title: SearchForm,
          dataIndex: 'name',
          key: 'name',
          children: [
            {
              // title: '',
              dataIndex: 'name',
              width: columnsWidth[0],
              key: 'name',
              render: (name: string, data: MarketTableRow, index: number) => {
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
                        <div
                          className={c(
                            style.collectionLogo,
                            style.secondaryLogo
                          )}
                        >
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
            }
          ]
        },
        {
          width: columnsWidth[1],
          title: ({ sortColumns }: ColumnTitleProps<MarketTableRow>) => {
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
                <div className={style.sortIcon[sortOrder]}>
                  <SorterIcon active={sortOrder !== 'disabled'} />
                </div>
              </div>
            );
          },
          dataIndex: 'rate',
          children: [
            {
              dataIndex: 'rate',
              key: 'rate',
              hidden: windowWidth < TABLET_BP,
              ellipsis: true,
              render: (rate: number) =>
                isFetchingData ? (
                  <div className={center}>
                    <Skeleton.Button size="small" active />
                  </div>
                ) : (
                  <div className={c(style.rateCell, style.borrowRate)}>
                    {fp(rate / (showWeeklyRates ? 52 : 1))}
                  </div>
                )
            }
          ],
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.rate - b.rate
        },
        {
          width: columnsWidth[2],
          title: ({ sortColumns }: ColumnTitleProps<MarketTableRow>) => {
            const sortOrder = getColumnSortStatus(sortColumns, 'available');
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
          children: [
            {
              dataIndex: 'value',
              key: 'value',
              hidden: windowWidth < TABLET_BP,
              render: (value: number, row: MarketTableRow) =>
                isFetchingData ? (
                  <div className={center}>
                    <Skeleton.Button size="small" active />
                  </div>
                ) : (
                  <div className={style.currencyValueCell}>
                    <Image
                      src={row.constants.marketLoanCurrencyImage}
                      alt={row.loanCurrency}
                      width={20}
                      height={20}
                    />
                    <div className={style.valueCell}>{fs(value)}</div>
                  </div>
                )
            }
          ],
          sorter: (a: MarketTableRow, b: MarketTableRow) =>
            a.available - b.available
        },
        {
          width: columnsWidth[3],
          title: ({ sortColumns }: ColumnTitleProps<MarketTableRow>) => {
            const sortOrder = getColumnSortStatus(sortColumns, 'value');
            return (
              <div
                className={
                  style.headerCell[
                    sortOrder === 'disabled' ? 'disabled' : 'active'
                  ]
                }
              >
                <span>Available</span>
                <div className={style.sortIcon[sortOrder]}>
                  <SorterIcon active={sortOrder !== 'disabled'} />
                </div>
              </div>
            );
          },
          dataIndex: 'available',
          children: [
            {
              dataIndex: 'available',
              key: 'available',
              render: (available: number, data: MarketTableRow) =>
                isFetchingData ? (
                  <div className={center}>
                    <Skeleton.Button size="small" active />
                  </div>
                ) : (
                  <div className={style.currencyValueCell}>
                    <Image
                      src={data.constants.marketLoanCurrencyImage}
                      alt={data.loanCurrency}
                      width={20}
                      height={20}
                    />
                    <div className={style.availableCell}>{fs(available)}</div>
                  </div>
                )
            }
          ],
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.value - b.value,
          render: (value: number, data: MarketTableRow) => {
            return <div className={style.valueCell}>{fsn(value)}</div>;
          }
        },

        {
          width: columnsWidth[4],
          title: WeeklyToggle,
          render: (_: null, row: MarketTableRow) => {
            return (
              <div className={style.buttonsCell}>
                <HoneyButton variant="text">
                  View <div className={style.arrowIcon} />
                </HoneyButton>
              </div>
            );
          }
        }
      ].filter((column: HoneyTableColumnType<MarketTableRow>) => {
        // @ts-ignore
        if (column.children) {
          // @ts-ignore
          return !column?.children[0].hidden;
        }
        return !column.hidden;
      }),
    [
      isMyCollectionsFilterEnabled,
      tableData,
      showWeeklyRates,
      searchQuery,
      windowWidth,
      isFetchingData
    ]
  );
  // Render func. for mobile
  const columnsMobile: ColumnType<MarketTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        dataIndex: 'name',
        key: 'name',
        render: (name: string, row: MarketTableRow) => {
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
                      {/* <div className={style.rateCellMobile}>
                        {fp(row.rate * 100)}
                      </div> */}
                    </div>
                  </>
                }
                rightSide={
                  <div className={style.buttonsCell}>
                    <HoneyButton variant="text">
                      View <div className={style.arrowIcon} />
                    </HoneyButton>
                  </div>
                }
              />
              <HoneyTableRow>
                <div className={style.rateCell}>
                  {isFetchingData ? (
                    <div className={center}>
                      <Skeleton.Button size="small" active />
                    </div>
                  ) : (
                    fp(row.rate / (showWeeklyRates ? 52 : 1))
                  )}
                </div>
                <div className={style.availableCell}>
                  {isFetchingData ? (
                    <div className={center}>
                      <Skeleton.Button size="small" active />
                    </div>
                  ) : (
                    <div className={style.currencyValueCell}>
                      <Image
                        src={row.constants.marketLoanCurrencyImage}
                        alt={row.loanCurrency}
                        width={16}
                        height={16}
                      />
                      {fs(row.value)}
                    </div>
                  )}
                </div>
                <div className={style.availableCell}>
                  {isFetchingData ? (
                    <div className={center}>
                      <Skeleton.Button size="small" active />
                    </div>
                  ) : (
                    <div className={style.currencyValueCell}>
                      <Image
                        src={row.constants.marketLoanCurrencyImage}
                        alt={row.loanCurrency}
                        width={16}
                        height={16}
                      />
                      {fs(row.available)}
                    </div>
                  )}
                </div>
              </HoneyTableRow>
            </>
          );
        }
      }
    ],
    [searchQuery, showWeeklyRates, isFetchingData]
  );

  // position in each market
  const expandColumns: ColumnType<MarketTablePosition>[] = [
    {
      dataIndex: 'name',
      width: columnsWidth[0],
      render: (name, record) => {
        return (
          <div className={style.expandedRowNameCell}>
            <div className={style.expandedRowIcon}>
              <ExpandedRowIcon />
            </div>
            <div className={style.collectionLogo}>
              <HexaBoxContainer>
                {
                  <Image
                    src={
                      record.image
                        ? `https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${record.image}`
                        : ''
                    }
                    alt=""
                    layout="fill"
                  />
                }
              </HexaBoxContainer>
            </div>
            <div className={style.nameCellText}>
              <HoneyTooltip title={name}>
                {renderMarketName(currentMarketId)}
              </HoneyTooltip>
              <HealthLvl healthLvl={healthPercent} />
            </div>
          </div>
        );
      }
    },
    {
      dataIndex: 'debt',
      width: columnsWidth[1],
      render: (debt, record) => (
        <div className={style.expandedRowCell}>
          <InfoBlock
            title={'Debt:'}
            value={fsn(obligationCount ? userDebt / obligationCount : userDebt)}
          />
        </div>
      )
    },
    {
      dataIndex: 'allowance',
      width: columnsWidth[2],
      render: allowance => (
        <div className={style.expandedRowCell}>
          <InfoBlock
            title={'Allowance:'}
            value={fs(
              obligationCount ? userAllowance / obligationCount : userAllowance
            )}
          />
        </div>
      )
    },
    {
      dataIndex: 'value',
      width: columnsWidth[3],
      render: value => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Value:'} value={fsn(nftPrice)} />
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

  const expandColumnsMobile: ColumnType<MarketTablePosition>[] = [
    {
      dataIndex: 'name',
      render: (name, record) => (
        <div className={style.expandedRowNameCell}>
          <div className={style.expandedRowIcon}>
            <ExpandedRowIcon />
          </div>
          <div className={style.collectionLogo}>
            <HexaBoxContainer>
              {renderMarketImageByID(currentMarketId)}
            </HexaBoxContainer>
          </div>
          <div className={style.nameCellText}>
            <div className={style.collectionNameMobile}>{name}</div>
            <HealthLvl healthLvl={healthPercent} />
          </div>
        </div>
      )
    },
    // {
    //   dataIndex: 'debt',
    //   render: debt => (
    //     <div className={style.expandedRowCell}>
    //       <InfoBlock title={'Debt:'} value={fs(userDebt)} />
    //     </div>
    //   )
    // },
    // {
    //   dataIndex: 'available',
    //   render: available => (
    //     <div className={style.expandedRowCell}>
    //       <InfoBlock title={'Allowance:'} value={fs(nftPrice * MAX_LTV)} />
    //     </div>
    //   )
    // },
    {
      title: '',
      width: '50px',
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
    <div className={style.expandedSection}>
      <div className={style.expandedSectionFooter}>
        <div className={style.expandedRowIcon}>
          <ExpandedRowIcon />
        </div>
        <div className={style.collectionLogo}>
          <HexaBoxContainer borderColor="gray">
            <div className={style.lampIconStyle} />
          </HexaBoxContainer>
        </div>
        <div className={style.footerText}>
          <span className={style.footerTitle}>
            You can not add any more NFTs to this market{' '}
          </span>
          <span className={style.footerDescription}>
            Choose another market or connect a different wallet{' '}
          </span>
        </div>
      </div>
      <div className={style.footerButton}>
        <HoneyButton
          className={style.mobileConnectButton}
          variant="secondary"
          block={windowWidth < TABLET_BP}
          onClick={disconnect}
        >
          <div className={style.swapWalletIcon} />
          Change active wallet{' '}
        </HoneyButton>
      </div>
    </div>
  );

  /**
   * @description executes Deposit NFT (SDK helper)
   * @params mint of the NFT | toast | name | verified creator
   * @returns succes | failure
   */
  async function executeDepositNFT(
    mintID: any,
    toast: ToastProps['toast'],
    name: string,
    creator: string,
    isLastItem: boolean
  ) {
    try {
      if (!mintID) return;
      toast.processing();

      const tx = await depositNFT(
        sdkConfig.saberHqConnection,
        honeyUser,
        new PublicKey(mintID)
      );

      if (tx[0] == 'SUCCESS') {
        const confirmation = tx[1];
        let counter = confirmation.length - 1;
        const confirmationHash = confirmation[counter];

        await waitForConfirmation(
          sdkConfig.saberHqConnection,
          confirmationHash
        );

        if (isLastItem) {
          await fetchCurrentMarketData(true);
          refetchNfts({});
          refreshMint === 0 ? setRefreshMint(1) : setRefreshMint(0);

          toast.success(
            'Deposit success',
            `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
          );
        }
      }
    } catch (error) {
      toast.error('Error depositing NFT');
      return Promise.resolve();
    }
  }

  /**
   * @description executes the withdraw NFT func. from SDK
   * @params mint of the NFT
   * @returns succes | failure
   */
  async function executeWithdrawNFT(
    mintID: any,
    toast: ToastProps['toast'],
    isLastItem: boolean
  ) {
    try {
      if (!mintID) return toast.error('Please select NFT');
      toast.processing();

      const tx = await withdrawNFT(
        sdkConfig.saberHqConnection,
        honeyUser,
        new PublicKey(mintID)
      );

      if (tx[0] == 'SUCCESS') {
        const confirmation = tx[1];
        let counter = confirmation.length - 1;
        const confirmationHash = confirmation[counter];

        await waitForConfirmation(
          sdkConfig.saberHqConnection,
          confirmationHash
        );

        if (isLastItem) {
          refetchNfts({});
          refreshMint === 0 ? setRefreshMint(1) : setRefreshMint(0);
          await fetchCurrentMarketData(true);
          toast.success(
            'Withdraw success',
            `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
          );
        }
      }
    } catch (error) {
      toast.error('Error withdraw NFT');
      return Promise.resolve();
    }
  }

  /**
   * @description executes the borrow function which allows user to borrow against NFT
   * @params borrow amount
   * @returns borrowTx
   */
  async function executeBorrow(val: any, toast: ToastProps['toast']) {
    try {
      if (!val) return toast.error('Please provide a value');
      if (!selectedMarket) return;

      const borrowTokenMint = new PublicKey(
        selectedMarket?.constants.marketLoanCurrencyTokenMintAddress
      );

      toast.processing();

      // if (!fetchedDataObject) return;

      const tx = await borrowAndRefresh(
        honeyUser,
        new BN(val * marketsTokens[selectedMarket.loanCurrency].decimals),
        borrowTokenMint,
        honeyUser.reserves
      );

      if (tx[0] == 'SUCCESS') {
        const confirmation = tx[1];
        const confirmationHash = confirmation[1];

        await waitForConfirmation(
          sdkConfig.saberHqConnection,
          confirmationHash
        );

        await honeyUser.reserves[0].refresh();
        await honeyUser.refresh();
        await fetchCurrentMarketData(true);

        toast.success(
          'Borrow success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
      } else {
        console.log('@@-- tx error', tx);
        return toast.error(
          'Borrow failed',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
      }
    } catch (error) {
      console.log('Error: ', error);
      return toast.error('An error occurred');
    } finally {
    }
  }

  /**
   * @description
   * executes the repay function which allows user to repay their borrowed amount
   * against the NFT
   * @params amount of repay
   * @returns repayTx
   */
  async function executeRepay(val: any, toast: ToastProps['toast']) {
    try {
      if (!val) return toast.error('Please provide a value');
      // add additional value if user wants to repay 100% of loan due to interest rate not being included
      if (val == userDebt) val += 0.1;
      if (!selectedMarket) return;
      const repayTokenMint = new PublicKey(
        selectedMarket?.constants.marketLoanCurrencyTokenMintAddress
      );
      toast.processing();
      // if (!fetchedDataObject) return;
      const tx = await repayAndRefresh(
        honeyUser,
        new BN(val * marketsTokens[selectedMarket.loanCurrency].decimals),
        repayTokenMint,
        honeyUser.reserves
      );

      if (tx[0] == 'SUCCESS') {
        const confirmation = tx[1];
        const confirmationHash = confirmation[1];

        await waitForConfirmation(
          sdkConfig.saberHqConnection,
          confirmationHash
        );

        await honeyUser.reserves[0].refresh();
        await honeyUser.refresh();
        await fetchCurrentMarketData(true);

        toast.success(
          'Repay success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
      } else {
        console.log('Repay failed', tx);
        return toast.error(
          'Repay failed',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
      }
    } catch (error) {
      console.error('Error: ', error);
      return toast.error('An error occurred');
    } finally {
    }
  }

  const borrowSidebar = (sidebarMode: BorrowSidebarMode) => {
    switch (sidebarMode) {
      case BorrowSidebarMode.MARKET:
        return (
          <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
            {/* borrow repay module */}
            <MarketsSidebar
              openPositions={collateralNFTPositions ?? []}
              nftPrice={nftPrice}
              executeDepositNFT={executeDepositNFT}
              executeWithdrawNFT={executeWithdrawNFT}
              executeBorrow={executeBorrow}
              executeRepay={executeRepay}
              userDebt={userDebt}
              userAllowance={userAllowance}
              loanToValue={loanToValue}
              hideMobileSidebar={hideMobileSidebar}
              fetchedReservePrice={fetchedReservePrice}
              // TODO: call helper function include all markets
              calculatedInterestRate={activeInterestRate}
              currentMarketId={currentMarketId}
              availableNFTS={NFTs}
              isFetchingData={isFetchingClientData}
              collCount={obligationCount}
              isLoadingNfts={isLoadingNfts}
            />
          </HoneySider>
        );
      case BorrowSidebarMode.CREATE_MARKET:
        return (
          <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
            <CreateMarketSidebar
              onCancel={() => {
                setSidebarMode(BorrowSidebarMode.MARKET);
              }}
              wallet={wallet}
              honeyClient={honeyClient}
            />
          </HoneySider>
        );
      default:
        return null;
    }
  };

  return (
    <LayoutRedesign>
      <HoneyContent sidebar={borrowSidebar(sidebarMode)}>
        <div>
          <Typography.Title className={pageTitle}>Borrow</Typography.Title>
          <Typography.Text className={pageDescription}>
            Get instant liquidity using your NFTs as collateral.{' '}
            <span>
              <a
                target="_blank"
                href="https://docs.honey.finance/lending-protocol/borrowing"
                rel="noreferrer"
              >
                <HoneyButton style={{ display: 'inline' }} variant="text">
                  How it works?
                </HoneyButton>
              </a>
            </span>
          </Typography.Text>
        </div>
        {/* TODO: mock modal run*/}
        <div className={style.hideTablet}>
          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            selectedRowsKeys={
              sidebarMode === BorrowSidebarMode.MARKET
                ? [
                    tableDataFiltered.find(data => data.id === currentMarketId)
                      ?.key || ''
                  ]
                : []
            }
            columns={columns}
            dataSource={tableDataFiltered}
            pagination={false}
            isLoading={isFetchingData}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  handleMarketId(record);
                  setSidebarMode(BorrowSidebarMode.MARKET);
                }
              };
            }}
            onHeaderRow={(data, index) => {
              if (index) {
                return {
                  hidden: true
                };
              }
              return {};
            }}
            className={classNames(style.table, {
              [style.emptyTable]: !tableDataFiltered.length
            })}
            expandable={{
              // we use our own custom expand column
              showExpandColumn: false,
              onExpand: (expanded, row) => {
                setExpandedRowKeys(
                  expanded && !isFetchingData ? [row.key] : []
                );
              },
              expandedRowKeys,
              expandedRowRender: record => {
                return (
                  <>
                    <div>
                      <div
                        className={style.expandSection}
                        onClick={showMobileSidebar}
                      >
                        <div className={style.dashedDivider} />
                        <HoneyTable
                          tableLayout="fixed"
                          className={style.expandContentTable}
                          columns={expandColumns}
                          dataSource={
                            isFetchingClientData ? [] : collateralNFTPositions
                          }
                          pagination={false}
                          showHeader={false}
                          footer={
                            collateralNFTPositions?.length == 11
                              ? ExpandedTableFooter
                              : undefined
                          }
                          locale={{
                            emptyText: !isFetchingClientData ? (
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                  wallet?.connected
                                    ? 'No loan positions'
                                    : 'Connect wallet'
                                }
                              />
                            ) : (
                              <>
                                <div
                                  className={c(
                                    style.emptyTableSpinner,
                                    spinner
                                  )}
                                >
                                  <Spin />
                                  <span className={style.spinnerText}>
                                    Fetching your details
                                  </span>
                                </div>
                              </>
                            )
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              }
            }}
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
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  handleMarketId(record);
                  setSidebarMode(BorrowSidebarMode.MARKET);
                }
              };
            }}
            className={classNames(style.table, {
              [style.emptyTable]: !tableData.length
            })}
            expandable={{
              // we use our own custom expand column
              showExpandColumn: false,
              onExpand: (expanded, row) =>
                setExpandedRowKeys(
                  expanded && !isFetchingData ? [row.key] : []
                ),
              expandedRowKeys,
              expandedRowRender: record => {
                return (
                  <>
                    <div>
                      <div
                        className={style.expandSection}
                        onClick={showMobileSidebar}
                      >
                        <div className={style.dashedDivider} />
                        <HoneyTable
                          className={style.expandContentTable}
                          columns={expandColumnsMobile}
                          dataSource={
                            isFetchingClientData ? [] : collateralNFTPositions
                          }
                          pagination={false}
                          showHeader={false}
                          footer={
                            isFetchingClientData
                              ? undefined
                              : collateralNFTPositions?.length
                              ? ExpandedTableFooter
                              : () => (
                                  <HoneyButton variant="secondary" block>
                                    Deposit{' '}
                                    <div className={style.arrowRightIcon} />
                                  </HoneyButton>
                                )
                          }
                          locale={{
                            emptyText: !isFetchingClientData ? (
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                  wallet?.connected
                                    ? 'No loan positions'
                                    : 'Connect wallet'
                                }
                              />
                            ) : (
                              <div
                                className={c(style.emptyTableSpinner, spinner)}
                              >
                                <Spin />
                                <span className={style.spinnerText}>
                                  Fetching your details
                                </span>
                              </div>
                            )
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              }
            }}
          />
        </div>
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
        {
          <div
            className={style.createMarketLauncherCell}
            // style={{ width: launchAreaWidth }}
            onClick={() => setSidebarMode(BorrowSidebarMode.CREATE_MARKET)}
          >
            <div className={style.createMarket}>
              <div className={style.nameCell}>
                <div className={style.logoWrapper}>
                  <div className={style.createMarketLogo}>
                    <HexaBoxContainer borderColor="gray">
                      <div className={style.createMarketIconStyle} />
                    </HexaBoxContainer>
                  </div>
                </div>
                <div className={style.createMarketTitle}>
                  Do you want to create a new one?
                </div>
              </div>
              <div className={style.buttonsCell}>
                <HoneyButton variant="text">
                  Create{' '}
                  <div
                    className={c(style.arrowRightIcon, {
                      [style.createMarketHover]: isCreateMarketAreaOnHover
                    })}
                  />
                </HoneyButton>
              </div>
            </div>
          </div>
        }
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Markets;
