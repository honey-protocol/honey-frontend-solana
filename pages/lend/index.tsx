import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { LendTableRow } from '../../types/lend';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import * as style from '../../styles/markets.css';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { Key } from 'antd/lib/table/interface';
import { formatNumber } from '../../helpers/format';
import SearchInput from '../../components/SearchInput/SearchInput';
import debounce from 'lodash/debounce';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { HoneyChart } from '../../components/HoneyChart/HoneyChart';
import HoneySider from '../../components/HoneySider/HoneySider';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import { deposit, withdraw, useMarket, useHoney } from '@honey-finance/sdk';
import {
  toastResponse,
  BnToDecimal,
  BnDivided,
  ConfigureSDK
} from '../../helpers/loanHelpers/index';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import HoneyToggle from 'components/HoneyToggle/HoneyToggle';
import { calcNFT, getInterestRate, fetchSolPrice } from 'helpers/loanHelpers/userCollection';
import { ToastProps } from 'hooks/useToast';
import { RoundHalfDown } from 'helpers/utils';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import { HONEY_GENESIS_BEE, LIFINITY_FLARES, OG_ATADIANS, PESKY_PENGUINS } from '../../constants/borrowLendMarkets';
import { HONEY_GENESIS_MARKET_ID, PESKY_PENGUINS_MARKET_ID } from '../../constants/loan';

const network = 'mainnet-beta';

const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;

