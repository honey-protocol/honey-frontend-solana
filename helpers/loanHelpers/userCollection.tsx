import { RoundHalfDown, RoundHalfUp } from 'helpers/utils';
import { MAX_LTV } from '../../constants/loan';
import BN from 'bn.js';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BnToDecimal, getOraclePrice } from '../../helpers/loanHelpers/index';
import {
  OPTIMAL_RATIO_ONE,
  OPTIMAL_RATIO_TWO,
  BASE_BORROW_RATE,
  BORROW_RATE_ONE,
  BORROW_RATE_TWO,
  BORROW_RATE_THREE
} from '../../constants/interestRate'
import { Market } from 'constants/borrowLendMarkets';
import { ConnectedWallet } from '@saberhq/use-solana';

import * as anchor from "@project-serum/anchor";
import { HoneyClient, HoneyMarket, HoneyReserve, TReserve } from '@honey-finance/sdk';

/**
 * @description calculates the total user debt, ltv and allowance over all collections
 * @params nftprice | collateralnftpositions | honeyuser (connected via wallet) | marketreserveinfo
 * @returns sum of allowance | sum of ltv | sum of debt
 */
export async function calculateCollectionwideAllowance(
  nftPrice: any,
  collateralNFTPositions: any,
  honeyUser: any,
  marketReserveInfo: any
) {
  let totalDebt = 0;
  let userLoans = 0;
  let nftCollateralValue = nftPrice * (collateralNFTPositions?.length || 0);

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
  if (marketReserveInfo && parsedReserves && honeyMarket) {
    let solPrice = await getOraclePrice(
      'mainnet-beta',
      connection,
      parsedReserves[0].switchboardPriceAggregator
    ); //in sol
    let nftPrice = await getOraclePrice(
      'mainnet-beta',
      connection,
      honeyMarket.nftSwitchboardPriceAggregator
    ); //in usd

    return nftPrice / solPrice;
  }
}

/**
 * @description fetches the sol price from switchboard
 * @params marketreserve | parsedreserve | honeymarket | connection
 * @returns the current sol price
 */
 export async function fetchSolPrice(
  parsedReserves: any,
  connection: any
) {
  if (parsedReserves && connection) {
    try {
      let solPrice = await getOraclePrice(
        // when in devnet uncomment the below
        // 'devnet',
        'mainnet-beta',
        connection,
        parsedReserves[0].switchboardPriceAggregator
      );
      console.log(`Solprice: ${solPrice}`)
      return solPrice; 
    } catch (error) {
      return `An error occurred: ${error}`
    }
  }
}

export async function getInterestRate(utilizationRate: number) {
  let interestRate = 0;

  try {
    if (utilizationRate < OPTIMAL_RATIO_ONE) {
      interestRate = BASE_BORROW_RATE + (utilizationRate / OPTIMAL_RATIO_ONE) * (BORROW_RATE_ONE - BASE_BORROW_RATE);
      console.log('@@-- interest rate 1', interestRate * 100)
      return (interestRate * 100);
    } else if (utilizationRate > OPTIMAL_RATIO_ONE) {
        if (utilizationRate < OPTIMAL_RATIO_TWO) {
          interestRate = BASE_BORROW_RATE + BORROW_RATE_ONE + ((utilizationRate - OPTIMAL_RATIO_ONE) / (1 - OPTIMAL_RATIO_ONE)) * (BORROW_RATE_TWO - BASE_BORROW_RATE);
          console.log('@@-- interest rate 2', (interestRate * 100))
          return (interestRate * 100);
        } else {
          interestRate = BASE_BORROW_RATE + BORROW_RATE_TWO + ((utilizationRate - OPTIMAL_RATIO_TWO) / (1 - OPTIMAL_RATIO_TWO)) * (BORROW_RATE_THREE - BASE_BORROW_RATE);
          console.log('@@-- interest rate 3', (interestRate * 100))
          return (interestRate * 100);
      }
    } 
  } catch (error) {
    console.log('Error:', error)
  }
}

export async function populateMarketData(collection: Market, connection: Connection, wallet: ConnectedWallet) {
  const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
  const honeyClient = await HoneyClient.connect(provider, collection.id, false);
  const honeyMarket = await HoneyMarket.load(honeyClient, new PublicKey(collection.id));
  const reserveInfoList = honeyMarket.reserves;
  let parsedReserve:TReserve | undefined = undefined;

  for (const reserve of reserveInfoList) {
    if (reserve.reserve.equals(PublicKey.default)) {
      continue;
    }
    console.log('@@--::reserve', reserve.reserve.toString());

    const { data, state } = await HoneyReserve.decodeReserve(honeyClient, reserve.reserve);
    parsedReserve = data;
    console.log('@@--::parsed reserve', parsedReserve);
    break;
  }

  if(parsedReserve !== undefined) {
    let totalMarketDeposits = BnToDecimal(
      parsedReserve.reserveState.totalDeposits,
      9,
      2
    );
    console.log('@@--::total market deposits', totalMarketDeposits);
    const totalMarketDebt = RoundHalfDown(parsedReserve.reserveState.outstandingDebt.div(new BN(10 ** 15))
      .toNumber() / LAMPORTS_PER_SOL);
    console.log('@@--::total market debt', totalMarketDebt);
    const sumOfTotalValue = totalMarketDeposits + totalMarketDebt;
    collection.available = totalMarketDeposits;
    collection.value = sumOfTotalValue;
  }
}