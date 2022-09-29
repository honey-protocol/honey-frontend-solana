import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
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
import honeyEyes from '/public/nfts/honeyEyes.png';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { formatNumber } from '../../helpers/format';
import { LiquidateTableRow } from '../../types/liquidate';
import { LiquidateExpandTable } from '../../components/LiquidateExpandTable/LiquidateExpandTable';
import { useAnchor, LiquidatorClient, useAllPositions, NftPosition, useHoney, useMarket } from '@honey-finance/sdk';
import { ConfigureSDK, toastResponse } from 'helpers/loanHelpers';
import { useConnectedWallet } from '@saberhq/use-solana';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { calcNFT, calculateCollectionwideAllowance } from 'helpers/loanHelpers/userCollection';
import { LiquidateTablePosition, BiddingPosition } from '../../types/liquidate';
import { HONEY_MARKET_ID, HONEY_PROGRAM_ID } from 'constants/loan';
import { NATIVE_MINT } from '@solana/spl-token';

const { formatPercent: fp, formatUsd: fu, formatRoundDown: fd } = formatNumber;

const Liquidate: NextPage = () => {
  // start sdk integration
  const liquidationThreshold = 0.75;
  // init anchor
  const { program } = useAnchor();
  // create wallet instance for PK
  const wallet = useConnectedWallet();
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
  const { ...status } = useAllPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  
  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
  */
  const { market, marketReserveInfo, parsedReserves, fetchMarket }  = useHoney();

  /**
   * @description calls upon the honey sdk
   * @params  useConnection func. | useConnectedWallet func. | honeyID | marketID
   * @returns honeyUser | honeyReserves - used for interaction regarding the SDK
  */
  const { honeyClient, honeyUser, honeyReserves, honeyMarket } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);

  /**
    * @description declare state
    * @params none
    * @returns open positions | bidding data | userbid | user position
  */
  const [fetchedPositions, setFetchedPositions] = useState<Array<LiquidateTablePosition>>([]);
  const [hasPosition, setHasPosition] = useState(false);
  const [highestBiddingAddress, setHighestBiddingAddress] = useState('');
  const [highestBiddingValue, setHighestBiddingValue] = useState(0);
  const [currentUserBid, setCurrentUserBid] = useState(0);
  const [userInput, setUserInput] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [refetchState, setRefetchState] = useState(false);
  const [nftPrice, setNftPrice] = useState<number>(0);
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [tvl, setTvl] = useState<number>(0);
  const [biddingArray, setBiddingArray] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [loanToValue, setLoanToValue] = useState<number>(0);
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
  async function handleBiddingState(biddingArray: any, positions: any) {
    biddingArray.map((obligation: any) => {
      if (obligation.bidder == stringyfiedWalletPK) {
        setHasPosition(true);
        setCurrentUserBid(Number(obligation.bidLimit / LAMPORTS_PER_SOL));
      }
    });

    // let sorted = await positions.sort((first: any,second: any) => first.is_healthy - second.is_healthy).reverse();
    let sorted = await positions.map((obligation: any, index: number) => {
      return {
        name: 'Honey Eyes',
        riskLvl: (obligation.debt / nftPrice) * 100,
        untilLiquidation: obligation.debt !== 0 ? (nftPrice / (obligation.debt / liquidationThreshold)) : 0,
        debt: obligation.debt,
        estimatedValue: nftPrice,
        nftMint: obligation.nft_mint,
        owner: obligation.owner,
        obligation: obligation.obligation,
        highestBid: obligation.highest_bid
      }
    });

    let highestBid = await biddingArray.sort((first: any, second: any) => first.bidLimit - second.bidLimit).reverse();
    let sumOfDebt = await positions.reduce((acc: number, obligation: any) => {
      return acc + obligation.debt
    }, 0);
    
    setTotalDebt(sumOfDebt);
    setLoanToValue((sumOfDebt / positions.length) / nftPrice);

    if (nftPrice) setTvl(nftPrice * positions.length);

    if (highestBid[0]) {
      setHighestBiddingAddress(highestBid[0].bidder);
      setHighestBiddingValue(highestBid[0].bidLimit / LAMPORTS_PER_SOL);
    }

    setFetchedPositions(sorted);
  }

  const [statusState, setStatusState] = useState(false);

  useEffect(() => {
    console.log('this is has pos', hasPosition)
  }, [hasPosition])

  /**
   * @description checks if there are positions, if so set state
   * @params none
   * @returns state positions && bids
  */
  useEffect(() => {
    if (status.positions) {
      setStatusState(true);
    }
    return;
  }, [status.positions]);

  // triggers if there are positions - inits fetch positions
  useEffect(() => {
    if (statusState == true && status.bids && status.positions) {
      handleBiddingState(status.bids, status.positions);
      setBiddingArray(status.bids);
    }

    return;
  }, [statusState, nftPrice, loanToValue]);

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

  // // calculate loan to value == risk level
  // async function fetchHelperValues(nftPrice: any, collateralNFTPositions: any, honeyUser: any, marketReserveInfo: any) {
  //   // if (marketReserveInfo && honeyUser) {
  //   //   let outcome = await calculateCollectionwideAllowance(nftPrice, collateralNFTPositions, honeyUser, marketReserveInfo)
  //   //   setLoanToValue(outcome.sumOfLtv);
  //   //   console.log('outcome', outcome.sumOfLtv)
  //   // }

  // }

  // /**
  //  * @description updates honeyUser | marketReserveInfo | - timeout required
  //  * @params none
  //  * @returns honeyUser | marketReserveInfo |
  // */
  // useEffect(() => {
  //   if (nftPrice && honeyUser && marketReserveInfo) fetchHelperValues(nftPrice, [], honeyUser, marketReserveInfo);
  // }, [marketReserveInfo, honeyUser, honeyReserves, nftPrice]);      

  /**
   * @description calls upon liquidator client for placebid | revokebid | increasebid
   * @params tpye | userbid | nftmint
   * @returms toastresponse of executed call
  */
  async function fetchLiquidatorClient(type: string, userBid?: number) {
    try {
      const liquidatorClient = await LiquidatorClient.connect(program.provider, HONEY_PROGRAM_ID, false);
      if (wallet) {
        if (type == 'revoke_bid') {
          console.log('@@--curr user bid', currentUserBid)
          if (!currentUserBid) return;

          let transactionOutcome: any = await liquidatorClient.revokeBid({
            market: new PublicKey(HONEY_MARKET_ID),
            bidder: wallet.publicKey,
            bid_mint: NATIVE_MINT,
            withdraw_destination: wallet.publicKey
          });

          if (transactionOutcome[0] == 'SUCCESS') {
            return toastResponse('SUCCESS', 'Bid revoked, fetching chain data', 'SUCCESS');
          } else {
            console.log('@@--error', transactionOutcome)
            return toastResponse('ERROR', 'Revoke bid failed', 'ERROR');
          }
        } else if (type == 'place_bid') {
            // if no user bid terminate action
            if (!userBid) return;

            userBid = Number(userBid.toFixed(2));
            console.log('@@--', typeof(userBid))

            let transactionOutcome: any = await liquidatorClient.placeBid({
              bid_limit: userBid,
              market: new PublicKey(HONEY_MARKET_ID),
              bidder: wallet.publicKey,
              bid_mint: NATIVE_MINT
            });

            // refreshDB();
            if (transactionOutcome[0] == 'SUCCESS') {
              return toastResponse('SUCCESS', 'Bid placed, fetching chain data', 'SUCCESS');
            } else {
              return toastResponse('ERROR', 'Bid failed', 'ERROR');
            }

        } else if (type == 'increase_bid') {
            // if no user bid terminate action
            if (!userBid) return;

            let transactionOutcome: any = await liquidatorClient.increaseBid({
              bid_increase: userBid,
              market: new PublicKey(HONEY_MARKET_ID),
              bidder: wallet.publicKey,
              bid_mint: NATIVE_MINT,
            });

            if (transactionOutcome[0] == 'SUCCESS') {
              return toastResponse('SUCCESS', 'Bid increased, fetching chain data', 'SUCCESS');
            } else {
              return toastResponse('ERROR', 'Bid increase failed', 'ERROR');
            }
          }
      } else {
          return;
        }
      } catch (error) {
          console.log('The error:', error)
          return toastResponse('ERROR', 'Bid failed', 'ERROR');
        }
  }

  function handleRevokeBid(type: string) {
    fetchLiquidatorClient(type);
  }

  function handleIncreaseBid(type: string, userBid: number) {
    fetchLiquidatorClient(type, userBid!);
  }

  function handlePlaceBid(type: string, userBid: number) {
    fetchLiquidatorClient(type, userBid!);
  }





  // end of sdk integration

  const [tableData, setTableData] = useState<LiquidateTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<
    LiquidateTableRow[]
  >([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [isMyBidsFilterEnabled, setIsMyBidsFilterEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    const mockData: LiquidateTableRow[] = [
      {
        key: '0',
        name: 'Honey Eyes',
        risk: loanToValue,
        liqThreshold: 0.75,
        totalDebt: totalDebt,
        tvl: nftPrice * fetchedPositions.length,
        positions: fetchedPositions
      },
    ];

    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, [fetchedPositions]);

  const handleToggle = (checked: boolean) => {
    setIsMyBidsFilterEnabled(checked);
  };

  const onSearch = (searchTerm: string): LiquidateTableRow[] => {
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

  // Apply search if initial liquidations list changed
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [tableData]);

  const columnsWidth: Array<number | string> = [250, 90, 150, 150, 200];

  const columns: ColumnType<LiquidateTableRow>[] = useMemo(
    () => [
      {
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
            >
              <span>Risk</span>
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'risk',
        sorter: (a, b) => a.risk - b.risk,
        render: (rate: number) => {
          return <div className={style.rateCell}>{fp(rate * 100)}</div>;
        }
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
            >
              <span>Liq %</span>
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'liqThreshold',
        sorter: (a, b) => a.liqThreshold - b.liqThreshold,
        render: (rate: number) => {
          return <div className={style.rateCell}>{fp(rate * 100)}</div>;
        }
      },
      {
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'totalDebt');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Total Debt</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'totalDebt',
        sorter: (a, b) => a.totalDebt - b.totalDebt,
        render: (available: number) => {
          return <div className={style.availableCell}>{fu(available)}</div>;
        }
      },
      {
        width: columnsWidth[3],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'tvl');
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
        dataIndex: 'tvl',
        sorter: (a, b) => a.tvl - b.tvl,
        render: (value: number) => {
          return <div className={style.valueCell}>{fu(value)}</div>;
        }
      },
      {
        title: (
          <div className={style.toggle}>
            <HoneyToggle
              checked={isMyBidsFilterEnabled}
              onChange={handleToggle}
            />
            <span className={style.toggleText}>my bids</span>
          </div>
        ),
        render: (_: null, row: LiquidateTableRow) => {
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

  return (
    <LayoutRedesign>
      <Content>
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
                <div className={style.expandSection}>
                  <div className={style.dashedDivider} />
                  <LiquidateExpandTable data={record.positions} />
                </div>
              );
            }
          }}
        />
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
      </Content>
      <Sider width={350}>
        <LiquidateSidebar 
          collectionId="0" 
          biddingArray={biddingArray}
          userBalance={userBalance}
          highestBiddingValue={highestBiddingValue}
          currentUserBid={currentUserBid}
          handleRevokeBid={handleRevokeBid}
          handleIncreaseBid={handleIncreaseBid}
          handlePlaceBid={handlePlaceBid}
        />
      </Sider>
    </LayoutRedesign>
  );
};

export default Liquidate;
