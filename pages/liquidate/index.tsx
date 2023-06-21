import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
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
import debounce from 'lodash/debounce';
import SearchInput from '../../components/SearchInput/SearchInput';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { formatNFTName, formatNumber } from '../../helpers/format';
import { LiquidateTableRow } from '../../types/liquidate';
import { LiquidateExpandTable } from '../../components/LiquidateExpandTable/LiquidateExpandTable';
import {
  useAnchor,
  LiquidatorClient,
  useAllPositions,
  useHoney,
  useMarket,
  fetchAllMarkets,
  HoneyMarket,
  HoneyUser,
  HoneyClient,
  TReserve,
  fetchReservePrice,
  HoneyReserve,
  NftPosition,
  Bid
} from '@honey-finance/sdk';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { useConnectedWallet } from '@saberhq/use-solana';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {
  HONEY_PROGRAM_ID,
  TEST_HONEY_PROGRAM_ID,
  HONEY_GENESIS_MARKET_ID,
  COLLATERAL_FACTOR,
  marketIDs,
  ROOT_SSR,
  ROOT_CLIENT,
  renderMarketCurrencyImageByID,
  marketsTokens,
  LOAN_CURRENCY_USDC,
  LOAN_CURRENCY_SOL
} from '../../helpers/marketHelpers/index';
import { NATIVE_MINT } from '@solana/spl-token-v-0.1.8';
import HoneySider from 'components/HoneySider/HoneySider';
import HoneyContent from 'components/HoneyContent/HoneyContent';
import { hideTablet, showTablet } from 'styles/markets.css';
import { pageDescription, pageTitle, center } from 'styles/common.css';
import { Skeleton, Typography } from 'antd';
import { ToastProps } from 'hooks/useToast';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import LiquidateExpandTableMobile from 'components/LiquidateExpandTable/LiquidateExpandTableMobile';
import { marketCollections } from '../../helpers/marketHelpers/index';
import {
  calculateRisk,
  setObligations
} from 'helpers/loanHelpers/userCollection';
import { MarketTableRow } from 'types/markets';
import { renderMarket, renderMarketImageByName } from 'helpers/marketHelpers';
import { network } from 'pages/_app';
import SorterIcon from 'icons/Sorter';
import { fetchTVL } from 'helpers/loanHelpers/userCollection';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';
import { FETCH_USER_MARKET_DATA } from 'constants/apiEndpoints';
import { useSolBalance, useTokenBalance } from 'hooks/useSolBalance';
import { mergeDuplicates } from 'helpers/liquidationHelpers';

const { formatPercent: fp, formatSol: fs, formatRoundDown: fd } = formatNumber;

interface MarketBundle {
  client: HoneyClient;
  market: HoneyMarket;
  reserves: HoneyReserve[];
  user: HoneyUser;
  positions?: NftPosition[];
  bids?: Bid[];
  marketId?: string;
}

