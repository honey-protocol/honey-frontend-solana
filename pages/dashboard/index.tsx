import type { NextPage } from 'next';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import React, { useEffect, useMemo, useState } from 'react';
import * as styles from '../../styles/dashboard.css';
import { HoneyPositionsSlider } from '../../components/HoneyPositionsSlider/HoneyPositionsSlider';
import { NotificationCardProps } from '../../components/NotificationCard/types';
import NotificationsList from '../../components/NotificationsList/NotificationsList';
import { CollectionPosition } from '../../components/HoneyPositionsSlider/types';
import HoneySider from '../../components/HoneySider/HoneySider';
import { HoneyCardsGrid } from '../../components/HoneyCardsGrid/HoneyCardsGrid';
import {
  BorrowUserPosition,
  LendUserPosition
} from '../../components/HoneyCardsGrid/types';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import { OpenPositions, UserNFTs } from '../../types/markets';

import {
  borrow,
  depositNFT,
  repay,
  useBorrowPositions,
  useHoney,
  useMarket,
  withdrawNFT
} from '@honey-finance/sdk';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BnToDecimal, ConfigureSDK } from '../../helpers/loanHelpers';
import useFetchNFTByUser from '../../hooks/useNFTV2';
import { useConnectedWallet } from '@saberhq/use-solana';

import BN from 'bn.js';
import { RoundHalfDown } from '../../helpers/utils';
import {
  calcNFT,
  calculateCollectionwideAllowance,
  fetchSolPrice,
  getInterestRate
} from '../../helpers/loanHelpers/userCollection';
import { ToastProps } from '../../hooks/useToast';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { HoneyProfileChart } from '../../components/HoneyProfileChart/HoneyProfileChart';
import { HONEY_GENESIS_MARKET_ID, MAX_LTV } from '../../constants/loan';
import useWindowSize from '../../hooks/useWindowSize';
import { TABLET_BP } from '../../constants/breakpoints';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { PositionType } from '../../types/dashboard';
import { formatNumber } from '../../helpers/format';

const network = 'devnet'; // change to dynamic value

const data: NotificationCardProps[] = [
  {
    title: 'Title of notification',
    description:
      'Lorem Ipsum is simply dummy text of the' +
      ' Lorem Ipsum is simply dummy text of the'
  },
  {
    title: 'Title of notification',
    description:
      'Lorem Ipsum is simply dummy text of the' +
      ' Lorem Ipsum is simply dummy text of the'
  },
  {
    title: 'Title of notification',
    description:
      'Lorem Ipsum is simply dummy text of the' +
      ' Lorem Ipsum is simply dummy text of the'
  },
  {
    title: 'Title of notification',
    description:
      'Lorem Ipsum is simply dummy text of the' +
      ' Lorem Ipsum is simply dummy text of the'
  },
  {
    title: 'Title of notification',
    description:
      'Lorem Ipsum is simply dummy text of the' +
      ' Lorem Ipsum is simply dummy text of the'
  },
  {
    title: 'Title of notification',
    description:
      'Lorem Ipsum is simply dummy text of the' +
      ' Lorem Ipsum is simply dummy text of the'
  },
  {
    title: 'Title of notification',
    description:
      'Lorem Ipsum is simply dummy text of the' +
      ' Lorem Ipsum is simply dummy text of the'
  }
];

const { format: f } = formatNumber;

