import { RoundHalfDown, RoundHalfUp } from 'helpers/utils';
import { MAX_LTV } from '../../constants/loan';
import BN from 'bn.js';
import { getOraclePrice } from '../../helpers/loanHelpers/index';
import {
  OPTIMAL_RATIO_ONE,
  OPTIMAL_RATIO_TWO,
  MAX_UTILISATION_RATIO,
  BASE_BORROW_RATE,
  DISCOUNTED_BORROW_RATE,
  BORROW_RATE_ONE,
  BORROW_RATE_TWO,
  BORROW_RATE_THREE
} from '../../constants/interestRate';
import { network } from 'pages/_app';
import { ConnectedWallet } from '@saberhq/use-solana';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
} from '@solana/web3.js';

import * as anchor from '@project-serum/anchor';
import {
  CollateralNFTPosition,
  getHealthStatus,
  getNFTAssociatedMetadata,
  HoneyClient,
  HoneyMarket,
  HoneyReserve,
  HoneyUser,
  LoanPosition,
  METADATA_PROGRAM_ID,
  NftPosition,
  ObligationAccount,
  ObligationPositionStruct,
  PositionInfoList,
  TReserve,
  borrowAndRefresh,
  depositNFT,
  repayAndRefresh,
  useBorrowPositions,
  useHoney,
  useMarket,
  fetchAllMarkets,
  MarketBundle,
  waitForConfirmation,
  withdrawNFT,
  fetchReservePrice,
  ReserveConfigStruct,
  MarketAccount,
  CachedReserveInfo
} from '@honey-finance/sdk';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { formatNumber } from '../../helpers/format';
import { generateMockHistoryData } from 'helpers/chartUtils';
import { MarketTableRow } from 'types/markets';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import {
  renderMarketName,
  marketCollections,
  COLLATERAL_FACTOR,
  HONEY_GENESIS_MARKET_ID
} from 'helpers/marketHelpers';
import { toast } from 'react-toastify';

/**
 * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
 * @params value to be formatted
 * @returns requested format
 */
const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;

export async function fetchLTV(totalMarketDebt: number, nftPrice: number) {
  if (nftPrice === 0) return 0;
  return totalMarketDebt / nftPrice;
}

// filters out zero debt obligations and multiplies outstanding obl. by nft price
export async function fetchTVL(obligations: any) {
  if (!obligations.length) return 0;
  return obligations.filter((obl: any) => obl.debt !== 0).length;
}

/**
 * @description calculates the nft price based on switchboard
 * @params marketreserve | parsedreserve | honeymarket | connection
 * @returns nft price usd / sol
 */
export async function calcNFT(
  marketReserveInfo: any,
  parsedReserves: any,
  honeyMarket: any,
  connection: any
) {
  try {
    if (marketReserveInfo && parsedReserves && honeyMarket) {
      let solPrice = await getOraclePrice(
        'mainnet-beta',
        connection,
        parsedReserves.switchboardPriceAggregator
      ); //in sol
      let nftPrice = await getOraclePrice(
        'mainnet-beta',
        connection,
        honeyMarket.nftSwitchboardPriceAggregator
      ); //in usd

      return Number(nftPrice / solPrice);
    }
  } catch (error) {
    console.log('An error occurred', error);
    return 0;
  }
}

/**
 * @description pollutes the chart on lend with dummy historic rates
 * @params none
 * @returns chart data
 */
const getPositionData = () => {
  const isMock = true;

  if (isMock) {
    const from = new Date().setFullYear(new Date().getFullYear() - 1).valueOf();
    const to = new Date().valueOf();
    return generateMockHistoryData(from, to);
  }
  return [];
};
/**
 * @description fetches the sol price from switchboard
 * @params marketreserve | parsedreserve | honeymarket | connection
 * @returns the current sol price
 */
