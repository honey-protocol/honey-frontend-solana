import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import {
  HoneyTableColumnType,
  MarketTablePosition,
  MarketTableRow,
  UserNFTs
} from '../../types/markets';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { formatNumber } from '../../helpers/format';
import Image from 'next/image';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import { ColumnTitleProps, Key } from 'antd/lib/table/interface';
import debounce from 'lodash/debounce';
import SearchInput from '../../components/SearchInput/SearchInput';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import classNames from 'classnames';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import { useConnectedWallet } from '@saberhq/use-solana';
import useFetchNFTByUser from '../../hooks/useNFTV2';
import { BnToDecimal, ConfigureSDK } from '../../helpers/loanHelpers/index';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import {
  borrow,
  depositNFT,
  repay,
  useBorrowPositions,
  useHoney,
  useMarket,
  withdrawNFT
} from '@honey-finance/sdk';
import {
  calcNFT,
  calculateCollectionwideAllowance,
  fetchSolPrice,
  getInterestRate,
  populateMarketData,
  calculateMarketDebt,
  calculateUserDeposits
} from 'helpers/loanHelpers/userCollection';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { MAX_LTV } from 'constants/loan';
import { ToastProps } from 'hooks/useToast';
import { RoundHalfDown } from 'helpers/utils';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import HoneySider from '../../components/HoneySider/HoneySider';
import { TABLET_BP } from '../../constants/breakpoints';
import useWindowSize from '../../hooks/useWindowSize';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';
import HoneyTableNameCell from '../../components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import { marketCollections, OpenPositions } from 'constants/borrowLendMarkets';
import { HONEY_GENESIS_BEE, LIFINITY_FLARES, OG_ATADIANS, PESKY_PENGUINS } from '../../constants/borrowLendMarkets';
import { HONEY_GENESIS_MARKET_ID, PESKY_PENGUINS_MARKET_ID, OG_ATADIANS_MARKET_ID, LIFINITY_FLARES_MARKET_ID } from '../../constants/loan';
import { setMarketId } from 'pages/_app';
import { render } from 'react-dom';

// TODO: fetch based on config
const network = 'mainnet-beta';

/**
 * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
 * @params value to be formatted
 * @returns requested format 
*/
const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;