const Liquidate: NextPage = () => {
  // base state
  const [hasPosition, setHasPosition] = useState(false);
  const [highestBiddingAddress, setHighestBiddingAddress] = useState('');
  const [highestBiddingValue, setHighestBiddingValue] = useState(0);
  const [currentUserBid, setCurrentUserBid] = useState<number>();
  const [nftPrice, setNftPrice] = useState<number>(0);
  const [fetchedReservePrice, setFetchedReservePrice] = useState(0);
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const [biddingArray, setBiddingArray] = useState({});
  const [marketData, setMarketData] = useState<MarketBundle[]>([]);
  const [tableData, setTableData] =
    useState<MarketTableRow[]>(marketCollections);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [isMyBidsFilterEnabled, setIsMyBidsFilterEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableDataFiltered, setTableDataFiltered] =
    useState<MarketTableRow[]>(marketCollections);
  const [currentMarketId, setCurrentMarketId] = useState(
    HONEY_GENESIS_MARKET_ID
  );
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isFetchingClientData, setIsFetchingClientData] = useState(false);
  const [serverRenderedMarketData, setServerRenderedMarketData] = useState<
    MarketBundle[]
  >([]);
  // init anchor
  const { program } = useAnchor();
  // init sdk config obj
  const sdkConfig = ConfigureSDK();
  // create wallet instance for PK
  const wallet = useConnectedWallet() || null;
  let stringyfiedWalletPK = sdkConfig.sdkWallet?.publicKey.toString();
  let walletPK = sdkConfig.sdkWallet?.publicKey;

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

  // update user wallet PK in LS
  useEffect(() => {
    if (stringyfiedWalletPK)
      localStorage.setItem('walletPK', stringyfiedWalletPK);
  }, [stringyfiedWalletPK]);
  // state for parsed reserves
  const [parsedReserves, setParsedReserves] = useState<TReserve>();
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
  /**
   * @description sets state of marketValue by parsing lamports outstanding debt amount to SOL
   * @params none, requires parsedReserves
   * @returns updates marketValue
   */
  useEffect(() => {
    if (honeyReserves && honeyReserves[0].data)
      setParsedReserves(honeyReserves[0].data);
  }, [honeyReserves]);

  // fetches market level data from API
  async function fetchServerSideMarketData() {
    fetch(FETCH_USER_MARKET_DATA)
      .then(res => res.json())
      .then(async data => {
        await data.map(async (marketObject: any) => {
          marketObject.data.positions = mergeDuplicates(
            marketObject.data.positions
          );
        });
        setMarketData(data as unknown as MarketBundle[]);
        setServerRenderedMarketData(data);
        handleBids(currentMarketId);
      })
      .catch(err => console.log(`Error fetching SSR: ${err}`));
  }
  // init data fetch from server
  useEffect(() => {
    fetchServerSideMarketData();
  }, []);

  //  ************* START HANDLE BIDS *************
  async function handleBids(currentMarketId: string) {
    if (currentMarketId === undefined || !serverRenderedMarketData) return;

    // gets the current active market
    const filteredMarketData = serverRenderedMarketData.filter(
      marketObject => marketObject.marketId === currentMarketId
    );
    if (filteredMarketData.length) {
      const data = (filteredMarketData[0] as any).data;
      if (data.bids) {
        setBiddingArray(data.bids);
        handleBiddingState(data.bids);
      } else {
        setBiddingArray([]);
        handleBiddingState([]);
      }
    } else {
      setBiddingArray([]);
      handleBiddingState([]);
    }
  }

  useEffect(() => {
    handleBids(currentMarketId);
  }, [currentMarketId, serverRenderedMarketData, stringyfiedWalletPK]);
  //  ************* END HANDLE BIDS *************

  function fetchUserWalletFromLS() {
    let userWallet = localStorage.getItem('walletPK');
    if (userWallet) {
      return userWallet;
    } else {
      return false;
    }
  }
  //  ************* START HANDLE BIDDING STATE *************
  /**
   * @description sets the state if user has open bid
   * @params array of bids
   * @returns state change
   */
  async function handleBiddingState(biddingArray: any) {
    if (!biddingArray.length) {
      setHasPosition(false);
      setCurrentUserBid(0);
      setHighestBiddingValue(0);
      setHighestBiddingAddress('');
      return;
    }
    if (!selectedMarket) return;

    let userWallet = stringyfiedWalletPK
      ? stringyfiedWalletPK
      : fetchUserWalletFromLS();

    if (userWallet === false) return;

    const arrayOfBiddingAddress = await biddingArray.map(
      (obligation: any) => obligation.bidder
    );

    if (arrayOfBiddingAddress.includes(userWallet)) {
      setHasPosition(true);

      biddingArray.map((obligation: any) => {
        if (userWallet && obligation.bidder === userWallet) {
          setCurrentUserBid(
            Number(
              obligation.bidLimit /
                marketsTokens[selectedMarket.loanCurrency].decimals
            )
          );
        }
      });
    } else {
      setHasPosition(false);
      setCurrentUserBid(0);
    }

    let highestBid = await biddingArray
      .sort((first: any, second: any) => first.bidLimit - second.bidLimit)
      .reverse();

    if (highestBid[0]) {
      setHighestBiddingAddress(highestBid[0].bidder);
      setHighestBiddingValue(
        highestBid[0].bidLimit /
          marketsTokens[selectedMarket.loanCurrency].decimals
      );
    }
    setIsFetchingClientData(false);
  }
  //  ************* END HANDLE BIDDING STATE *************

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  async function fetchReserveValue(reserves: TReserve, connection: Connection) {
    const reservePrice = await fetchReservePrice(reserves, connection);
    setFetchedReservePrice(reservePrice);
  }

  // refetches markets after bid is placed | revoked | increased
  // TODO: Validate if we can use the API for this call as well
  async function fetchBidData() {
    setTimeout(async () => {
      fetchServerSideMarketData();
    }, 30000);
  }

  // fetches reserve value based on correct parsed reserves - coming from honeyReserves
  useEffect(() => {
    if (parsedReserves) {
      fetchReserveValue(parsedReserves, sdkConfig.saberHqConnection);
    }
  }, [parsedReserves]);

  /**
   * @description calls upon liquidator client for placebid | revokebid | increasebid
   * @params tpye | userbid | nftmint
   * @returms toastresponse of executed call
   */
  async function fetchLiquidatorClient(
    type: string,
    userBid: number | undefined,
    toast: ToastProps['toast'],
    mrktID: string
  ) {
    if (!selectedMarket) return;
    try {
      const liquidatorClient = await LiquidatorClient.connect(
        program.provider,
        HONEY_PROGRAM_ID
      );
      if (wallet) {
        if (type == 'revoke_bid') {
          if (!currentUserBid) return;

          toast.processing();

          let transactionOutcome: any = await liquidatorClient.revokeBid({
            market: new PublicKey(mrktID),
            bidder: wallet.publicKey,
            bid_mint: new PublicKey(
              selectedMarket?.constants.marketLoanCurrencyTokenMintAddress
            ),
            withdraw_destination: wallet.publicKey
          });

          if (transactionOutcome[0] == 'SUCCESS') {
            setCurrentUserBid(0);
            if (walletPK) refetchWalletBalance();
            fetchBidData();
            return toast.success('Bid revoked, fetching chain data');
          } else {
            return toast.error('Revoke bid failed');
          }
        } else if (type == 'place_bid') {
          // if no user bid terminate action
          if (!userBid) return;

          userBid = Number(userBid.toFixed(2));
          toast.processing();

          let transactionOutcome: any = await liquidatorClient.placeBid({
            bid_limit: userBid,
            market: new PublicKey(mrktID),
            bidder: wallet.publicKey,
            bid_mint: new PublicKey(
              selectedMarket?.constants.marketLoanCurrencyTokenMintAddress
            )
          });

          if (transactionOutcome[0] == 'SUCCESS') {
            if (walletPK) await refetchWalletBalance();
            fetchBidData();
            return toast.success('Bid placed, fetching chain data');
          } else {
            return toast.error('Bid failed');
          }
        } else if (type == 'increase_bid') {
          // if no user bid terminate action
          if (!userBid) return;
          userBid = Number(userBid.toFixed(2));
          toast.processing();
          let transactionOutcome: any = await liquidatorClient.increaseBid({
            bid_increase: userBid,
            market: new PublicKey(mrktID),
            bidder: wallet.publicKey,
            bid_mint: new PublicKey(
              selectedMarket?.constants.marketLoanCurrencyTokenMintAddress
            )
          });

          if (transactionOutcome[0] == 'SUCCESS') {
            if (walletPK) await refetchWalletBalance();
            fetchBidData();
            return toast.success('Bid increased, fetching chain data');
          } else {
            return toast.error('Bid increase failed');
          }
        }
      } else {
        return;
      }
    } catch (error) {
      console.log('Error: ', error);
      return toast.error('Bid failed');
    }
  }
  /**
   * @description
   * @params
   * @returns
   */
  function handleRevokeBid(
    type: string,
    toast: ToastProps['toast'],
    mID: string
  ) {
    fetchLiquidatorClient(type, undefined, toast, mID);
  }
  /**
   * @description
   * @params
   * @returns
   */
  function handleIncreaseBid(
    type: string,
    userBid: number,
    toast: ToastProps['toast'],
    mID: string
  ) {
    fetchLiquidatorClient(type, userBid!, toast, mID);
  }
  /**
   * @description
   * @params
   * @returns
   */
  function handlePlaceBid(
    type: string,
    userBid: number,
    toast: ToastProps['toast'],
    mID: string
  ) {
    fetchLiquidatorClient(type, userBid!, toast, mID);
  }

  /**
   * @description
   * @params
   * @returns
   */
  useEffect(() => {
    if (sdkConfig.saberHqConnection) {
      function getData() {
        return Promise.all(
          marketCollections
            .filter(collection => collection.loanCurrency === LOAN_CURRENCY_SOL)
            .map(async collection => {
              if (collection.id == '') return collection;
              if (marketData.length) {
                collection.marketData = marketData.filter(
                  marketObject => marketObject.marketId === collection.id
                );

                if (collection.marketData.length) {
                  const data = (collection.marketData[0] as any).data;
                  collection.allowance = data.allowance ? data.allowance : 0;

                  collection.available = data.totalMarketDeposits
                    ? data.totalMarketDeposits
                    : 0;

                  collection.value = data.totalMarketDebt;

                  data.totalMarketDebt + data.totalMarketDeposits;

                  data.totalMarketDeposits;

                  collection.connection = sdkConfig.saberHqConnection;
                  collection.nftPrice = data.nftPrice;

                  collection.tvl =
                    data.positions && data.nftPrice
                      ? data.nftPrice * (await fetchTVL(data.positions))
                      : 0;

                  collection.utilizationRate = data.utilization
                    ? data.utilization
                    : 0;

                  collection.totalDebt = data.totalMarketDebt;

                  collection.risk = data.positions
                    ? await calculateRisk(
                        data.positions,

                        data.nftPrice,
                        false
                      )
                    : 0;

                  collection.openPositions = data.positions.length
                    ? await setObligations(
                        data.positions,
                        currentMarketId,

                        data.nftPrice
                      )
                    : [];

                  if (collection.openPositions) {
                    collection.openPositions.map(openPos => {
                      return (openPos.untilLiquidation =
                        openPos.estimatedValue && openPos.debt
                          ? openPos.estimatedValue -
                            openPos.debt / COLLATERAL_FACTOR
                          : 0);
                    });
                  }
                  setTimeout(() => {
                    setIsFetchingData(false);
                  }, 2000);
                  return collection;
                }
              }

              return collection;
            })
        );
      }

      getData()
        .then(result => {
          setTableData(result);
          setTableDataFiltered(result);
        })
        .catch(() => {
          setIsFetchingData(false);
        });
    }
  }, [
    currentMarketId,
    sdkConfig.saberHqConnection,
    // sdkConfig.sdkWallet,
    marketData
  ]);
  /**
   * @description
   * @params
   * @returns
   */
  const handleToggle = (checked: boolean) => {
    setIsMyBidsFilterEnabled(checked);
  };
  /**
   * @description
   * @params
   * @returns
   */
  const onSearch = (searchTerm: string): MarketTableRow[] => {
    if (!searchTerm) {
      return [...tableData];
    }
    const r = new RegExp(searchTerm, 'mi');
    return [...tableData].filter(row => {
      return r.test(row.name);
    });
  };
  /**
   * @description sets the market ID based on market click
   * @params Honey table record - contains all info about a table (aka market)
   * @returns sets the market ID which re-renders page state and fetches market specific data
   */
  async function handleMarketId(record: any) {
    if (record.id === currentMarketId) return;

    const marketData = renderMarket(record.id);

    if (marketData[0].id) {
      setCurrentMarketId(marketData[0].id);
    }
  }
  /**
   * @description
   * @params
   * @returns
   */
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
  /**
   * @description
   * @params
   * @returns
   */
  const SearchForm = () => {
    return (
      <SearchInput
        onChange={handleSearchInputChange}
        placeholder="Search by name"
        value={searchQuery}
      />
    );
  };
  const columnsWidth: Array<number | string> = [200, 100, 150, 150, 100, 70];
  // Render Desktop Configuration
  const columns: ColumnType<MarketTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        title: SearchForm,
        dataIndex: 'name',
        key: 'name',
        render: (name: string, data: any) => {
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
                    className={classNames(
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
      },
      // TODO: Once risk is fixed comment back in
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
              style={{ paddingLeft: 15 }}
            >
              <span>Risk</span>
              <div className={style.sortIcon[sortOrder]}>
                <SorterIcon active={sortOrder !== 'disabled'} />
              </div>
            </div>
          );
        },
        dataIndex: 'risk',
        sorter: (a, b) => a.risk! - b.risk!,
        render: (risk: number, market: any) =>
          isFetchingData ? (
            <div className={center}>
              <Skeleton.Button size="small" active />
            </div>
          ) : (
            <div className={style.rateCell}>{fp(risk)}</div>
          )
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
              style={{ paddingLeft: 15 }}
            >
              <span>Liq %</span>
              <div className={style.sortIcon[sortOrder]}>
                <SorterIcon active={sortOrder !== 'disabled'} />
              </div>
            </div>
          );
        },
        dataIndex: 'liqThreshold',
        sorter: (a, b) => a.liqThreshold - b.liqThreshold,
        render: (liqThreshold: number) => {
          return (
            <div className={style.rateCell}>{fp(COLLATERAL_FACTOR * 100)}</div>
          );
        }
      },
      {
        width: columnsWidth[3],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'totalDebt');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
              style={{ paddingLeft: 15 }}
            >
              <span>Total Debt</span>{' '}
              <div className={style.sortIcon[sortOrder]}>
                <SorterIcon active={sortOrder !== 'disabled'} />
              </div>
            </div>
          );
        },
        dataIndex: 'totalDebt',
        sorter: (a, b) => a.totalDebt! - b.totalDebt!,
        render: (available: number, market) => {
          return isFetchingData ? (
            <div className={center}>
              <Skeleton.Button size="small" active />
            </div>
          ) : (
            <div className={style.availableCell}>{fs(market.totalDebt)}</div>
          );
        }
      },
      {
        width: columnsWidth[4],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'tvl');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
              style={{ paddingLeft: 15 }}
            >
              <span>TVL</span>
              <div className={style.sortIcon[sortOrder]}>
                <SorterIcon active={sortOrder !== 'disabled'} />
              </div>
            </div>
          );
        },
        dataIndex: 'tvl',
        sorter: (a, b) => a.tvl! - b.tvl!,
        render: (value: number, market: any) =>
          isFetchingData ? (
            <div className={center}>
              <Skeleton.Button size="small" active />
            </div>
          ) : (
            <div className={style.valueCell}>{fs(market.tvl)}</div>
          )
      },
      {
        width: columnsWidth[5],
        // TODO: add toggle back when its functional
        // title: (
        //   // <div className={style.toggle}>
        //   //   <HoneyToggle
        //   //     checked={isMyBidsFilterEnabled}
        //   //     onChange={handleToggle}
        //   //   />
        //   //   <span className={style.toggleText}>my bids</span>
        //   // </div>
        // ),
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
    ],
    [isMyBidsFilterEnabled, tableData, isFetchingData, searchQuery]
  );
  // Render Mobile Configuration
  const columnsMobile: ColumnType<LiquidateTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        dataIndex: 'name',
        key: 'name',
        render: (name: string, row: LiquidateTableRow) => {
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
                        className={classNames(
                          style.collectionLogo,
                          style.secondaryLogo
                        )}
                      >
                        <HexaBoxContainer>
                          {renderMarketCurrencyImageByID(row.id ?? '')}
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
                      View <div className={style.arrowIcon} />
                    </HoneyButton>
                  </div>
                }
              />

              <HoneyTableRow>
                {/* <div className={style.rateCell}>{fp(row.risk * 100)}</div> */}
                <div className={style.rateCell}>{fp(row.risk)}</div>
                <div className={style.rateCell}>{fs(row.totalDebt)}</div>
                <div className={style.availableCell}>{fs(row.value)}</div>
              </HoneyTableRow>
            </>
          );
        }
      }
    ],
    [isMyBidsFilterEnabled, tableData, searchQuery]
  );

  const liquidateSidebar = () => (
    <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
      <LiquidateSidebar
        collectionId="0"
        biddingArray={biddingArray}
        userBalance={userWalletBalance}
        stringyfiedWalletPK={stringyfiedWalletPK}
        highestBiddingValue={highestBiddingValue}
        highestBiddingAddress={highestBiddingAddress}
        currentUserBid={currentUserBid}
        handleRevokeBid={handleRevokeBid}
        handleIncreaseBid={handleIncreaseBid}
        handlePlaceBid={handlePlaceBid}
        fetchedReservePrice={fetchedReservePrice}
        onCancel={hideMobileSidebar}
        currentMarketId={currentMarketId}
        isFetchingData={isFetchingClientData}
      />
    </HoneySider>
  );

  return (
    <LayoutRedesign>
      <HoneyContent sidebar={liquidateSidebar()}>
        <div>
          <Typography.Title className={pageTitle}>Liquidation</Typography.Title>
          <Typography.Text className={pageDescription}>
            Bid on discounted NFTs from borrowers{' '}
          </Typography.Text>
        </div>
        <div className={hideTablet}>
          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            columns={columns}
            dataSource={tableDataFiltered}
            pagination={false}
            isLoading={isFetchingData}
            className={classNames(style.table, {
              [style.emptyTable]: !tableDataFiltered.length
            })}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleMarketId(record)
              };
            }}
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
                  <div className={style.expandSection}>
                    <div className={style.dashedDivider} />
                    <LiquidateExpandTable
                      // TODO: set to record.marketData[0].data.positions
                      data={record.openPositions}
                      currentMarketId={currentMarketId}
                    />
                  </div>
                );
              }
            }}
          />
        </div>
        <div className={showTablet}>
          <div className={classNames(style.mobileSearchAndToggleContainer)}>
            <div className={style.mobileRow}>
              <SearchForm />
            </div>
          </div>

          <div className={style.mobileTableHeader}>
            <div className={style.tableCell}></div>
            <div className={style.tableCell}>Debt</div>
            <div className={style.tableCell}>TVL</div>
          </div>
          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            columns={columnsMobile}
            dataSource={tableDataFiltered}
            pagination={false}
            showHeader={false}
            className={classNames(style.table, {
              [style.emptyTable]: !tableDataFiltered.length
            })}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleMarketId(record)
              };
            }}
            expandable={{
              // we use our own custom expand column
              showExpandColumn: false,
              onExpand: (expanded, row) =>
                setExpandedRowKeys(expanded ? [row.key] : []),
              expandedRowKeys,
              expandedRowRender: record => {
                return (
                  <div
                    className={style.expandSection}
                    onClick={showMobileSidebar}
                  >
                    <div className={style.dashedDivider} />
                    <LiquidateExpandTableMobile
                      // TODO: set to record.marketData[0].data.positions
                      data={record.openPositions}
                      onPlaceBid={showMobileSidebar}
                      currentMarketId={currentMarketId}
                    />
                  </div>
                );
              }
            }}
          />
        </div>
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
      </HoneyContent>
      {/*<HoneySider>*/}
      {/*  <LiquidateSidebar*/}
      {/*    collectionId="0"*/}
      {/*    biddingArray={biddingArray}*/}
      {/*    userBalance={userBalance}*/}
      {/*    highestBiddingValue={highestBiddingValue}*/}
      {/*    currentUserBid={currentUserBid}*/}
      {/*    handleRevokeBid={handleRevokeBid}*/}
      {/*    handleIncreaseBid={handleIncreaseBid}*/}
      {/*    handlePlaceBid={handlePlaceBid}*/}
      {/*    fetchedReservePrice={fetchedReservePrice}*/}
      {/*  />*/}
      {/*</HoneySider>*/}
    </LayoutRedesign>
  );
};

export default Liquidate;