export async function fetchSolPrice(parsedReserves: any, connection: any) {
  if (parsedReserves && connection) {
    try {
      let solPrice = await getOraclePrice(
        network === 'devnet' ? 'devnet' : 'mainnet-beta',
        connection,
        parsedReserves[0].switchboardPriceAggregator
      );
      return solPrice;
    } catch (error) {
      throw error;
    }
  }
}
/**
 * @description sets the obligations for the liquidation page of a collection and filters out obligations with zero debt
 * @params obligations array, currentmarketid. nft
 * @returns chart data
 */
const setObligations = async (
  obligations: any,
  currentMarketId: string,
  nftPrice: number
) => {
  if (!obligations) return [];

  return obligations
    .map((obligation: any) => {
      return {
        name: renderMarketName(currentMarketId),
        riskLvl: (obligation.debt / nftPrice) * 100,
        healthLvl:
          ((nftPrice - obligation.debt / COLLATERAL_FACTOR) / nftPrice) * 100,
        debt: obligation.debt,
        estimatedValue: nftPrice,
        nftMint: obligation.nft_mint,
        owner: obligation.owner,
        obligation: obligation.obligation,
        highestBid: obligation.highest_bid
      };
    })
    .filter((obl: any) => obl.debt.toString() != 0);
};
/**
 * @description calculates the risk of a market
 * @params array of obligations | nft price | boolean: false will calculate the risk - true will calculate the total debt | market id | name of collection
 * @returns total debt of market if type is true, risk of market if type is false
 */
const calculateRisk = async (
  obligations: any,
  nftPrice: number,
  type: boolean,
  collection: string
) => {
  if (!obligations) return 0;
  let filtered = await obligations.filter(
    (obl: any) => obl.debt.toString() != 0
  );

  let sumOfDebt = await filtered.reduce((acc: number, obligation: any) => {
    return (acc += obligation.debt);
  }, 0);

  if (type === true) {
    return sumOfDebt;
  } else {
    const sum = (sumOfDebt / filtered.length / nftPrice) * 100;
    return sum;
  }
};

async function configureCollectionObjecet(
  origin: String,
  collection: any,
  dataObject: {
    allowance: any;
    userDebt: any;
    ltv: any;
    tvl: BN;
    totalMarketDeposits: any;
    totalMarketValue: any;
    connection: any;
    honeyUser: HoneyUser;
    nftPrice: any;
    obligations: any;
    totalMarketDebt: any;
    currentMarketId: string;
    utilization: any;
    interestRate: any;
    userTotalDeposits: any;
  }
) {
  const {
    allowance,
    userDebt,
    ltv,
    tvl,
    totalMarketDeposits,
    totalMarketValue,
    connection,
    honeyUser,
    nftPrice,
    obligations,
    totalMarketDebt,
    currentMarketId,
    utilization,
    interestRate,
    userTotalDeposits
  } = dataObject;

  switch (origin) {
    case 'LIQUIDATIONS':
      collection.name;
      collection.allowance = allowance;
      collection.userDebt = userDebt.toString();
      collection.available = totalMarketDeposits;
      collection.value = totalMarketValue;
      collection.connection = connection;
      collection.user = honeyUser;
      collection.nftPrice = nftPrice;
      collection.ltv = ltv;
      collection.tvl = tvl;
      collection.totalDebt = totalMarketDebt;

      collection.utilizationRate =
        honeyUser.market.reserveList[0].config.utilizationRate1;

      collection.risk = obligations.length
        ? await calculateRisk(
            obligations,
            collection.nftPrice,
            false,
            collection
          )
        : 0;

      collection.openPositions = obligations
        ? await setObligations(
            obligations,
            currentMarketId,
            collection.nftPrice
          )
        : [];

      // if there are open positions in the collections, calculate until liquidation value
      if (collection.openPositions) {
        collection.openPositions.map((openPos: any) => {
          return (openPos.untilLiquidation =
            // TODO: use collateral factor from SDK config object
            openPos.estimatedValue - openPos.debt / COLLATERAL_FACTOR);
        });
      }
      return collection;
    case 'BORROW':
      collection.allowance = allowance;
      collection.userDebt = userDebt.toString();
      collection.ltv = ltv.toString();
      collection.available = totalMarketDeposits;
      collection.value = totalMarketValue;
      collection.connection = connection;
      collection.nftPrice = nftPrice;
      collection.rate = interestRate * 100;
      collection.user = honeyUser;
      // collection.name;
      collection.utilizationRate =
        honeyUser.market.reserveList[0].config.utilizationRate1;
      return collection;
    case 'LEND':
      collection.allowance = allowance;
      collection.userDebt = userDebt.toString();
      collection.ltv = ltv.toString();
      collection.available = totalMarketDeposits;
      collection.value = totalMarketValue;
      collection.connection = connection;
      collection.nftPrice = nftPrice;
      collection.userTotalDeposits = userTotalDeposits.toString();
      // TODO: fix util rate based off object coming in
      collection.utilizationRate = utilization;
      collection.rate = interestRate * 100 * utilization;
      collection.user = honeyUser;
      collection.name;
      return collection;
  }
}

