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
  OpenPositions,
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
import HoneyToggle from '../../components/HoneyToggle/HoneyToggle';
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
  getInterestRate
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
// import { network } from 'pages/_app';

const network = 'mainnet-beta'; // change to dynamic value

const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;

const Markets: NextPage = () => {
  const wallet = useConnectedWallet();
  const sdkConfig = ConfigureSDK();

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
    sdkConfig.marketId
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
    sdkConfig.marketId
  );
  const { width: windowWidth } = useWindowSize();

  const [tableData, setTableData] = useState<MarketTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<MarketTableRow[]>(
    []
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [totalMarketDeposits, setTotalMarketDeposits] = useState(0);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);

  const [nftPrice, setNftPrice] = useState(0);
  const [calculatedNftPrice, setCalculatedNftPrice] = useState(false);
  const [marketPositions, setMarketPositions] = useState(0);

  const [userAvailableNFTs, setUserAvailableNFTs] = useState<Array<UserNFTs>>(
    []
  );
  const [userOpenPositions, setUserOpenPositions] = useState<
    Array<OpenPositions>
  >([]);
  const [userAllowance, setUserAllowance] = useState(0);
  const [loanToValue, setLoanToValue] = useState(0);
  const [userDebt, setUserDebt] = useState(0);
  const [depositNoteExchangeRate, setDepositNoteExchangeRate] = useState(0);
  const [cRatio, setCRatio] = useState(0);
  const [liqidationThreshold, setLiquidationThreshold] = useState(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
  const [userUSDCBalance, setUserUSDCBalance] = useState(0);
  const [userTotalDeposits, setUserTotalDeposits] = useState(0);
  const [sumOfTotalValue, setSumOfTotalValue] = useState(0);
  const [fetchedSolPrice, setFetchedSolPrice] = useState(0);
  const [calculatedInterestRate, setCalculatedInterestRate] = useState<number>(0);
  const [utilizationRate, setUtilizationRate] = useState(0);

  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);

  const availableNFTs: any = useFetchNFTByUser(wallet);
  let reFetchNFTs = availableNFTs[2];

  // sets the market debt
  useEffect(() => {
    const depositTokenMint = new PublicKey(
      'So11111111111111111111111111111111111111112'
    );

    if (honeyReserves) {
      const depositReserve = honeyReserves.filter(reserve =>
        reserve?.data?.tokenMint?.equals(depositTokenMint)
      )[0];

      const reserveState = depositReserve.data?.reserveState;

      if (reserveState?.outstandingDebt) {
        // let marketDebt = BnDivided(reserveState?.outstandingDebt, 10, 15);
        let marketDebt = reserveState?.outstandingDebt
          .div(new BN(10 ** 15))
          .toNumber();
        if (marketDebt) {
          let sum = Number(marketDebt / LAMPORTS_PER_SOL);
          setTotalMarketDebt(RoundHalfDown(sum));
        }
      }
    }
  }, [honeyReserves]);

  /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
   */
  useEffect(() => {
    setTimeout(() => {
      let depositNoteExchangeRate = 0,
        loanNoteExchangeRate = 0,
        nftPrice = 0,
        cRatio = 1;

      if (marketReserveInfo) {
        nftPrice = 2;
        depositNoteExchangeRate = BnToDecimal(
          marketReserveInfo[0].depositNoteExchangeRate,
          15,
          5
        );
      }

      if (honeyUser?.deposits().length > 0) {
        // let totalDeposit = BnDivided(honeyUser.deposits()[0].amount, 10, 5) * depositNoteExchangeRate / (10 ** 4)
        let totalDeposit =
          (honeyUser
            .deposits()[0]
            .amount.div(new BN(10 ** 5))
            .toNumber() *
            depositNoteExchangeRate) /
          10 ** 4;
        setUserTotalDeposits(totalDeposit);
      }
    }, 3000);
  }, [marketReserveInfo, honeyUser]);

  async function fetchSolValue(reserves: any, connection: any) {
    const slPrice = await fetchSolPrice(reserves, connection);
    setFetchedSolPrice(slPrice)
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
      // setTotalMarketDeposits(parsedReserves[0].reserveState.totalDeposits.div(new BN(10 ** 9)).toNumber());
      if (parsedReserves && sdkConfig.saberHqConnection) {
        fetchSolValue(parsedReserves, sdkConfig.saberHqConnection);
      }
    }
  }, [parsedReserves]);

  useEffect(() => {
    if (totalMarketDeposits && totalMarketDebt && totalMarketDeposits) {
      setUtilizationRate(Number(f((((totalMarketDeposits + totalMarketDebt) - totalMarketDeposits) / (totalMarketDeposits + totalMarketDebt)))))
    }
  }, [totalMarketDeposits, totalMarketDebt, totalMarketDeposits]);


  // fetches total market positions
  async function fetchObligations() {
    let obligations = await honeyMarket.fetchObligations();
    console.log('obligations:', obligations);
    setMarketPositions(obligations.length);
  }

  useEffect(() => {
    if (honeyMarket) {
      fetchObligations();
    }
  }, [honeyMarket]);

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
      setCalculatedNftPrice(true);
    }
  }

  useEffect(() => {
    calculateNFTPrice();
  }, [marketReserveInfo, parsedReserves]);

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

  /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
   */
  useEffect(() => {
    if (marketReserveInfo && parsedReserves) {
      setDepositNoteExchangeRate(
        BnToDecimal(marketReserveInfo[0].depositNoteExchangeRate, 15, 5)
      );
      setCRatio(BnToDecimal(marketReserveInfo[0].minCollateralRatio, 15, 5));
    }

    if (nftPrice && collateralNFTPositions && honeyUser && marketReserveInfo)
      fetchHelperValues(
        nftPrice,
        collateralNFTPositions,
        honeyUser,
        marketReserveInfo
      );

    setLiquidationThreshold((1 / cRatio) * 100);
  }, [
    marketReserveInfo,
    honeyUser,
    collateralNFTPositions,
    market,
    error,
    parsedReserves,
    honeyReserves,
    cRatio,
    reserveHoneyState,
    calculatedNftPrice,
    userAllowance,
    userDebt
  ]);

  useEffect(() => {
    setUserAvailableNFTs(availableNFTs[0]);
  }, [availableNFTs]);

  useEffect(() => {
    setSumOfTotalValue(totalMarketDeposits + totalMarketDebt);
  }, [totalMarketDebt, totalMarketDeposits]);

  useEffect(() => {
    if (collateralNFTPositions) {
      setUserOpenPositions(collateralNFTPositions);
    }
  }, [collateralNFTPositions]);

  async function calculateInterestRate(utilizationRate: number) {
    let interestRate = await getInterestRate(utilizationRate);
    if (interestRate) setCalculatedInterestRate(interestRate * utilizationRate);
  }

  useEffect(() => {
    console.log('Runnig')
    if (utilizationRate) {
      calculateInterestRate(utilizationRate)
    }
  }, [utilizationRate]);

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    const mockData: MarketTableRow[] = [
      {
        key: '0',
        name: 'Honey Genesis Bee',
        rate: 0.1,
        // validated available to be totalMarketDeposits
        available: totalMarketDeposits,
        // validated value to be totalMarkDeposits + totalMarketDebt
        value: sumOfTotalValue,
        allowance: userAllowance,
        positions: userOpenPositions,
        debt: userDebt
      }
    ];

    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, [
    totalMarketDeposits,
    totalMarketDebt,
    nftPrice,
    userOpenPositions,
    userAllowance,
    userDebt
  ]);

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const hideMobileSidebar = () => {
    debugger;
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  const handleToggle = (checked: boolean) => {
    setIsMyCollectionsFilterEnabled(checked);
  };

  const MyCollectionsToggle = () =>
    // <div className={style.toggle}>
    //   <HoneyToggle
    //     checked={isMyCollectionsFilterEnabled}
    //     onChange={handleToggle}
    //   />
    //   <span className={style.toggleText}>my collections</span>
    // </div>
    null;

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
                      <Image src={honeyGenesisBee} />
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
          render: (rate: number) => {
            return <div className={style.rateCell}>{fp(calculatedInterestRate)}</div>;
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
                <span>TVL</span>
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
                          <Image src={honeyGenesisBee} />
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

  const expandColumns: ColumnType<MarketTablePosition>[] = [
    {
      dataIndex: 'name',
      width: columnsWidth[0],
      render: (name, record) => (
        <div className={style.expandedRowNameCell}>
          <div className={style.expandedRowIcon} />
          <div className={style.collectionLogo}>
            <HexaBoxContainer>
              <Image src={honeyGenesisBee} />
            </HexaBoxContainer>
          </div>
          <div className={style.nameCellText}>
            <div className={style.collectionName}>{name}</div>
            <div className={style.risk.safe}>
              <span className={style.valueCell}>{fp(loanToValue * 100)}</span>{' '}
              <span className={style.riskText}>Risk lvl</span>
            </div>
          </div>
        </div>
      )
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
              <Image src={honeyGenesisBee} />
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
            Choose another market or connect a different wallet{' '}
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
  async function executeDepositNFT(mintID: any, toast: ToastProps['toast']) {
    try {
      if (!mintID) return;
      toast.processing();

      const metadata = await Metadata.findByMint(
        sdkConfig.saberHqConnection,
        mintID
      );
      const tx = await depositNFT(
        sdkConfig.saberHqConnection,
        honeyUser,
        metadata.pubkey
      );
      if (tx[0] == 'SUCCESS') {
        toast.success(
          'Deposit success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
        console.log('is there a success?');

        await refreshPositions();
        await reFetchNFTs({});
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
        console.log('is there a success');
        await reFetchNFTs({});
        await refreshPositions();
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

        await sdkConfig.saberHqConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: refreshedHoneyReserves
        });

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

        await sdkConfig.saberHqConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: refreshedHoneyReserves
        });

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
          userUSDCBalance={userUSDCBalance}
          loanToValue={loanToValue}
          hideMobileSidebar={hideMobileSidebar}
          fetchedSolPrice={fetchedSolPrice}
          calculatedInterestRate={calculatedInterestRate}
        />
      </HoneySider>
    </LayoutRedesign>
  );
};

export default Markets;
