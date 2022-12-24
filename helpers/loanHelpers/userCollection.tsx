import { RoundHalfDown, RoundHalfUp } from 'helpers/utils';
import { MAX_LTV } from '../../constants/loan';
import BN from 'bn.js';
import { BnToDecimal, getOraclePrice } from '../../helpers/loanHelpers/index';
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
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

import * as anchor from '@project-serum/anchor';
import {
  CollateralNFTPosition,
  getHealthStatus,
  getNFTAssociatedMetadata,
  HoneyClient,
  HoneyMarket,
  HoneyMarketReserveInfo,
  HoneyReserve,
  HoneyUser,
  LoanPosition,
  METADATA_PROGRAM_ID,
  NftPosition,
  ObligationAccount,
  ObligationPositionStruct,
  PositionInfoList,
  TReserve
} from '@honey-finance/sdk';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { formatNumber } from '../../helpers/format';
import { generateMockHistoryData } from 'helpers/chartUtils';
import { MarketTableRow } from 'types/markets';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import {
  renderMarketName,
  marketCollections,
  COLLATERAL_FACTOR
} from 'helpers/marketHelpers';

/**
 * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
 * @params value to be formatted
 * @returns requested format
 */
const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;

/**
 * @description calculates the users total deposits
 * @params  marketReserveInfo and honeyUser
 * @returns users total deposits in market
 */
// TODO: create types for marketReserve and honeyUser
export async function calculateUserDeposits(
  marketReserveInfo: any,
  honeyUser: any
) {
  if (!marketReserveInfo || !honeyUser) {
    return;
  }

  let depositNoteExchangeRate = BnToDecimal(
    marketReserveInfo[0].depositNoteExchangeRate,
    15,
    5
  );
  let loanNoteExchangeRate = 0;
  let nftPrice = 2;
  let cRatio = 1;

  let depositValue = (await honeyUser.deposits().length) > 0;

  if (depositValue == false) {
    return 0;
  } else {
    let totalDeposits =
      (honeyUser
        .deposits()[0]
        .amount.div(new BN(10 ** 5))
        .toNumber() *
        depositNoteExchangeRate) /
      10 ** 4;

    return totalDeposits;
  }
}

/**
 * @description calculates the market debt
 * @params honey reserves
 * @returns market debt
 */