async function handleFormatMarket(
  origin: string,
  collection: any,
  currentMarketId: string,
  liquidations: boolean,
  obligations: any,
  honeyUser: HoneyUser,
  honeyClient: HoneyClient,
  honeyMarket: HoneyMarket,
  connection: Connection,
  parsedReserves: TReserve,
  mData?: any
) {
  const totalMarketDebt = mData
    ? await mData.getReserveState().outstandingDebt
    : 0;

  const totalMarketDeposits = mData
    ? await mData.getReserveState().totalDeposits
    : 0;

  const { utilization, interestRate } =
    await collection.marketData[0].reserves[0].getUtilizationAndInterestRate();

  const totalMarketValue = totalMarketDeposits + totalMarketDebt;

  const nftPrice = await honeyMarket.fetchNFTFloorPriceInReserve(0);
  collection.nftPrice = nftPrice;

  const allowanceAndDebt = await honeyUser.fetchAllowanceAndDebt(
    0,
    'mainnet-beta'
  );

  const tvl = new BN(nftPrice * (await fetchTVL(obligations)));
  const userTotalDeposits = await honeyUser.fetchUserDeposits(0);

  return await configureCollectionObjecet(origin, collection, {
    allowance: allowanceAndDebt.allowance,
    userDebt: allowanceAndDebt.debt,
    ltv: allowanceAndDebt.ltv.toString(),
    tvl,
    totalMarketDeposits,
    totalMarketValue,
    connection,
    honeyUser,
    nftPrice,
    obligations,
    totalMarketDebt,
    currentMarketId,
    utilization,
    interestRate,
    userTotalDeposits
  });
}

/**
 * @description Being called for each collection in the array, calculates the collections values
 * @params collection | connection | wallet | market id | boolean (if request comes from liquidation page) | array of obligations
 * @returns collection object
 */
export async function populateMarketData(
  origin: string,
  collection: MarketTableRow,
  connection: Connection,
  wallet: ConnectedWallet | null,
  currentMarketId: string,
  liquidations: boolean,
  obligations: any,
  hasMarketData: boolean,
  honeyClient?: HoneyClient,
  honeyMarket?: HoneyMarket,
  honeyUser?: HoneyUser,
  parsedReserves?: TReserve,
  mData?: any
) {
  // create dummy keypair if no wallet is connected to fetch values of the collections regardless of connected wallet
  let dummyWallet = wallet ? wallet : new NodeWallet(new Keypair());

  if (
    hasMarketData &&
    honeyClient &&
    honeyMarket &&
    honeyUser &&
    parsedReserves
  ) {
    return await handleFormatMarket(
      origin,
      collection,
      currentMarketId,
      liquidations,
      obligations,
      honeyUser,
      honeyClient,
      honeyMarket,
      connection,
      parsedReserves,
      mData
    );
  } else {
    return collection;
  }
}
