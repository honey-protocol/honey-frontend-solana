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
import HoneyToggle from '../../components/HoneyToggle/HoneyToggle';
import debounce from 'lodash/debounce';
import SearchInput from '../../components/SearchInput/SearchInput';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { formatNumber } from '../../helpers/format';
import { BiddingPosition, LiquidateTableRow } from '../../types/liquidate';
import { LiquidateExpandTable } from '../../components/LiquidateExpandTable/LiquidateExpandTable';
import {
  useAnchor,
  LiquidatorClient,
  useAllPositions,
  useHoney,
  useMarket,
  NftPosition
} from '@honey-finance/sdk';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { useConnectedWallet } from '@saberhq/use-solana';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { calcNFT, fetchSolPrice } from 'helpers/loanHelpers/userCollection';
import { LiquidateTablePosition } from '../../types/liquidate';
import {
  HONEY_PROGRAM_ID,
  HONEY_GENESIS_MARKET_ID,
  LIQUIDATION_THRESHOLD,
  PESKY_PENGUINS_MARKET_ID,
  OG_ATADIANS_MARKET_ID,
  LIFINITY_FLARES_MARKET_ID,
  BURRITO_BOYZ_MARKET_ID
} from 'constants/loan';
import { NATIVE_MINT } from '@solana/spl-token-v-0.1.8';
import HoneySider from 'components/HoneySider/HoneySider';
import HoneyContent from 'components/HoneyContent/HoneyContent';
import { hideTablet, showTablet, table } from 'styles/markets.css';
import { pageDescription, pageTitle } from 'styles/common.css';
import { Typography } from 'antd';
import { ToastProps } from 'hooks/useToast';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import LiquidateExpandTableMobile from 'components/LiquidateExpandTable/LiquidateExpandTableMobile';
import { 
  HONEY_GENESIS_BEE_MARKET_NAME,
  LIFINITY_FLARES_MARKET_NAME,
  OG_ATADIANS_MARKET_NAME,
  PESKY_PENGUINS_MARKET_NAME,
  BURRITO_BOYZ_MARKET_NAME,
  renderMarketImageByID
} from 'helpers/marketHelpers';
import { marketCollections } from 'constants/borrowLendMarkets';
import { populateMarketData } from 'helpers/loanHelpers/userCollection';
import { setMarketId } from 'pages/_app';
import { MarketTableRow } from 'types/markets';
import { renderMarket, renderMarketImageByName } from 'helpers/marketHelpers';
import { network } from 'pages/_app';

