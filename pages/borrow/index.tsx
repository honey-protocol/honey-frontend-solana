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
import honeyEyes from '/public/nfts/honeyEyes.png';
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
  calculateCollectionwideAllowance
} from 'helpers/loanHelpers/userCollection';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { MAX_LTV } from 'constants/loan';
import { ToastProps } from 'hooks/useToast';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import HoneySider from '../../components/HoneySider/HoneySider';
import { TABLET_BP } from '../../constants/breakpoints';
import useWindowSize from '../../hooks/useWindowSize';
// import { network } from 'pages/_app';

const network = 'devnet'; // change to dynamic value

const { formatPercent: fp, formatUsd: fu } = formatNumber;

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
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [calculatedNftPrice, setCalculatedNftPrice] = useState(false);
  const [marketPositions, setMarketPositions] = useState(0);
  const [userBorrowCapacity, setUserBorrowCapacity] = useState(0);
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
        let marketDebt = reserveState?.outstandingDebt
          .div(new BN(10 ** 15))
          .toNumber();
        if (marketDebt) {
          let sum = Number(marketDebt / LAMPORTS_PER_SOL);
          setTotalMarketDebt(sum);
        }
      }
    }
  }, [honeyReserves]);

  // sets total market deposits
  useEffect(() => {
    if (parsedReserves && parsedReserves[0].reserveState.totalDeposits) {
      let totMarketDeposits = BnToDecimal(
        parsedReserves[0].reserveState.totalDeposits,
        9,
        2
      );
      setTotalDeposits(totMarketDeposits);
    }
  }, [parsedReserves]);

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
    console.log('this is ltv', loanToValue);
    console.log('this is user allowance', userAllowance);
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
    calculatedNftPrice
  ]);

  useEffect(() => {
    console.log('---availableNFTs---', availableNFTs);
    setUserAvailableNFTs(availableNFTs[0]);
  }, [availableNFTs]);

  useEffect(() => {
    console.log('total deposits', totalDeposits);
    console.log('total marketDebt', totalMarketDebt);
  }, [totalDeposits, totalBorrowed]);

  useEffect(() => {
    console.log('--collateral nft positions--', collateralNFTPositions);
    if (collateralNFTPositions) {
      setUserOpenPositions(collateralNFTPositions);
      console.log('user open positions', userOpenPositions);
    }
  }, [collateralNFTPositions]);

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    const mockData: MarketTableRow[] = [
      {
        key: '0',
        name: 'Honey Eyes',
        rate: 0.1,
        available: totalDeposits - totalMarketDebt,
        value: totalDeposits,
        positions: userOpenPositions
      }
    ];

    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, [totalDeposits, totalMarketDebt, nftPrice, userOpenPositions]);

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

  const MyCollectionsToggle = () => (
    <div className={style.toggle}>
      <HoneyToggle
        checked={isMyCollectionsFilterEnabled}
        onChange={handleToggle}
      />
      <span className={style.toggleText}>my collections</span>
    </div>
  );

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
  const columnsWidth: Array<number | string> = [240, 100, 150, 150, 200];

  const columns: HoneyTableColumnType<MarketTableRow>[] = useMemo(
    () =>
      [
        {
          width: columnsWidth[0],
          title: SearchForm,
          dataIndex: 'name',
          key: 'name',
          hidden: windowWidth < TABLET_BP,
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
                <span>Rate</span>
                <div className={style.sortIcon[sortOrder]} />
              </div>
            );
          },
          dataIndex: 'name',
          key: 'name',
          hidden: windowWidth > TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.rate - b.rate,
          render: (name: string, row: MarketTableRow) => {
            return (
              <div className={style.nameCell}>
                <div className={style.logoWrapper}>
                  <div className={style.collectionLogo}>
                    <HexaBoxContainer>
                      <Image src={honeyEyes} />
                    </HexaBoxContainer>
                  </div>
                </div>
                <div className={style.nameCellMobile}>
                  <div className={style.collectionName}>{name}</div>
                  <div className={style.rateCellMobile}>
                    {fp(row.rate * 100)}
                  </div>
                </div>
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
                <span>Rate</span>
                <div className={style.sortIcon[sortOrder]} />
              </div>
            );
          },
          dataIndex: 'rate',
          hidden: windowWidth < TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.rate - b.rate,
          render: (rate: number) => {
            return <div className={style.rateCell}>{fp(rate * 100)}</div>;
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
            return <div className={style.availableCell}>{fu(available)}</div>;
          }
        },
        {
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
          hidden: windowWidth > TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) =>
            a.available - b.available,
          render: (available: number) => {
            return <div className={style.availableCell}>{fu(available)}</div>;
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
                <span>Value</span>
                <div className={style.sortIcon[sortOrder]} />
              </div>
            );
          },
          dataIndex: 'value',
          hidden: windowWidth < TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.value - b.value,
          render: (value: number) => {
            return <div className={style.valueCell}>{fu(value)}</div>;
          }
        },
        {
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
                <span>Value</span>
                <div className={style.sortIcon[sortOrder]} />
              </div>
            );
          },
          dataIndex: 'value',
          hidden: windowWidth > TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.value - b.value,
          render: (value: number) => {
            return <div className={style.valueCell}>{fu(value)}</div>;
          }
        },
        {
          width: columnsWidth[4],
          title: MyCollectionsToggle,
          hidden: windowWidth < TABLET_BP,
          render: (_: null, row: MarketTableRow) => {
            return (
              <div className={style.buttonsCell}>
                <HoneyButton variant="text">
                  View <div className={style.arrowIcon} />
                </HoneyButton>
              </div>
            );
          }
        },
        {
          width: '60px',
          title: '',
          hidden: windowWidth > TABLET_BP,
          render: (_: null, row: MarketTableRow) => {
            return (
              <div className={style.buttonsCell}>
                <HoneyButton variant="text">
                  <div className={style.arrowIcon} />
                </HoneyButton>
              </div>
            );
          }
        }
      ].filter(column => !column.hidden),
    [isMyCollectionsFilterEnabled, tableData, searchQuery, windowWidth]
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
              <Image src={honeyEyes} />
            </HexaBoxContainer>
          </div>
          <div className={style.nameCellText}>
            <div className={style.collectionName}>{name}</div>
            <div className={style.risk.safe}>
              <span className={style.valueCell}>{fp(loanToValue)}</span>{' '}
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
          <InfoBlock title={'Debt:'} value={fu(userDebt)} />
        </div>
      )
    },
    {
      dataIndex: 'available',
      width: columnsWidth[2],
      render: available => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Allowance:'} value={fu(nftPrice * MAX_LTV)} />
        </div>
      )
    },
    {
      dataIndex: 'value',
      width: columnsWidth[3],
      render: value => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Value:'} value={fu(nftPrice)} />
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

  const ExpandedTableFooter = () => (
    <div className={style.expandedSectionFooter}>
      <div className={style.expandedRowIcon} />
      <div className={style.collectionLogo}>
        <HexaBoxContainer variant="gray">
          <div className={style.lampIconStyle} />
        </HexaBoxContainer>
      </div>
      <div className={style.footerText}>
        <span className={style.footerTitle}>
          You can’t add one more NFT to this market
        </span>
        <span className={style.footerDescription}>
          Choose another market or connect another wallet
        </span>
      </div>
      <div className={style.footerButton}>
        <HoneyButton variant="secondary">
          <div className={style.swapWalletIcon} />
          Connect another wallet
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
      <HoneyContent>
        <div className={style.mobileTableHeader}>
          <div className={style.mobileRow}>
            <SearchForm />
          </div>
          <div className={style.mobileRow}>
            <MyCollectionsToggle />
          </div>
        </div>
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
                    footer={ExpandedTableFooter}
                  />
                </div>
              );
            }
          }}
        />
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
        />
      </HoneySider>
    </LayoutRedesign>
  );
};

export default Markets;