const Markets: NextPage = () => {
  // Sets market ID which is used for fetching market specific data
  // each market currently is a different call and re-renders the page
  const [currentMarketId, setCurrentMarketId] = useState<string>(HONEY_GENESIS_MARKET_ID);
  // init wallet and sdkConfiguration file
  const wallet = useConnectedWallet();
  const sdkConfig = ConfigureSDK();
  
  /**
   * @description sets the market ID based on market click
   * @params Honey table record - contains all info about a table (aka market)
   * @returns sets the market ID which re-renders page state and fetches market specific data
  */
  function handleMarketId(record: any) {
    record.id == HONEY_GENESIS_MARKET_ID ? setCurrentMarketId(HONEY_GENESIS_MARKET_ID) : setCurrentMarketId(PESKY_PENGUINS_MARKET_ID)
    record.id == HONEY_GENESIS_MARKET_ID ? setMarketId(HONEY_GENESIS_MARKET_ID) : setMarketId(PESKY_PENGUINS_MARKET_ID)
  }
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
    sdkConfig.sdkWallet!,
    sdkConfig.honeyId,
    currentMarketId
  );
  /**
   * @description fetches open positions and the amount regarding loan positions / token account
   * @params none
   * @returns collateralNFTPositions | loanPositions | loading | error
   */
  let {
    loading,
    collateralNFTPositions,
    loanPositions,
    fungibleCollateralPosition,
    refreshPositions,
    error
  } = useBorrowPositions(
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet!,
    sdkConfig.honeyId,
    currentMarketId
  );

  // market specific constants - calculations / ratios / debt / allowance etc.
  const [totalMarketDeposits, setTotalMarketDeposits] = useState(0);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [calculatedNftPrice, setCalculatedNftPrice] = useState(false);
  const [marketPositions, setMarketPositions] = useState(0);
  const [userAvailableNFTs, setUserAvailableNFTs] = useState<Array<NFT>>([]);
  const [userOpenPositions, setUserOpenPositions] = useState<Array<OpenPositions>>([]);
  const [userAllowance, setUserAllowance] = useState(0);
  const [loanToValue, setLoanToValue] = useState(0);
  const [userDebt, setUserDebt] = useState(0);
  const [depositNoteExchangeRate, setDepositNoteExchangeRate] = useState(0);
  const [cRatio, setCRatio] = useState(0);
  const [liqidationThreshold, setLiquidationThreshold] = useState(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
  const [userTotalDeposits, setUserTotalDeposits] = useState(0);
  const [fetchedSolPrice, setFetchedSolPrice] = useState(0);
  const [honeyInterestRate, setHoneyInterestRate] = useState(0);
  const [peskyInterestRate, setPeskyInterestRate] = useState(0);
  // interface related constants
  const { width: windowWidth } = useWindowSize();
  const [tableData, setTableData] = useState<MarketTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<MarketTableRow[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const [processUserPayment, setProcessUserPayment] = useState(0);
  const [processUserNFT, setProcessUserNFT] = useState(0);

  /**
   * @description fetches all nfts in users wallet
   * @params wallet
   * @returns array of: 
   * [0] users nfts
   * [1] loading state 
   * [2] reFetch function which can be called after deposit or withdraw and updates nft list
  */
  const availableNFTs = useFetchNFTByUser(wallet);
  const reFetchNFTs = availableNFTs[2];

  // calls upon setting the user nft list per market
  useEffect(() => {
    if (availableNFTs) setUserAvailableNFTs(availableNFTs[0]);
  }, [availableNFTs]);

  // function for fetching the total market debt
  async function fetchTotalMarketDebt(honeyReserves: any) {
    const marketDebt = await calculateMarketDebt(honeyReserves);
    setTotalMarketDebt(marketDebt);
  }
  // if honey reserves -> call fetchTotalMarketDebt
  useEffect(() => {
    if (honeyReserves) fetchTotalMarketDebt(honeyReserves);
  }, [honeyReserves]);

  // function for fetching user total deposits
  // TODO: create type for marketReserveInfo and honeyUser
  async function fetchUserTotalDeposits(marketReserveInfo: any, honeyUser: any) {
    const totalUserDeposits = await calculateUserDeposits(marketReserveInfo, honeyUser);
    setUserTotalDeposits(totalUserDeposits);
  }

  // if marketReserveInfo and honeyUser call upon fetchUserTotalDeposits
  useEffect(() => {
    if (marketReserveInfo && honeyUser) fetchUserTotalDeposits(marketReserveInfo, honeyUser);
  }, [marketReserveInfo, honeyUser]);
  // fetches the sol price 
  // TODO: create type for reserves and connection
  async function fetchSolValue(reserves: any, connection: any) {
    const slPrice = await fetchSolPrice(reserves, connection);
    setFetchedSolPrice(slPrice);
  }

  /**
   * @description sets state of marketValue by parsing lamports outstanding debt amount to SOL
   * @params none, requires parsedReserves
   * @returns updates marketValue
   */
  useEffect(() => {
    if (parsedReserves && parsedReserves[0].reserveState.totalDeposits) {
      let totalMarketDeposits = BnToDecimal(
        parsedReserves[0].reserveState.totalDeposits,
        9,
        2
      );

      setTotalMarketDeposits(totalMarketDeposits);

      if (parsedReserves && sdkConfig.saberHqConnection) {
        fetchSolValue(parsedReserves, sdkConfig.saberHqConnection);
      }
    }
  }, [parsedReserves]);

  // fetches total market positions aka. obligations
  async function fetchObligations() {
    let obligations = await honeyMarket.fetchObligations();
    setMarketPositions(obligations.length);
  }
  // if there is a honeyMarket fetch the opbligations
  useEffect(() => {
    if (honeyMarket) fetchObligations()
  }, [honeyMarket]);

  // calculates nft price
  // TODO: create types for marketReserveInfo && parsedReserves && honeyMarket
  async function calculateNFTPrice(marketReserveInfo: any, parsedReserves: any, honeyMarket: any) {
    if (marketReserveInfo && parsedReserves && honeyMarket) {
      let nftPrice = await calcNFT(
        marketReserveInfo,
        parsedReserves,
        honeyMarket,
        sdkConfig.saberHqConnection
      );
      setNftPrice(Number(nftPrice));
      setCalculatedNftPrice(true);
    }
  }
  // if marketReserveInfo && parsedReserves && honeyMarket -> call upon calculateNftPrice
  useEffect(() => {
    calculateNFTPrice(marketReserveInfo, parsedReserves, honeyMarket);
  }, [marketReserveInfo, parsedReserves, honeyMarket]);

  // calculates user allowance, userdebt, and loanToValue ratio
  async function fetchHelperValues(
    nftPrice: any,
    collateralNFTPositions: any,
    honeyUser: any,
    marketReserveInfo: any
  ) {
    let outcome = await calculateCollectionwideAllowance(
      nftPrice,
      collateralNFTPositions,
      honeyUser,
      marketReserveInfo
    );
    outcome.sumOfAllowance < 0
      ? setUserAllowance(0)
      : setUserAllowance(outcome.sumOfAllowance);
    setUserDebt(outcome.sumOfTotalDebt);
    setLoanToValue(outcome.sumOfLtv);
  }

  // sets cRatio, liquidationThreshold and calls fetchHelperValues
  useEffect(() => {
    if (marketReserveInfo && parsedReserves) {
      setDepositNoteExchangeRate(BnToDecimal(marketReserveInfo[0].depositNoteExchangeRate, 15, 5));
      setCRatio(BnToDecimal(marketReserveInfo[0].minCollateralRatio, 15, 5));
    }

    if (nftPrice && collateralNFTPositions && honeyUser && marketReserveInfo) 
      fetchHelperValues( nftPrice, collateralNFTPositions, honeyUser, marketReserveInfo );
      setLiquidationThreshold((1 / cRatio) * 100);
  }, [
    marketReserveInfo,
    honeyUser,
    collateralNFTPositions,
    parsedReserves,
    cRatio,
    nftPrice,
    currentMarketId,
    processUserPayment
  ]);
  
  // if there are open positions for the user -> set the open positions
  useEffect(() => {
    console.log('B:: collateral pos.', collateralNFTPositions)
    if (collateralNFTPositions) setUserOpenPositions(collateralNFTPositions);
  }, [collateralNFTPositions, currentMarketId]);

  async function handlePositions(id: string) {
    if (currentMarketId == HONEY_GENESIS_MARKET_ID && id == HONEY_GENESIS_MARKET_ID) {
      return userOpenPositions.filter((pos) => pos.name.includes('Honey'))
    } else if (currentMarketId == PESKY_PENGUINS_MARKET_ID && id == PESKY_PENGUINS_MARKET_ID) {
      return userOpenPositions.filter((pos) => pos.name.includes('Pesky'))
    } else {
      return [];
    }
  }


  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    if (sdkConfig.saberHqConnection && sdkConfig.sdkWallet) {

      const p = new Promise((resolve, reject) => {
        marketCollections.map(async (collection) => 
        {
          if(collection.id == '') return;
          collection.id == HONEY_GENESIS_MARKET_ID ? setHoneyInterestRate(collection.rate) : setPeskyInterestRate(collection.rate);
          await populateMarketData(collection, sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, currentMarketId, false);
          collection.positions = await handlePositions(collection.id);
          collection.rate = await getInterestRate(collection.utilizationRate) || 0
        }
      );
        resolve(marketCollections);
      
      })

      p.then((result) => {
        console.log('this is the result', result);
        setTableData(result);
      });
    }
  }, [
      totalMarketDeposits,
      totalMarketDebt,
      nftPrice,
      userAllowance,
      userDebt,
      loanToValue,
      honeyReserves,
      parsedReserves,
      sdkConfig.saberHqConnection,
      sdkConfig.sdkWallet,
      currentMarketId,
      peskyInterestRate,
      honeyInterestRate,
      userOpenPositions
    ]
  );

  useEffect(() => {
    console.log('@@--table data', tableData);
  }, [tableData])

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

  const MyCollectionsToggle = () => null;

  const renderImage = (name: string) => {
    if (name == HONEY_GENESIS_BEE) {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db'} layout="fill" alt="honey" />
    } else if (name == LIFINITY_FLARES) {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8'} layout="fill"  alt="Lifinity" />
    } else if (name == OG_ATADIANS) {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/atadians_pfp_1646721263627.gif'} layout="fill" alt="OG Atadians" />
    } else {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png'} layout="fill" alt="Pesky Penguins" />
    }
  }

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
  const columnsWidth: Array<number | string> = [240, 150, 150, 150, 150];

  const columns: HoneyTableColumnType<MarketTableRow>[] = useMemo(
    () =>
      [
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
                      {
                        renderImage(name)
                      }
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
                <span>Interest rate</span>
                <div className={style.sortIcon[sortOrder]} />
              </div>
            );
          },
          dataIndex: 'rate',
          hidden: windowWidth < TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.rate - b.rate,
          render: (rate: number, market: any) => {
            return ( 
              <div className={style.rateCell}>
                {fp(rate)}
              </div> 
            )
          }
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
                <span>Supplied</span>
                <div className={style.sortIcon[sortOrder]} />
              </div>
            );
          },
          dataIndex: 'value',
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.value - b.value,
          render: (value: number) => {
            return <div className={style.valueCell}>{fs(value)}</div>;
          }
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
                <span>Available</span>{' '}
                <div className={style.sortIcon[sortOrder]} />
              </div>
            );
          },
          dataIndex: 'available',
          hidden: windowWidth < TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) =>
            a.available - b.available,
          render: (available: number) => {
            return <div className={style.availableCell}>{fs(available)}</div>;
          }
        },

        {
          width: columnsWidth[4],
          title: MyCollectionsToggle,
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
      ].filter(column => !column.hidden),
    [isMyCollectionsFilterEnabled, tableData, searchQuery, windowWidth]
  );

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
                          <Image src={honeyGenesisBee} alt="Honey Genesis Bee" />
                        </HexaBoxContainer>
                      </div>
                    </div>
                    <div className={style.nameCellMobile}>
                      <div className={style.collectionName}>{name}</div>
                      <div className={style.rateCellMobile}>
                        {fp(row.rate * 100)}
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
                <div className={style.rateCell}>{fp(row.rate * 100)}</div>
                <div className={style.availableCell}>{fs(row.available)}</div>
              </HoneyTableRow>
            </>
          );
        }
      }
    ],
    [isMyCollectionsFilterEnabled, tableData, searchQuery]
  );
  
  // position in each market
  const expandColumns: ColumnType<MarketTablePosition>[] = [
    {
      dataIndex: 'name',
      width: columnsWidth[0],
      render: (name, record) => {
        console.log('@@record', record);
        console.log('@@record - the name var', name)
        return (
        <div className={style.expandedRowNameCell}>
          <div className={style.expandedRowIcon} />
          <div className={style.collectionLogo}>
            <HexaBoxContainer>
              { <Image src={record.image ? record.image : ''} alt="" layout="fill" /> }
            </HexaBoxContainer>
          </div>
          <div className={style.nameCellText}>
            <div className={style.collectionName}>{currentMarketId == HONEY_GENESIS_MARKET_ID ? 'Honey Genesis Bee' : 'Pesky Penguin'}</div>
            <div className={style.risk.safe}>
              <span className={style.valueCell}>{fp(loanToValue * 100)}</span>{' '}
              <span className={style.riskText}>Risk lvl</span>
            </div>
          </div>
        </div>
      )}
    },
    {
      dataIndex: 'debt',
      width: columnsWidth[1],
      render: debt => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Debt:'} value={fs(userDebt)} />
        </div>
      )
    },
    {
      dataIndex: 'allowance',
      width: columnsWidth[2],
      render: allowance => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Allowance:'} value={fs(userAllowance)} />
        </div>
      )
    },
    {
      dataIndex: 'value',
      width: columnsWidth[3],
      render: value => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Value:'} value={fs(nftPrice)} />
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
          <div className={style.expandedRowIcon} />
          <div className={style.collectionLogo}>
            <HexaBoxContainer>
              <Image src={honeyGenesisBee} alt="Honey Genesis Bee" />
            </HexaBoxContainer>
          </div>
          <div className={style.nameCellText}>
            <div className={style.collectionNameMobile}>{name}</div>
            <div className={style.risk.safe}>
              <span className={style.valueCell}>{fp(loanToValue)}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      dataIndex: 'debt',
      render: debt => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Debt:'} value={fs(userDebt)} />
        </div>
      )
    },
    {
      dataIndex: 'available',
      render: available => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Allowance:'} value={fs(nftPrice * MAX_LTV)} />
        </div>
      )
    },
    {
      title: '',
      width: '50px',
      render: () => (
        <div className={style.buttonsCell}>
          <HoneyButton variant="text">
            <div className={style.arrowRightIcon} />
          </HoneyButton>
        </div>
      )
    }
  ];

  const ExpandedTableFooter = () => (
    <div className={style.expandedSection}>
      <div className={style.expandedSectionFooter}>
        <div className={style.expandedRowIcon} />
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
            Current risk parameters limit to 1 loan per wallet{' '}
          </span>
        </div>
      </div>
      <div className={style.footerButton}>
        <HoneyButton
          className={style.mobileConnectButton}
          variant="secondary"
          isFluid={windowWidth < TABLET_BP}
        >
          <div className={style.swapWalletIcon} />
          Change active wallet{' '}
        </HoneyButton>
      </div>
    </div>
  );

  /**
   * @description executes the deposit NFT func. from SDK
   * @params mint of the NFT
   * @returns succes | failure
   */
  async function executeDepositNFT(mintID: any, toast: ToastProps['toast'], name: string) {
    try {
      if (!mintID) return;
      toast.processing();

      marketCollections.map(async (collection) => {
        if (name.includes(collection.name)) {
          const metadata = await Metadata.findByMint(
            collection.connection,
            mintID
          );

          const tx = await depositNFT(
            collection.connection,
            honeyUser,
            metadata.pubkey
          );
          
          if (tx[0] == 'SUCCESS') {
            toast.success(
              'Deposit success',
              `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
            );
    
            await refreshPositions();
            reFetchNFTs({});
          }
        }
      })
      toast.clear();
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
      const metadata = await Metadata.findByMint(
        sdkConfig.saberHqConnection,
        mintID
      );
      const tx = await withdrawNFT(
        sdkConfig.saberHqConnection,
        honeyUser,
        metadata.pubkey
      );

      if (tx[0] == 'SUCCESS') {
        await refreshPositions();
        reFetchNFTs({});

        toast.success(
          'Withdraw success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
      }

      return true;
    } catch (error) {
      toast.error('Error withdraw NFT');
      return;
    }
  }

  /**
   * @description
   * executes the borrow function which allows user to borrow against NFT
   * base value of NFT is 2 SOL - liquidation trashold is 50%, so max 1 SOL available
   * @params borrow amount
   * @returns borrowTx
   */
  async function executeBorrow(val: any, toast: ToastProps['toast']) {
    try {
      if (!val) return toast.error('Please provide a value');
      if (val == 1.6) val = val - 0.01;
      const borrowTokenMint = new PublicKey(
        'So11111111111111111111111111111111111111112'
      );
      toast.processing();
      const tx = await borrow(
        honeyUser,
        val * LAMPORTS_PER_SOL,
        borrowTokenMint,
        honeyReserves
      );

      if (tx[0] == 'SUCCESS') {
        let refreshedHoneyReserves = await honeyReserves[0].sendRefreshTx();
        const latestBlockHash =
          await sdkConfig.saberHqConnection.getLatestBlockhash();

        await sdkConfig.saberHqConnection.confirmTransaction(
          {
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: refreshedHoneyReserves
          },
          'processed'
        );

        await fetchMarket();
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState == 0
            ? setReserveHoneyState(1)
            : setReserveHoneyState(0);
        });

        toast.success(
          'Borrow success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );

      } else {
        return toast.error('Borrow failed');
      }
    } catch (error) {
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
      const repayTokenMint = new PublicKey(
        'So11111111111111111111111111111111111111112'
      );
      toast.processing();
      const tx = await repay(
        honeyUser,
        val * LAMPORTS_PER_SOL,
        repayTokenMint,
        honeyReserves
      );

      if (tx[0] == 'SUCCESS') {
        let refreshedHoneyReserves = await honeyReserves[0].sendRefreshTx();
        const latestBlockHash =
          await sdkConfig.saberHqConnection.getLatestBlockhash();

        await sdkConfig.saberHqConnection.confirmTransaction(
          {
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: refreshedHoneyReserves
          },
          'processed'
        );

        await fetchMarket();
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState == 0
            ? setReserveHoneyState(1)
            : setReserveHoneyState(0);
        });

        toast.success(
          'Repay success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );

      } else {
        return toast.error('Repay failed');
      }
    } catch (error) {
      return toast.error('An error occurred');
    }
  }

  return (
    <LayoutRedesign>
      <div>
        <Typography.Title className={pageTitle}>Borrow</Typography.Title>
        <Typography.Text className={pageDescription}>
          Get instant liquidity using your NFTs as collateral{' '}
        </Typography.Text>
      </div>
      <HoneyContent>
        <div className={style.mobileTableHeader}>
          <div className={style.mobileRow}>
            <SearchForm />
          </div>
          <div className={style.mobileRow}>
            <MyCollectionsToggle />
          </div>
        </div>

        <div className={style.hideTablet}>
          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            columns={columns}
            dataSource={tableData}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleMarketId(record)
              }
            }}
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
                          dataSource={record.positions}
                          pagination={false}
                          showHeader={false}
                          footer={
                            record.positions.length
                              ? ExpandedTableFooter
                              : undefined
                          }
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
            expandable={{
              // we use our own custom expand column
              showExpandColumn: false,
              onExpand: (expanded, row) =>
                setExpandedRowKeys(expanded ? [row.key] : []),
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
                          dataSource={record.positions}
                          pagination={false}
                          showHeader={false}
                          footer={
                            record.positions.length
                              ? ExpandedTableFooter
                              : undefined
                          }
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
      </HoneyContent>
      <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
        {/* borrow repay module */}
        <MarketsSidebar
          collectionId="s"
          availableNFTs={userAvailableNFTs}
          openPositions={userOpenPositions}
          nftPrice={nftPrice}
          executeDepositNFT={executeDepositNFT}
          executeWithdrawNFT={executeWithdrawNFT}
          executeBorrow={executeBorrow}
          executeRepay={executeRepay}
          userDebt={userDebt}
          userAllowance={userAllowance}
          loanToValue={loanToValue}
          hideMobileSidebar={hideMobileSidebar}
          fetchedSolPrice={fetchedSolPrice}
          calculatedInterestRate={currentMarketId == HONEY_GENESIS_MARKET_ID ? honeyInterestRate : peskyInterestRate}
          currentMarketId={currentMarketId}
        />
      </HoneySider>
    </LayoutRedesign>
  );
};

export default Markets;