const { formatPercent: fp, formatSol: fs, formatRoundDown: fd } = formatNumber;
const Liquidate: NextPage = () => {
  // TODO: write dynamic currentMarketId based on user interaction
  const [currentMarketId, setCurrentMarketId] = useState(HONEY_GENESIS_MARKET_ID);
  // start sdk integration
  const liquidationThreshold = 0.65; // TODO: values like this should be imported from constants per collection
  // init anchor
  const { program } = useAnchor();
  // create wallet instance for PK
  const wallet = useConnectedWallet() || null;
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
  const { ...status } = useAllPositions(
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    sdkConfig.honeyId,
    currentMarketId,
    network == 'devnet' ? true : false
  );

  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
   */
  const { market, marketReserveInfo, parsedReserves, fetchMarket } = useHoney();
  /**
   * @description calls upon the honey sdk
   * @params  useConnection func. | useConnectedWallet func. | honeyID | marketID
   * @returns honeyUser | honeyReserves - used for interaction regarding the SDK
   */
  const { honeyClient, honeyUser, honeyReserves, honeyMarket } = useMarket(
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    sdkConfig.honeyId,
    currentMarketId,
  );

  /**
   * @description declare state
   * @params none
   * @returns open positions | bidding data | userbid | user position
   */
  const [hasPosition, setHasPosition] = useState(false);
  const [highestBiddingAddress, setHighestBiddingAddress] = useState('');
  const [highestBiddingValue, setHighestBiddingValue] = useState(0);
  const [currentUserBid, setCurrentUserBid] = useState<number>();
  const [nftPrice, setNftPrice] = useState<number>(0);
  const [userBalance, setUserBalance] = useState(0);
  const [fetchedSolPrice, setFetchedSolPrice] = useState(0);
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  
  const [positionsObject, setPositionsObject] = useState<Array<NftPosition>>([]);
  const [biddingArray, setBiddingArray] = useState({});
  
  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  // create stringyfied instance of walletPK
  let stringyfiedWalletPK = sdkConfig.sdkWallet?.publicKey.toString();
  let walletPK = sdkConfig.sdkWallet?.publicKey;

  async function fetchWalletBalance(key: PublicKey) {
    try {
      const userBalance =
        (await sdkConfig.saberHqConnection.getBalance(key)) / LAMPORTS_PER_SOL;
      setUserBalance(userBalance);
    } catch (error) {
      console.log('Error', error);
    }
  }

  useEffect(() => {
    if (walletPK) {
      fetchWalletBalance(walletPK);
    }
  }, [walletPK]);

  /**
   * @description sets the state if user has open bid
   * @params array of bids
   * @returns state change
   */
   async function handleBiddingState(biddingArray: any) {
    if (biddingArray === undefined) biddingArray = [{bid: '', bidder: '', bidLimit: '', }]; 

    biddingArray.map((obligation: any) => {
      if (stringyfiedWalletPK && obligation.bidder == stringyfiedWalletPK) {
        setHasPosition(true);
        setCurrentUserBid(Number(obligation.bidLimit / LAMPORTS_PER_SOL));
      }
    });

    if (!biddingArray.length) {
      setHasPosition(false);
      setCurrentUserBid(0);
      setHighestBiddingValue(0);
      setHighestBiddingAddress('');
    } else {
      let highestBid = await biddingArray
      .sort((first: any, second: any) => first.bidLimit - second.bidLimit)
      .reverse();

    if (highestBid[0]) {
      setHighestBiddingAddress(highestBid[0].bidder);
      setHighestBiddingValue(highestBid[0].bidLimit / LAMPORTS_PER_SOL);
    }
    }
  }

  // calculates nft price
  async function calculateNFTPrice() {
    if (marketReserveInfo && parsedReserves && honeyMarket) {
      let nftPrice = await calcNFT(
        marketReserveInfo,
        parsedReserves,
        honeyMarket,
        sdkConfig.saberHqConnection
      );
      setNftPrice(Number(nftPrice));
    }
  }

  async function fetchSolValue(reserves: any, connection: any) {
    const slPrice = await fetchSolPrice(reserves, connection);
    setFetchedSolPrice(slPrice);
  }

  useEffect(() => {
    if (parsedReserves && sdkConfig.saberHqConnection) {
      fetchSolValue(parsedReserves, sdkConfig.saberHqConnection);
    }
  }, [parsedReserves]);

  useEffect(() => {
    calculateNFTPrice();
  }, [marketReserveInfo, parsedReserves, positionsObject]);

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
    try {
      const liquidatorClient = await LiquidatorClient.connect(
        program.provider,
        HONEY_PROGRAM_ID,
        true
      );
      if (wallet) {
        if (type == 'revoke_bid') {
          if (!currentUserBid) return;

          toast.processing();
          
          let transactionOutcome: any = await liquidatorClient.revokeBid({
            market: new PublicKey(mrktID),
            bidder: wallet.publicKey,
            bid_mint: NATIVE_MINT,
            withdraw_destination: wallet.publicKey
          });

          if (transactionOutcome[0] == 'SUCCESS') {
            setCurrentUserBid(0);

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
            bid_mint: NATIVE_MINT
          });

          if (transactionOutcome[0] == 'SUCCESS') {
            return toast.success('Bid placed, fetching chain data');
          } else {
            return toast.error('Bid failed');
          }
        } else if (type == 'increase_bid') {
          // if no user bid terminate action
          if (!userBid) return;

          toast.processing();
          let transactionOutcome: any = await liquidatorClient.increaseBid({
            bid_increase: userBid,
            market: new PublicKey(mrktID),
            bidder: wallet.publicKey,
            bid_mint: NATIVE_MINT
          });

          if (transactionOutcome[0] == 'SUCCESS') {
            return toast.success('Bid increased, fetching chain data');
          } else {
            return toast.error('Bid increase failed');
          }
        }
      } else {
        return;
      }
    } catch (error) {
      return toast.error('Bid failed');
    }
  }

  function handleRevokeBid(type: string, toast: ToastProps['toast'], mID: string) {
    fetchLiquidatorClient(type, undefined, toast, mID);
  }

  function handleIncreaseBid(
    type: string,
    userBid: number,
    toast: ToastProps['toast'],
    mID: string
  ) {
    fetchLiquidatorClient(type, userBid!, toast, mID);
  }

  function handlePlaceBid(
    type: string,
    userBid: number,
    toast: ToastProps['toast'],
    mID: string
  ) {
    fetchLiquidatorClient(type, userBid!, toast, mID);
  }

  useEffect(() => {
      if (status.positions) {
        setPositionsObject(status.positions);
      } else {
        setPositionsObject([])
      }

      if (status.bids) {
        setBiddingArray(status.bids) 
        handleBiddingState(status.bids)
      } else {
        setBiddingArray([])
        handleBiddingState([])
      }

  }, [status.positions, status.bids]);

  const [tableData, setTableData] = useState<MarketTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<
  MarketTableRow[]
  >([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [isMyBidsFilterEnabled, setIsMyBidsFilterEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMarketName, setCurrentMarketName] = useState(HONEY_GENESIS_BEE_MARKET_NAME);

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    // if (!wallet) {
    //   setTableData(liquidationCollections);
    // }
    
    if (sdkConfig.saberHqConnection && marketReserveInfo) {
      function getData() {
        return Promise.all(
          marketCollections.map(async collection => {
            await populateMarketData(
              collection,
              sdkConfig.saberHqConnection,
              sdkConfig.sdkWallet,
              currentMarketId,
              true,
              {
                obligations: positionsObject,
                nftPrice: nftPrice,
                marketReserveInfo: marketReserveInfo
              }
            )
            return collection

          })
        );
      }

      getData().then(result => {
        setTableData(result);
        setTableDataFiltered(result);
      });
    }
  }, [
    currentMarketId,
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    nftPrice,
    positionsObject,
    marketReserveInfo,
  ]);

  const handleToggle = (checked: boolean) => {
    setIsMyBidsFilterEnabled(checked);
  };

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
    const marketData = renderMarket(record.id);
    setCurrentMarketId(marketData!.id);
    setMarketId(marketData!.id);
    setCurrentMarketName(marketData!.name);
    handleBiddingState(status.bids)
  }

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
                    {renderMarketImageByName(name)}
                  </HexaBoxContainer>
                </div>
              </div>
              <div className={style.collectionName}>{name}</div>
            </div>
          );
        }
      },
      // {
      //   width: columnsWidth[1],
      //   title: ({ sortColumns }) => {
      //     const sortOrder = getColumnSortStatus(sortColumns, 'risk');
      //     return (
      //       <div
      //         className={
      //           style.headerCell[
      //             sortOrder === 'disabled' ? 'disabled' : 'active'
      //           ]
      //         }
      //         style={{paddingLeft: 15}}
      //       >
      //         <span>Risk</span>
      //         <div className={style.sortIcon[sortOrder]} />
      //       </div>
      //     );
      //   },
      //   dataIndex: 'risk',
      //   sorter: (a, b) => a.risk! - b.risk!,
      //   render: (rate: number, market: any) => {
      //     return <div className={style.rateCell} >{fp(market.risk * 100)}</div>;
      //   }
      // },
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
              style={{paddingLeft: 15}}
            >
              <span>Liq %</span>
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'liqThreshold',
        sorter: (a, b) => a.liqThreshold - b.liqThreshold,
        render: (liqThreshold: number) => {
          return <div className={style.rateCell}>{fp(LIQUIDATION_THRESHOLD * 100)}</div>;
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
              style={{paddingLeft: 15}}
            >
              <span>Total Debt</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'totalDebt',
        sorter: (a, b) => a.totalDebt! - b.totalDebt!,
        render: (available: number, market) => {
          return <div className={style.availableCell}>{fs(market.totalDebt)}</div>;
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
              style={{paddingLeft: 15}}
            >
              <span>TVL</span>
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'tvl',
        sorter: (a, b) => a.tvl! - b.tvl!,
        render: (value: number, market: any) => {
          return <div className={style.valueCell}>{fs(market.tvl)}</div>;
        }
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
    [isMyBidsFilterEnabled, tableData, searchQuery]
  );

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
                    </div>
                    <div className={style.nameCellMobile}>
                      <div className={style.collectionName}>{name}</div>
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
                <div className={style.rateCell}>{}</div>
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
        userBalance={userBalance}
        stringyfiedWalletPK={stringyfiedWalletPK}
        highestBiddingValue={highestBiddingValue}
        highestBiddingAddress={highestBiddingAddress}
        currentUserBid={currentUserBid}
        handleRevokeBid={handleRevokeBid}
        handleIncreaseBid={handleIncreaseBid}
        handlePlaceBid={handlePlaceBid}
        fetchedSolPrice={fetchedSolPrice}
        onCancel={hideMobileSidebar}
        currentMarketId={currentMarketId}
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
                if (wallet === null) {
                  return;
                } else {
                  return (
                    <div className={style.expandSection}>
                      <div className={style.dashedDivider} />
                      <LiquidateExpandTable data={record.openPositions} currentMarketId={currentMarketId} />
                    </div>
                  );
                }
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
      {/*    fetchedSolPrice={fetchedSolPrice}*/}
      {/*  />*/}
      {/*</HoneySider>*/}
    </LayoutRedesign>
  );
};

export default Liquidate;