const Dashboard: NextPage = () => {
  const sdkConfig = ConfigureSDK();
  const wallet = useConnectedWallet();

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
    'current_market_id'
  );

  const [selected, setSelected] = useState<string | undefined>();
  const isMock = true;
  const userExposure = 4129.1;
  const { width } = useWindowSize();
  const [dataArray, setDataArray] = useState<NotificationCardProps[]>([]);

  const userWalletBalance = 50;
  const [fetchedSolPrice, setFetchedSolPrice] = useState(0);

  useEffect(() => {
    if (width >= TABLET_BP) {
      setDataArray(data.slice(0, 3));
    } else {
      setDataArray(data.slice(0, 1));
    }
  }, [width, data]);

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
      // setTotalMarketDeposits(parsedReserves[0].reserveState.totalDeposits.div(new BN(10 ** 9)).toNumber());
      if (parsedReserves && sdkConfig.saberHqConnection) {
        fetchSolValue(parsedReserves, sdkConfig.saberHqConnection);
      }
    }
  }, [parsedReserves]);

  const getUserExposureData = () => {
    if (isMock) {
      const from = new Date()
        .setFullYear(new Date().getFullYear() - 1)
        .valueOf();
      const to = new Date().valueOf();
      return generateMockHistoryData(from, to, 10000);
    }
    return [];
  };

  const userExposureData = useMemo(() => getUserExposureData(), []);

  const getMockPriceDebtValue = () => {
    const price = Math.floor(Math.random() * 1000);
    const debt = Math.floor(Math.random() * (price - (price / 100) * MAX_LTV));
    return { price, debt };
  };

  const getBorrowUserPositionsMock = () => {
    const preparedPositions: BorrowUserPosition[] = [];
    for (let i = 0; i < 20; i++) {
      preparedPositions.push({
        name: `Any user position #${i + 1000}`,
        price: getMockPriceDebtValue().price,
        debt: getMockPriceDebtValue().debt,
        ir: Math.random(),
        imageUrl: '/nfts/azuki.jpg',
        id: i.toString() + '_borrow'
      });
    }
    for (let j = 0; j < 5; j++) {
      preparedPositions.push({
        name: 'Any user position',
        price: getMockPriceDebtValue().price,
        debt: 0,
        ir: Math.random(),
        imageUrl: '/nfts/azuki.jpg',
        id: j.toString() + '_borrow_nodebt'
      });
    }
    return preparedPositions;
  };

  const getLendUserPositionsMock = () => {
    const preparedPositions: LendUserPosition[] = [];
    for (let i = 0; i < 20; i++) {
      preparedPositions.push({
        name: `Any user position #${i + 1000}`,
        deposit: Math.random() * 1000,
        value: Math.random() * 1000,
        ir: Math.random(),
        available: Math.random() * 1000,
        imageUrl: '/nfts/gecko.jpg',
        id: i.toString() + '_lend'
      });
    }
    return preparedPositions;
  };

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const mockBorrowUserPositions = useMemo(
    () => getBorrowUserPositionsMock(),
    []
  );

  const mockLendUserPositions = useMemo(() => getLendUserPositionsMock(), []);

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
    'current_market_id'
  );

  const [totalMarketDeposits, setTotalMarketDeposits] = useState(0);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [positionType, setPositionType] = useState<PositionType>('borrow');
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
  const [calculatedInterestRate, setCalculatedInterestRate] =
    useState<number>(0);
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

  useEffect(() => {
    if (totalMarketDeposits && totalMarketDebt && totalMarketDeposits) {
      setUtilizationRate(
        Number(
          f(
            (totalMarketDeposits + totalMarketDebt - totalMarketDeposits) /
              (totalMarketDeposits + totalMarketDebt)
          )
        )
      );
    }
  }, [totalMarketDeposits, totalMarketDebt, totalMarketDeposits]);

  async function calculateInterestRate(utilizationRate: number) {
    // TODO: update market ID param to be dynamic before going live with the dashboard page
    let interestRate = await getInterestRate(utilizationRate, HONEY_GENESIS_MARKET_ID);
    if (interestRate) setCalculatedInterestRate(interestRate);
  }

  useEffect(() => {
    console.log('Runnig');
    if (utilizationRate) {
      calculateInterestRate(utilizationRate);
    }
  }, [utilizationRate]);

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

  const getMockPositions = () => {
    const mockData: CollectionPosition[] = [];

    for (let i = 0; i < 30; i++) {
      mockData.push({
        name: `Any name loooong #${i}`,
        value: Math.random() * 10000,
        difference: Math.random(),
        image: '/nfts/honeyEyes.png'
      });
    }
    return mockData;
  };

  const hideMobileSidebar = () => {
    debugger;
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  const dashboardSidebar = () => (
    <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
      {positionType === 'borrow' ? (
        <MarketsSidebar
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
          calculatedInterestRate={calculatedInterestRate}
          //TODO: fix market id
          currentMarketId={''}
        />
      ) : (
        <LendSidebar
          collectionId="s"
          executeDeposit={() => {
            console.log('deposit pressed');
          }}
          executeWithdraw={() => {
            console.log('widthdraw pressed');
          }}
          userTotalDeposits={userTotalDeposits}
          available={totalMarketDeposits}
          value={totalMarketDeposits + totalMarketDebt}
          userWalletBalance={userWalletBalance}
          fetchedSolPrice={fetchedSolPrice}
          onCancel={hideMobileSidebar}
          //TODO: fix market id
          currentMarketId={''}
          marketImage={''}
        />
      )}
    </HoneySider>
  );

  return (
    <LayoutRedesign>
      <HoneyContent className={styles.dashboard}>
        <div className={styles.pageHeader}>
          <div className={styles.chartContainer}>
            <HoneyProfileChart data={userExposureData} value={userExposure} />
          </div>
          <div className={styles.notificationsWrapper}>
            <NotificationsList data={dataArray} />
          </div>
        </div>
        <HoneyPositionsSlider positions={getMockPositions()} />
      </HoneyContent>
      <HoneyContent sidebar={dashboardSidebar()}>
        <div className={styles.pageContentElements}>
          <div className={styles.gridWrapper}>
            <HoneyCardsGrid
              borrowPositions={mockBorrowUserPositions}
              lendPositions={mockLendUserPositions}
              selected={selected}
              onChangePositionType={setPositionType}
              positionType={positionType}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Dashboard;