// TODO: create types for honeyReserves
export async function calculateMarketDebt(honeyReserves: any) {
  try {
    const depositTokenMint = new PublicKey(
      'So11111111111111111111111111111111111111112'
    );

    if (honeyReserves) {
      const depositReserve = honeyReserves.filter((reserve: any) =>
        reserve?.data?.tokenMint?.equals(depositTokenMint)
      )[0];

      const reserveState = depositReserve.data?.reserveState;

      if (reserveState?.outstandingDebt) {
        let marketDebt = reserveState?.outstandingDebt
          .div(new BN(10 ** 15))
          .toNumber();
        if (marketDebt) {
          let sum = Number(marketDebt / LAMPORTS_PER_SOL);
          return (marketDebt = RoundHalfDown(sum));
        }
        return marketDebt;
      }
    } else {
      return 0;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * @description calculates the total user debt, ltv and allowance over all collections
 * @params nftprice | collateralnftpositions | honeyuser (connected via wallet) | marketreserveinfo
 * @returns sum of allowance | sum of ltv | sum of debt
 */
export async function fetchAllowanceLtvAndDebt(
  nftPrice: any,
  collateralNFTPositions: any,
  honeyUser: any,
  marketReserveInfo: any
) {
  try {
    // if (!collateralNFTPositions.length) return;

    let totalDebt = 0;
    let userLoans = 0;
    // let nftCollateralValue = nftPrice * collateralNFTPositions?.length;
    let nftCollateralValue = nftPrice * collateralNFTPositions;

    if (honeyUser?.loans().length > 0) {
      if (honeyUser?.loans().length > 0 && marketReserveInfo) {
        userLoans =
          (marketReserveInfo[0].loanNoteExchangeRate
            .mul(honeyUser?.loans()[0]?.amount)
            .div(new BN(10 ** 15))
            .toNumber() *
            1.002) /
          LAMPORTS_PER_SOL;
        totalDebt =
          marketReserveInfo[0].loanNoteExchangeRate
            .mul(honeyUser?.loans()[0]?.amount)
            .div(new BN(10 ** 15))
            .toNumber() / LAMPORTS_PER_SOL;
      }
    }

    const ltv = totalDebt / nftPrice;

    let sumOfAllowance = RoundHalfDown(
      nftCollateralValue * MAX_LTV - userLoans,
      4
    );

    let sumOfLtv = RoundHalfDown(ltv);
    let sumOfTotalDebt = RoundHalfUp(totalDebt);

    return {
      sumOfAllowance,
      sumOfLtv,
      sumOfTotalDebt
    };
  } catch (error) {
    throw error;
  }
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

      return nftPrice / solPrice;
    }
  } catch (error) {
    throw error;
  }
}
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
 * @description sets the interest rate based on Honey formula
 * @params utilization ratio
 * @returns interest rate for market
 */
export async function getInterestRate(
  utilizationRate: number,
  marketId: string
) {
  let interestRate = 0;

  try {
    const activeMarket = marketCollections.filter(
      market => market.constants.marketId === marketId
    );
    if (activeMarket[0].constants.discountedMarket === true) {
      if (utilizationRate < OPTIMAL_RATIO_ONE) {
        interestRate =
          DISCOUNTED_BORROW_RATE +
          (utilizationRate / OPTIMAL_RATIO_ONE) *
            (BORROW_RATE_ONE - DISCOUNTED_BORROW_RATE);
        return interestRate * 100;
      } else if (utilizationRate >= OPTIMAL_RATIO_ONE) {
        if (utilizationRate < OPTIMAL_RATIO_TWO) {
          interestRate =
            DISCOUNTED_BORROW_RATE +
            BORROW_RATE_ONE +
            ((utilizationRate - OPTIMAL_RATIO_ONE) / (1 - OPTIMAL_RATIO_ONE)) *
              (BORROW_RATE_TWO - DISCOUNTED_BORROW_RATE);
          return interestRate * 100;
        } else {
          interestRate =
            DISCOUNTED_BORROW_RATE +
            BORROW_RATE_TWO +
            ((utilizationRate - OPTIMAL_RATIO_TWO) / (1 - OPTIMAL_RATIO_TWO)) *
              (BORROW_RATE_THREE - DISCOUNTED_BORROW_RATE);
          return interestRate * 100;
        }
      }
    } else {
      if (utilizationRate < OPTIMAL_RATIO_ONE) {
        interestRate =
          BASE_BORROW_RATE +
          (utilizationRate / OPTIMAL_RATIO_ONE) *
            (BORROW_RATE_ONE - BASE_BORROW_RATE);
        return interestRate * 100;
      } else if (utilizationRate >= OPTIMAL_RATIO_ONE) {
        if (utilizationRate < OPTIMAL_RATIO_TWO) {
          interestRate =
            BASE_BORROW_RATE +
            BORROW_RATE_ONE +
            ((utilizationRate - OPTIMAL_RATIO_ONE) / (1 - OPTIMAL_RATIO_ONE)) *
              (BORROW_RATE_TWO - BASE_BORROW_RATE);
          return interestRate * 100;
        } else {
          interestRate =
            BASE_BORROW_RATE +
            BORROW_RATE_TWO +
            ((utilizationRate - OPTIMAL_RATIO_TWO) / (1 - OPTIMAL_RATIO_TWO)) *
              (BORROW_RATE_THREE - BASE_BORROW_RATE);
          return interestRate * 100;
        }
      }
    }
  } catch (error) {
    throw error;
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
    .filter((obl: any) => obl.debt !== 0);
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
  let sumOfDebt = await obligations.reduce((acc: number, obligation: any) => {
    return acc + obligation.debt;
  }, 0);

  if (type === true) {
    return sumOfDebt;
  } else {
    return sumOfDebt / obligations.length / nftPrice;
  }
};
/**
 * @description calculates the debt of all the obligations
 * @params obligation array
 * @returns debt of market of all obligations
 */
async function calculateTotalDebt(obligations: any) {
  if (obligations.length) {
    const sumOfMarketDebt = await obligations.reduce(
      (acc: number, obl: any) => {
        return acc + obl.debt;
      },
      0
    );
    return sumOfMarketDebt;
  }
}

async function handleFormatMarket(
  collection: any,
  currentMarketId: string,
  liquidations: boolean,
  obligations: any,
  honeyUser: HoneyUser,
  honeyClient: HoneyClient,
  honeyMarket: HoneyMarket,
  connection: Connection,
  parsedReserves?: any
) {
  const reserveInfoList = honeyMarket.reserves;

  let parsedReserve: TReserve | undefined = parsedReserves;

  for (const reserve of reserveInfoList) {
    if (reserve.reserve.equals(PublicKey.default)) {
      continue;
    }

    const { data, state } = await HoneyReserve.decodeReserve(
      honeyClient,
      reserve.reserve
    );
    parsedReserve = data;
    break;
  }

  if (parsedReserve !== undefined) {
    let totalMarketDeposits = BnToDecimal(
      parsedReserve.reserveState.totalDeposits,
      9,
      2
    );
    // set values for total debt in collection
    const totalMarketDebt = RoundHalfDown(
      parsedReserve.reserveState.outstandingDebt
        .div(new BN(10 ** 15))
        .toNumber() / LAMPORTS_PER_SOL
    );
    const sumOfTotalValue = totalMarketDeposits + totalMarketDebt;
    const nftPrice = await calcNFT(
      honeyMarket.reserves,
      parsedReserve,
      honeyMarket,
      connection
    );
    const calculateAllowanceAndLTV = await fetchAllowanceLtvAndDebt(
      nftPrice,
      1,
      honeyUser,
      honeyMarket.reserves
    );

    // if request comes from liquidation page we need the collection object to be different
    if (liquidations) {
      collection.name;
      collection.allowance = calculateAllowanceAndLTV?.sumOfAllowance;
      collection.ltv = calculateAllowanceAndLTV?.sumOfLtv;
      collection.userDebt = calculateAllowanceAndLTV?.sumOfTotalDebt;

      collection.available = totalMarketDeposits;
      collection.value = sumOfTotalValue;
      collection.connection = connection;
      collection.utilizationRate = Number(
        f(totalMarketDebt / (totalMarketDeposits + totalMarketDebt))
      );
      collection.user = honeyUser;
      collection.nftPrice = nftPrice;

      collection.risk = obligations
        ? await calculateRisk(
            obligations,
            collection.nftPrice,
            false,
            collection
          )
        : 0;
      collection.totalDebt = obligations
        ? await calculateTotalDebt(obligations)
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
            openPos.estimatedValue - openPos.debt / COLLATERAL_FACTOR);
        });
      }

      // request comes from borrow or lend - same base collection object
    } else {
      collection.allowance = calculateAllowanceAndLTV?.sumOfAllowance;
      collection.ltv = calculateAllowanceAndLTV?.sumOfLtv;
      collection.userDebt = calculateAllowanceAndLTV?.sumOfTotalDebt;

      collection.available = totalMarketDeposits;
      collection.value = sumOfTotalValue;
      collection.connection = connection;
      collection.nftPrice = await calcNFT(
        honeyMarket.reserves,
        parsedReserve,
        honeyMarket,
        connection
      );
      collection.utilizationRate = Number(
        f(totalMarketDebt / (totalMarketDeposits + totalMarketDebt))
      );
      collection.user = honeyUser;
      collection.name;
    }
    return collection;
  }
}