const Lend: NextPage = () => {
  // Start: SDK integration
  // TODO: write dynamic currentMarketId based on user interaction
  const [currentMarketId, setCurrentMarketId] = useState(HONEY_GENESIS_MARKET_ID);
  const sdkConfig = ConfigureSDK();
  let walletPK = sdkConfig.sdkWallet?.publicKey;

  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
   */
  const { market, marketReserveInfo, parsedReserves, fetchMarket } = useHoney();

  /**
   * @description calls upon the honey sdk - market
   * @params solanas useConnection func. && useConnectedWallet func. && JET ID
   * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
   */
  const { honeyUser, honeyReserves, honeyMarket } = useMarket(
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet!,
    sdkConfig.honeyId,
    currentMarketId
  );

  const [totalMarketDeposits, setTotalMarketDeposits] = useState(0);
  const [userTotalDeposits, setUserTotalDeposits] = useState(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
  const [marketPositions, setMarketPositions] = useState(0);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
  const [utilizationRate, setUtilizationRate] = useState(0);
  const [calculatedInterestRate, setCalculatedInterestRate] = useState<number>(0);
  const [fetchedSolPrice, setFetchedSolPrice] = useState(0);

  useEffect(() => {
    if (totalMarketDeposits && totalMarketDebt && totalMarketDeposits) {
      setUtilizationRate(Number(f((((totalMarketDeposits + totalMarketDebt) - totalMarketDeposits) / (totalMarketDeposits + totalMarketDebt)))))
    }
  }, [totalMarketDeposits, totalMarketDebt, totalMarketDeposits]);

  async function calculateInterestRate(utilizationRate: number) {
    let interestRate = await getInterestRate(utilizationRate);
    if (interestRate) setCalculatedInterestRate(interestRate * utilizationRate);
  }

  useEffect(() => {
    if (utilizationRate) {
      calculateInterestRate(utilizationRate)
    }
  }, [utilizationRate]);

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
    if (walletPK) {
      fetchWalletBalance(walletPK);
    }
  }, [walletPK]);

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

  useEffect(() => {}, [reserveHoneyState]);

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

  useEffect(() => {
    calculateNFTPrice();
  }, [marketReserveInfo, parsedReserves]);

  /**
   * @description deposits 1 sol
   * @params optional value from user input; amount of SOL
   * @returns succes | failure
   */
  async function executeDeposit(value?: number, toast?: ToastProps['toast']) {
    if (!toast) return;
    try {
      if (!value) return toast.error('Deposit failed');

      const tokenAmount = value * LAMPORTS_PER_SOL;
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

        if (walletPK) await fetchWalletBalance(walletPK);
        toast.success(
          'Deposit success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
      } else {
        return toast.error('Deposit failed');
      }
    } catch (error) {
      return toast.error('Deposit failed');
    }
  }

  /**
   * @description withdraws 1 sol
   * @params optional value from user input; amount of SOL
   * @returns succes | failure
   */
  async function executeWithdraw(value: number, toast?: ToastProps['toast']) {
    if (!toast) return;
    try {
      if (!value) return toast.error('Withdraw failed');

      const tokenAmount = value * LAMPORTS_PER_SOL;
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
  // End: SDK integration

  const isMock = true;
  const [tableData, setTableData] = useState<LendTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<LendTableRow[]>(
    []
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);

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
    console.log('calculated interest rate', calculatedInterestRate)
    const mockData: LendTableRow[] = [
      {
        key: 'HNYG',
        name: HONEY_GENESIS_BEE,
        interest: calculatedInterestRate,
        // validated available to be totalMarketDeposits
        available: totalMarketDeposits,
        // validated value to be totalMarkDeposits + totalMarketDebt
        value: totalMarketDeposits + totalMarketDebt,
        stats: getPositionData()
      },
      {
        key: 'LIFINITY',
        name: LIFINITY_FLARES,
        interest: 0,
        // validated available to be totalMarketDeposits
        available: 0,
        // validated value to be totalMarkDeposits + totalMarketDebt
        value: 0,
        stats: getPositionData()
      },
      {
        key: 'ATD',
        name: OG_ATADIANS,
        interest: 0,
        // validated available to be totalMarketDeposits
        available: 0,
        // validated value to be totalMarkDeposits + totalMarketDebt
        value: 0,
        stats: getPositionData()
      },
      {
        key: 'NOOT',
        name: PESKY_PENGUINS,
        interest: 0,
        // validated available to be totalMarketDeposits
        available: 0,
        // validated value to be totalMarkDeposits + totalMarketDebt
        value: 0,
        stats: getPositionData()
      }
    ];
    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, [totalMarketDeposits, totalMarketDebt, marketPositions, nftPrice, calculatedInterestRate]);

  const handleToggle = (checked: boolean) => {
    setIsMyCollectionsFilterEnabled(checked);
  };

  const MyCollectionsToggle = () => null;

  const renderImage = (name: string) => {
    if (name == 'Honey Genesis Bee') {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db'} layout="fill" />
    } else if (name == 'Lifinity Flares') {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8'} layout="fill" />
    } else if (name == 'OG Atadians') {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/atadians_pfp_1646721263627.gif'} layout="fill" />
    } else {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png'} layout="fill" />
    }
  }

  const columnsWidth: Array<number | string> = [240, 150, 150, 150, 150];

  const columns: ColumnType<LendTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
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
                    {renderImage(name)}
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
              <span>Interest rate</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'rate',
        sorter: (a, b) => a.interest - b.interest,
        render: (rate: number, market: any) => {
          console.log('rate', market);
          return <div className={style.rateCell}>{fp(market.interest)}</div>;
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
              <span>Supplied</span> <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'value',
        sorter: (a, b) => a.value - b.value,
        render: (value: number) => {
          return <div className={style.valueCell}>{fs(value)}</div>;
        }
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
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'available',
        sorter: (a, b) => a.available - b.available,
        render: (available: number) => {
          return <div className={style.availableCell}>{fs(available)}</div>;
        }
      },
      {
        width: columnsWidth[4],
        title: MyCollectionsToggle,
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
    [tableData, isMyCollectionsFilterEnabled, searchQuery]
  );

  return (
    <LayoutRedesign>
      <div>
        <Typography.Title className={pageTitle}>Lend</Typography.Title>
        <Typography.Text className={pageDescription}>
          Earn yield by depositing crypto into NFT markets.{' '}
          <span>
            <a target="_blank" href="https://buy.moonpay.com" rel="noreferrer">
              <HoneyButton style={{ display: 'inline' }} variant="text">
                Need crypto?
              </HoneyButton>
            </a>
          </span>
        </Typography.Text>
      </div>
      <HoneyContent>
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
            onExpand: (expanded, row) =>
              setExpandedRowKeys(expanded ? [row.key] : []),
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
      </HoneyContent>
      <HoneySider>
        <LendSidebar
          collectionId="s"
          executeDeposit={executeDeposit}
          executeWithdraw={executeWithdraw}
          userTotalDeposits={userTotalDeposits}
          available={totalMarketDeposits}
          value={totalMarketDeposits + totalMarketDebt}
          userWalletBalance={userWalletBalance}
          fetchedSolPrice={fetchedSolPrice}
        />
      </HoneySider>
    </LayoutRedesign>
  );
};

export default Lend;
