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
import { calcNFT, getInterestRate, fetchSolPrice, populateMarketData } from 'helpers/loanHelpers/userCollection';
import { ToastProps } from 'hooks/useToast';
import { RoundHalfDown } from 'helpers/utils';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import { HONEY_GENESIS_BEE, LIFINITY_FLARES, OG_ATADIANS, PESKY_PENGUINS } from '../../constants/borrowLendMarkets';
import { HONEY_GENESIS_MARKET_ID, PESKY_PENGUINS_MARKET_ID } from '../../constants/loan';
import { setMarketId } from 'pages/_app';
import { marketCollections } from '../../constants/borrowLendMarkets';
import { generateMockHistoryData } from '../../helpers/chartUtils';
// TODO: fetch based on config
const network = 'mainnet-beta';

const Lend: NextPage = () => {
  /**
   * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
   * @params value to be formatted
   * @returns requested format 
  */
  const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;
  // Sets market ID which is used for fetching market specific data
  // each market currently is a different call and re-renders the page
  const [currentMarketId, setCurrentMarketId] = useState(HONEY_GENESIS_MARKET_ID);
  // init wallet and sdkConfiguration file
  const sdkConfig = ConfigureSDK();
  let walletPK = sdkConfig.sdkWallet?.publicKey;

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
  // market specific constants - calculations / ratios / debt / allowance etc.
  const [userTotalDeposits, setUserTotalDeposits] = useState(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
  const [marketPositions, setMarketPositions] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
  const [fetchedSolPrice, setFetchedSolPrice] = useState(0);
  const [honeyInterestRate, setHoneyInterestRate] = useState(0);
  const [peskyInterestRate, setPeskyInterestRate] = useState(0);
  const [userDepositWithdraw, setUserDepositWithdraw] = useState(0);
  const [activeMarketSupplied, setActiveMarketSupplied] = useState(0);
  const [activeMarketAvailable, setActiveMarketAvailable] = useState(0);
  const [totalMarketDeposits, setTotalMarketDeposits] = useState(0);
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
  // if there is a wallet - we fetch the users wallet balance
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
  
  // fetches the current sol price
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
      setTotalMarketDeposits(parsedReserves[0].reserveState.totalDeposits.div(new BN(10 ** 9)).toNumber());
      if (parsedReserves && sdkConfig.saberHqConnection) {
        fetchSolValue(parsedReserves, sdkConfig.saberHqConnection);
      }
     }
  }, [parsedReserves]);

  // fetches total market positions
  async function fetchObligations() {
    let obligations = await honeyMarket.fetchObligations();
    console.log('obligations:', obligations);
    setMarketPositions(obligations.length);
  }
  // on honeyMarket change call upon fetch obligations
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
    }
  }
  // upon marketreserve or parsed reserve change call upon calculateNFTPrice
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
        await fetchMarket();
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState == 0
            ? setReserveHoneyState(1)
            : setReserveHoneyState(0);
        });

        if (walletPK) await fetchWalletBalance(walletPK);

        userDepositWithdraw == 0 ? setUserDepositWithdraw(1) : setUserDepositWithdraw(0);

        toast.success(
          'Deposit success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );

      } else {
        return toast.error('Deposit failed');
      }
    } catch (error) {
      return toast.error('Deposit failed', error);
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
        await fetchMarket();
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState == 0
            ? setReserveHoneyState(1)
            : setReserveHoneyState(0);
        });
        if (walletPK) await fetchWalletBalance(walletPK);

        userDepositWithdraw == 0 ? setUserDepositWithdraw(1) : setUserDepositWithdraw(0);

        toast.success(
          'Withdraw success',
          `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
        );
        
      } else {
        return toast.error('Withdraw failed ');
      }
    } catch (error) {
      return toast.error('Withdraw failed ', error);
    }
  }

  const isMock = true;
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
  
  const [tableData, setTableData] = useState<LendTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<LendTableRow[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] = useState(false);

  useEffect(() => {
    if (sdkConfig.saberHqConnection && sdkConfig.sdkWallet) {

    function getData() {
      return Promise.all(
        marketCollections.map(async (collection) => {
          if (!collection.id) return;
          collection.id == HONEY_GENESIS_MARKET_ID ? setHoneyInterestRate(collection.rate) : setPeskyInterestRate(collection.rate);
          await populateMarketData(collection, sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, currentMarketId, true);
          collection.rate = await getInterestRate(collection.utilizationRate) || 0;
          collection.stats = getPositionData();

          if (currentMarketId == collection.id) {
            setActiveMarketSupplied(collection.value);
            setActiveMarketAvailable(collection.available);
          }
          
          return collection;
        })
      )
    }

    getData().then((result) => {
      setTableData(result);
    })
  }

  }, [
    // totalMarketDebt,
    nftPrice,
    honeyReserves,
    parsedReserves,
    sdkConfig.saberHqConnection,
    sdkConfig.sdkWallet,
    currentMarketId,
    // peskyInterestRate,
    // honeyInterestRate,
    userDepositWithdraw,
    marketReserveInfo,
    honeyUser,
    honeyReserves,
    totalMarketDeposits
  ]);

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
        sorter: (a: any = 0, b: any = 0) => a.rate - b.rate,
        render: (rate: number, market: any) => {
          console.log('B:: this is rate', rate)
          // console.log('B:: this is market', market)
          return <div className={style.rateCell}>{fp(rate)}</div>;
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
        render: (value: number, market: any) => {
          console.log('B:: this is value', value)
          // console.log('B:: this is market', market)
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
        render: (available: number, market: any) => {
          console.log('B:: this is available', available)
          console.log('B:: this is market', market)
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
    [tableData, isMyCollectionsFilterEnabled, searchQuery, tableDataFiltered]
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
          onRow={(record, rowIndex) => {
            return {
              onClick: event => handleMarketId(record)
            }
          }}
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
          available={activeMarketAvailable}
          value={activeMarketSupplied}
          userWalletBalance={userWalletBalance}
          fetchedSolPrice={fetchedSolPrice}
          marketImage={renderImage(currentMarketId == HONEY_GENESIS_MARKET_ID ? HONEY_GENESIS_BEE : PESKY_PENGUINS)}
          currentMarketId={currentMarketId}
        />
      </HoneySider>
    </LayoutRedesign>
  );
};

export default Lend;
