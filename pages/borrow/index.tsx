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
import useFetchNFTByUser, { defaultNFTImageUrl } from 'hooks/useNFTV3';
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
  METADATA_PROGRAM_ID,
  getNFTAssociatedMetadata
} from '@honey-finance/sdk';
import { populateMarketData } from 'helpers/loanHelpers/userCollection';
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
  marketsTokens
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
  const { disconnect } = useSolana();

  // Sets market ID which is used for fetching market specific data
  // each market currently is a different call and re-renders the page
  const [currentMarketId, setCurrentMarketId] = useState('');
  const [collateralNFTPositions, setCollateralNFTPositions] = useState<NFT[]>();

  /**
   * @description sets the market ID based on market click
   * @params Honey table record - contains all info about a table (aka market / collection)
   * @returns sets the market ID which re-renders page state and fetches market specific data
   */
  async function handleMarketId(record: any) {
    setCurrentMarketId(record.id);
  }
  // /**
  //  * @description fetches market reserve info | parsed reserves | fetch market (func) from SDK
  //  * @params none
  //  * @returns market | market reserve information | parsed reserves |
  //  */
  // const { marketReserveInfo, parsedReserves, fetchMarket } = useHoney();
  const [isFetchingClientData, setIsFetchingClientData] = useState(true);
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

  // setIsFetchingClientData(true);
  async function handleCollateralNFTMintArray(arr: any) {
    const collateralNFTPositions: any = [];

    const promises = arr.map(async (key: PublicKey, index: number) => {
      if (!key.equals(PublicKey.default)) {
        const [nftMetadata, _] = await PublicKey.findProgramAddress(
          [
            Buffer.from('metadata'),
            METADATA_PROGRAM_ID.toBuffer(),
            key.toBuffer()
          ],
          METADATA_PROGRAM_ID
        );

        const data = await getNFTAssociatedMetadata(
          sdkConfig.saberHqConnection,
          nftMetadata
        );

        if (!data) return;

        const tokenMetadata = await Metadata.fromAccountAddress(
          sdkConfig.saberHqConnection,
          nftMetadata
        );

        // TODO: validate if we can run it or need to catch
        // @ts-ignore
        const verifiedCreator = tokenMetadata.data.creators.filter(
          (creator: any) => creator.verified
        )[0].address;

        //   `(https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${tokenMetadata.data.uri})`

        // TODO: fetch via cloudinary
        const arweaveData = await (await fetch(tokenMetadata.data.uri)).json();

        collateralNFTPositions.push({
          // mint: new PublicKey(tokenMetadata?.mint),
          mint: nftMetadata.toString(),
          updateAuthority: new PublicKey(tokenMetadata?.updateAuthority),
          name: tokenMetadata?.data?.name,
          symbol: tokenMetadata?.data?.symbol,
          uri: tokenMetadata?.data?.uri,
          image: arweaveData?.image,
          verifiedCreator: verifiedCreator.toBase58()
        });
      }
    });

    await Promise.all(promises);

    if (collateralNFTPositions.length > 0) {
      const userData = await honeyUser.fetchAllowanceAndDebt(0);

      setUserDebt(userData && userData.debt ? userData.debt : 0);
      setUserAllowance(userData && userData.allowance ? userData.allowance : 0);
      setCollateralNFTPositions(collateralNFTPositions);
      setIsFetchingClientData(false);
    } else {
      setUserDebt(0);
      setUserAllowance(0);
      setCollateralNFTPositions([]);
      setIsFetchingClientData(false);
    }
    const nftPrice = RoundHalfDown(
      await honeyMarket.fetchNFTFloorPriceInReserve(0),
      2
    );
    setNftPrice(nftPrice);
  }

  useEffect(() => {
    if (!honeyUser) return;
    honeyUser.getObligationData().then(data => {
      if (data.collateralNftMint)
        handleCollateralNFTMintArray(data.collateralNftMint);
    });
  }, [honeyUser]);

  /**
   * @description fetches collateral nft positions | refresh positions (func) from SDK
   * @params useConnection func. | useConnectedWallet func. | honeyID | marketID
   * @returns collateralNFTPositions | loanPositions | loading | error
   */
  // let {
  //   loading: loadingCollateralPositions,
  //   collateralNFTPositions,
  //   loanPositions,
  //   refreshPositions,
  //   error
  // } = useBorrowPositions(
  //   sdkConfig.saberHqConnection,
  //   sdkConfig.sdkWallet!,
  //   sdkConfig.honeyId,
  //   currentMarketId
  // );

  // market specific constants - calculations / ratios / debt / allowance etc.
  const [nftPrice, setNftPrice] = useState(0);
  const [userAllowance, setUserAllowance] = useState(0);
  const [loanToValue, setLoanToValue] = useState(0);
  const [userDebt, setUserDebt] = useState(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
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
  const [fetchedDataObject, setFetchedDataObject] = useState<MarketBundle>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [showWeeklyRates, setShowWeeklyRates] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<BorrowSidebarMode>(
    BorrowSidebarMode.MARKET
  );

  const selectedMarket = marketCollections.find(
    collection => collection.id === currentMarketId
  );

  /**
   * @description fetches all nfts in users wallet
   * @params wallet
   * @returns array of:
   * [0] users nfts
   * [1] loading state
   * [2] reFetch function which can be called after deposit or withdraw and updates nft list
   */
  const [NFTs, isLoadingNfts, refetchNfts] = useFetchNFTByUser(
    wallet,
    selectedMarket?.verifiedCreator
  );

  const [isCreateMarketAreaOnHover, setIsCreateMarketAreaOnHover] =
    useState<boolean>(false);

  // const [marketData, setMarketData] = useState<MarketBundle[]>([]);
  const [dataRoot, setDataRoot] = useState<String>();

  // fetches market level data from API
  const fetchMarketLevelDataFromAPI = useCallback(async () => {
    try {
      setIsFetchingData(false);
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
        // setIsFetchingClientData(true);
      }

      try {
        const data = await fetchMarketDataObj(
          currentMarketId,
          sdkConfig.saberHqConnection,
          sdkConfig.sdkWallet,
          sdkConfig.honeyId
        );
        collection.marketData = data;

        const honeyUser = data[0].user;
        const honeyMarket = data[0].market;
        const honeyClient = data[0].client;
        const parsedReserves = data[0].reserves[0].data;
        const mData = data[0].reserves[0];

        await populateMarketData(
          'BORROW',
          ROOT_CLIENT,
          collection,
          sdkConfig.saberHqConnection,
          sdkConfig.sdkWallet,
          currentMarketId,
          false,
          data[0].positions,
          true,
          honeyClient,
          honeyMarket,
          honeyUser,
          parsedReserves,
          mData
        );

        // setObligationCount(collection.openPositions.length);
        setActiveInterestRate(collection.rate);

        // @ts-ignore
        collection.nftPrice
          ? setNftPrice(RoundHalfDown(collection.nftPrice))
          : 0;
        setUserAllowance(collection.allowance);

        // @ts-ignore
        setUserDebt(collection.userDebt);
        setLoanToValue(Number(collection.ltv));
        setFetchedDataObject(data[0]);

        const newMarketData = marketCollections.map(marketCollection =>
          marketCollection.id === collection.id ? collection : marketCollection
        );

        // Update market table data
        setTableData(newMarketData);
        setTableDataFiltered(newMarketData);
      } catch (error) {
        console.log('Error fetching selected market data', '@current');
      } finally {
        setIsFetchingData(false);
        setIsFetchingClientData(false);
      }
    },
    [
      currentMarketId,
      sdkConfig.honeyId,
      sdkConfig.saberHqConnection,
      sdkConfig.sdkWallet,
      fetchMarketDataObj
    ]
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
              render: (value: number) =>
                isFetchingData ? (
                  <div className={center}>
                    <Skeleton.Button size="small" active />
                  </div>
                ) : (
                  <div className={style.valueCell}>{fs(value)}</div>
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
                  <div className={style.availableCell}>{fs(available)}</div>
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
      windowWidth
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
                    fs(row.value)
                  )}
                </div>
                <div className={style.availableCell}>
                  {isFetchingData ? (
                    <div className={center}>
                      <Skeleton.Button size="small" active />
                    </div>
                  ) : (
                    fs(row.available)
                  )}
                </div>
              </HoneyTableRow>
            </>
          );
        }
      }
    ],
    [isMyCollectionsFilterEnabled, tableData, searchQuery, showWeeklyRates]
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
      render: debt => (
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
    creator: string
  ) {
    try {
      if (!mintID) return;
      toast.processing();
      // TODO: set verified creator of active market along with currentMarketId
      if (marketCollections) {
        // @ts-ignore
        marketCollections.map(async collection => {
          if (collection.id === currentMarketId) {
            const tx = await depositNFT(
              collection.connection,
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
              if (collection.marketData) {
                await collection.marketData[0].reserves[0].refresh();
                await collection.marketData[0].user.refresh();
                // refreshes the honey user which sets the updated collateral NFT mint array - which calculates the positions
                await honeyUser.getObligationData();
                refetchNfts({});
                await fetchCurrentMarketData(true);

                toast.success(
                  'Deposit success',
                  `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
                );
              }
            } else {
              return toast.error('Error depositing NFT');
            }
          }
        });
      }
    } catch (error) {
      return toast.error(
        'Error depositing NFT'
        // 'Transaction link(if available)'
      );
    }
  }

  /**
   * @description executes the withdraw NFT func. from SDK
   * @params mint of the NFT
   * @returns succes | failure
   */
  async function executeWithdrawNFT(mintID: any, toast: ToastProps['toast']) {
    try {
      if (!mintID) return toast.error('Please select NFT');
      toast.processing();
      if (marketCollections && fetchedDataObject) {
        //@ts-ignore
        marketCollections.map(async collection => {
          if (collection.id === currentMarketId) {
            const tx = await depositNFT(
              collection.connection,
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

              await fetchedDataObject.reserves[0].refresh();
              await fetchedDataObject.user.refresh();
              // refreshes the honey user which sets the updated collateral NFT mint array - which calculates the positions
              await honeyUser.getObligationData();
              refetchNfts({});
              await fetchCurrentMarketData(true);

              toast.success(
                'Withdraw success',
                `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
              );
            } else {
              toast.error(
                'Withdraw failed',
                `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
              );
            }
          }
          return true;
        });
      }
    } catch (error) {
      toast.error('Error withdraw NFT');
      return;
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
      if (!fetchedDataObject) return;

      const tx = await borrowAndRefresh(
        fetchedDataObject.user,
        new BN(val * marketsTokens[selectedMarket.loanCurrency].decimals),
        borrowTokenMint,
        fetchedDataObject.reserves
      );

      if (tx[0] == 'SUCCESS') {
        const confirmation = tx[1];
        const confirmationHash = confirmation[1];

        await waitForConfirmation(
          sdkConfig.saberHqConnection,
          confirmationHash
        );

        await fetchedDataObject.reserves[0].refresh();
        await fetchedDataObject.user.refresh();

        await fetchCurrentMarketData(true);

        refetchNfts({});

        reserveHoneyState === 0
          ? setReserveHoneyState(1)
          : setReserveHoneyState(0);

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
      if (!fetchedDataObject) return;
      const tx = await repayAndRefresh(
        fetchedDataObject.user,
        new BN(val * marketsTokens[selectedMarket.loanCurrency].decimals),
        repayTokenMint,
        fetchedDataObject.reserves
      );

      if (tx[0] == 'SUCCESS') {
        const confirmation = tx[1];
        const confirmationHash = confirmation[1];

        await waitForConfirmation(
          sdkConfig.saberHqConnection,
          confirmationHash
        );

        await fetchedDataObject.reserves[0].refresh();
        await fetchedDataObject.user.refresh();

        await fetchCurrentMarketData(true);
        refetchNfts({});

        reserveHoneyState === 0
          ? setReserveHoneyState(1)
          : setReserveHoneyState(0);

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
            Get instant liquidity using your NFTs as collateral{' '}
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