/**
 * @description Being called for each collection in the array, calculates the collections values
 * @params collection | connection | wallet | market id | boolean (if request comes from liquidation page) | array of obligations
 * @returns collection object
 */
export async function populateMarketData(
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
  parsedReserves?: any
) {
  // create dummy keypair if no wallet is connected to fetch values of the collections regardless of connected wallet
  let dummyWallet = wallet ? wallet : new NodeWallet(new Keypair());
  // since we inject the market id at top level (app.tsx) we need to create a new provider, init new honeyClient and market, for each market

  if (hasMarketData && honeyClient && honeyMarket && honeyUser) {
    return await handleFormatMarket(
      collection,
      currentMarketId,
      liquidations,
      obligations,
      honeyUser,
      honeyClient,
      honeyMarket,
      connection,
      parsedReserves
    );
  } else {
    const provider = new anchor.AnchorProvider(
      connection,
      dummyWallet,
      anchor.AnchorProvider.defaultOptions()
    );

    const honeyClient = await HoneyClient.connect(
      provider,
      collection.id,
      false
    );
    const honeyMarket = await HoneyMarket.load(
      honeyClient,
      new PublicKey(collection.id)
    );
    // init reserves
    const honeyReserves: HoneyReserve[] = honeyMarket.reserves.map(
      reserve => new HoneyReserve(honeyClient, honeyMarket, reserve.reserve)
    );

    const honeyUser = await HoneyUser.load(
      honeyClient,
      honeyMarket,
      // @ts-ignore
      dummyWallet,
      honeyReserves
    );

    return await handleFormatMarket(
      collection,
      currentMarketId,
      liquidations,
      obligations,
      honeyUser,
      honeyClient,
      honeyMarket,
      connection
    );
  }
}
