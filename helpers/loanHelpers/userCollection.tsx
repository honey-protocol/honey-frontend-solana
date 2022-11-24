import { RoundHalfDown, RoundHalfUp } from 'helpers/utils';
import { BURRITO_BOYZ_MARKET_ID, HONEY_GENESIS_MARKET_ID, HONEY_PROGRAM_ID, LIFINITY_FLARES_MARKET_ID, MAX_LTV, OG_ATADIANS_MARKET_ID, PESKY_PENGUINS_MARKET_ID } from '../../constants/loan';
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
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

import * as anchor from "@project-serum/anchor";
import { CollateralNFTPosition, getHealthStatus, getNFTAssociatedMetadata, HoneyClient, HoneyMarket, HoneyMarketReserveInfo, HoneyReserve, HoneyUser, LoanPosition, METADATA_PROGRAM_ID, NftPosition, ObligationAccount, ObligationPositionStruct, PositionInfoList, TReserve } from '@honey-finance/sdk';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { formatNumber } from '../../helpers/format';
import { generateMockHistoryData } from 'helpers/chartUtils';
import { MarketTableRow } from 'types/markets';
import { LIQUIDATION_THRESHOLD } from '../../constants/loan';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { 
  renderMarketName, 
  HONEY_GENESIS_BEE_MARKET_NAME,
  LIFINITY_FLARES_MARKET_NAME,
  OG_ATADIANS_MARKET_NAME,
  PESKY_PENGUINS_MARKET_NAME,
  BURRITO_BOYZ_MARKET_NAME,
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
export async function calculateUserDeposits(marketReserveInfo: any, honeyUser: any) {
  try {
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
    return totalDeposit;
  } else {
      return 0;
    } 
  } catch (error) {
    throw error;
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
          return marketDebt = (RoundHalfDown(sum));
        }
        return marketDebt
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
        parsedReserves[0].switchboardPriceAggregator
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
export async function getInterestRate(utilizationRate: number, marketId: string) {
  let interestRate = 0;

  try {
    if (utilizationRate < OPTIMAL_RATIO_ONE) {
      interestRate =
        BASE_BORROW_RATE +
        (utilizationRate / OPTIMAL_RATIO_ONE) *
          (BORROW_RATE_ONE - BASE_BORROW_RATE);
      console.log('@@-- interest rate 1', interestRate * 100);
      return interestRate * 100;
    } else if (utilizationRate > OPTIMAL_RATIO_ONE) {
      if (utilizationRate < OPTIMAL_RATIO_TWO) {
        interestRate =
          BASE_BORROW_RATE +
          BORROW_RATE_ONE +
          ((utilizationRate - OPTIMAL_RATIO_ONE) / (1 - OPTIMAL_RATIO_ONE)) *
            (BORROW_RATE_TWO - BASE_BORROW_RATE);
        console.log('@@-- interest rate 2', interestRate * 100);
        return interestRate * 100;
      } else {
        interestRate =
          BASE_BORROW_RATE +
          BORROW_RATE_TWO +
          ((utilizationRate - OPTIMAL_RATIO_TWO) / (1 - OPTIMAL_RATIO_TWO)) *
            (BORROW_RATE_THREE - BASE_BORROW_RATE);
        console.log('@@-- interest rate 3', interestRate * 100);
        return interestRate * 100;
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
    const from = new Date()
      .setFullYear(new Date().getFullYear() - 1)
      .valueOf();
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
const setObligations = async (obligations: any, currentMarketId: string, nftPrice: number) => {
  if (!obligations) return [];

  return obligations.map((obligation: any) => {
    return {
      name: renderMarketName(currentMarketId),
      riskLvl: (obligation.debt / nftPrice) * 100,
      healthLvl: ((nftPrice - obligation.debt / LIQUIDATION_THRESHOLD) / nftPrice) * 100,
      debt: obligation.debt,
      estimatedValue: nftPrice,
      nftMint: obligation.nft_mint,
      owner: obligation.owner,
      obligation: obligation.obligation,
      highestBid: obligation.highest_bid
    }
  }).filter((obl: any) => obl.debt !== 0);
}
/**
 * @description calculates the risk of a market
 * @params array of obligations | nft price | boolean: false will calculate the risk - true will calculate the total debt | market id | name of collection
 * @returns total debt of market if type is true, risk of market if type is false
*/
const calculateRisk = async (obligations: any, nftPrice: number, type: boolean, currentMarketId: string, collectionName: string) => {
  if (!obligations) return 0;

  if (currentMarketId === HONEY_GENESIS_MARKET_ID && collectionName === HONEY_GENESIS_BEE_MARKET_NAME) {
    let sumOfDebt = await obligations.reduce((acc: number, obligation: any) => {
      return acc + obligation.debt;
    }, 0);
  
    if (type === true) {
      return sumOfDebt;
    } else {
      return (sumOfDebt / obligations.length / nftPrice)
    }
  } else if (currentMarketId === PESKY_PENGUINS_MARKET_ID && collectionName === PESKY_PENGUINS_MARKET_NAME) {
     let sumOfDebt = await obligations.reduce((acc: number, obligation: any) => {
       return acc + obligation.debt;
     }, 0);
  
      if (type === true) {
       return sumOfDebt;
      } else {
       return (sumOfDebt / obligations.length / nftPrice)
      }
   } else if (currentMarketId === OG_ATADIANS_MARKET_ID && collectionName === OG_ATADIANS_MARKET_NAME) {
    let sumOfDebt = await obligations.reduce((acc: number, obligation: any) => {
      return acc + obligation.debt;
    }, 0);
 
     if (type === true) {
      return sumOfDebt;
     } else {
      return (sumOfDebt / obligations.length / nftPrice)
     }
  } else if (currentMarketId === LIFINITY_FLARES_MARKET_ID && collectionName === LIFINITY_FLARES_MARKET_NAME) {
    let sumOfDebt = await obligations.reduce((acc: number, obligation: any) => {
      return acc + obligation.debt;
    }, 0);
 
     if (type === true) {
      return sumOfDebt;
     } else {
      return (sumOfDebt / obligations.length / nftPrice)
     }
  } else if (currentMarketId === BURRITO_BOYZ_MARKET_ID && collectionName === BURRITO_BOYZ_MARKET_NAME) {
    let sumOfDebt = await obligations.reduce((acc: number, obligation: any) => {
      return acc + obligation.debt;
    }, 0);
 
     if (type === true) {
      return sumOfDebt;
     } else {
      return (sumOfDebt / obligations.length / nftPrice)
     }
  } else {
    return 0;
  }
}
/**
 * @description calculates the total value locked of a market
 * @params array of obligations | nft price | market id | collection name
 * @returns TVL
*/
const calculateTVL = async (obligations: any, nftPrice: number, currentMarketId: string, collectionName: string) => {
  if (!obligations) return 0;

  if (currentMarketId === HONEY_GENESIS_MARKET_ID && collectionName === HONEY_GENESIS_BEE_MARKET_NAME) {
    return nftPrice * obligations.length;
  } else if (currentMarketId === PESKY_PENGUINS_MARKET_ID && collectionName === PESKY_PENGUINS_MARKET_NAME) {
    return nftPrice * obligations.length;
  } else if (currentMarketId === OG_ATADIANS_MARKET_ID && collectionName === OG_ATADIANS_MARKET_NAME) {
    return nftPrice * obligations.length;
  } else if (currentMarketId === BURRITO_BOYZ_MARKET_ID && collectionName === BURRITO_BOYZ_MARKET_NAME) {
    return nftPrice * obligations.length;
  } else if (currentMarketId === LIFINITY_FLARES_MARKET_ID && collectionName === LIFINITY_FLARES_MARKET_NAME) {
    return nftPrice * obligations.length;
  }
}
/**
 * @description Being called for each collection in the array, calculates the collections values
 * @params collection | connection | wallet | market id | boolean (if request comes from liquidation page) | array of obligations
 * @returns collection object 
*/
export async function populateMarketData(collection: MarketTableRow, connection: Connection, wallet: ConnectedWallet | null, currentMarketId: string, liquidations: boolean, obligations?: any) {
  // create dummy keypair if no wallet is connected to fetch values of the collections regardless of connected wallet
  let dummyWallet = wallet ? wallet : new NodeWallet(new Keypair())
  // since we inject the market id at top level (app.tsx) we need to create a new provider, init new honeyClient and market, for each market
  const provider = new anchor.AnchorProvider(connection, dummyWallet, anchor.AnchorProvider.defaultOptions());
  const honeyClient = await HoneyClient.connect(provider, collection.id, false);
  const honeyMarket = await HoneyMarket.load(honeyClient, new PublicKey(collection.id));
  // init reserves
  const honeyReserves: HoneyReserve[] = honeyMarket.reserves.map(
    (reserve) => new HoneyReserve(honeyClient, honeyMarket, reserve.reserve),
  );

  //@ts-ignore
  const honeyUser = await HoneyUser.load(honeyClient, honeyMarket, dummyWallet, honeyReserves);
  const reserveInfoList = honeyMarket.reserves;

  let parsedReserve:TReserve | undefined = undefined;

  for (const reserve of reserveInfoList) {
    if (reserve.reserve.equals(PublicKey.default)) {
      continue;
    }

    const { data, state } = await HoneyReserve.decodeReserve(honeyClient, reserve.reserve);
    parsedReserve = data;
    break;
  }

  if(parsedReserve !== undefined) {
    let totalMarketDeposits = BnToDecimal(
      parsedReserve.reserveState.totalDeposits,
      9,
      2
    );
    // set values for total debt in collection
    const totalMarketDebt = RoundHalfDown(parsedReserve.reserveState.outstandingDebt.div(new BN(10 ** 15)).toNumber() / LAMPORTS_PER_SOL);
    const sumOfTotalValue = totalMarketDeposits + totalMarketDebt;
    // if request comes from liquidation page we need the collection object to be different 
    if (liquidations) {
      collection.name;
      collection.available = totalMarketDeposits;
      collection.value = sumOfTotalValue;
      collection.connection = connection;
      collection.utilizationRate = Number(f((totalMarketDebt) / (totalMarketDeposits + totalMarketDebt)));
      collection.user = honeyUser;
      collection.risk = obligations ? await calculateRisk(obligations.obligations, obligations.nftPrice, false, currentMarketId, collection.name) : 0;
      collection.totalDebt = sumOfTotalValue - totalMarketDeposits;
      collection.openPositions = obligations ? await setObligations(obligations.obligations, currentMarketId, obligations.nftPrice) : [];
      collection.tvl = obligations ? await calculateTVL(collection.openPositions, obligations.nftPrice, currentMarketId, collection.name) : 0;
      // if there are open positions in the collections, calculate until liquidation value
      if (collection.openPositions) {
        collection.openPositions.map((openPos: any) => {
          return openPos.untilLiquidation = openPos.estimatedValue - openPos.debt / LIQUIDATION_THRESHOLD;
        })
      }
    // request comes from borrow or lend - same base collection object
    } else {
      collection.available = totalMarketDeposits;
      collection.value = sumOfTotalValue;
      collection.connection = connection;
      collection.utilizationRate = Number(f((totalMarketDebt) / (totalMarketDeposits + totalMarketDebt)));
      collection.user = honeyUser;
      collection.name;
    }
    return collection;
  }
}
/**
 * @description NON Active func. - future work; can be used to fetch position bids via Front-end
 * @params devnet boolean | connection | wallet | honeyId | honeyReserves | honeyMarket | marketReserveInfo
 * @returns open positions in a collection and open bids on a collections NFT
*/
export const fetchPositionBids = async (devnet:boolean, connection: Connection, wallet: ConnectedWallet, honeyId: string, honeyReserves: HoneyReserve[], honeyMarket: HoneyMarket, marketReserveInfo: HoneyMarketReserveInfo[]) => {
  try {
    const resBids = await fetch(
      'https://honey-mainnet-api.herokuapp.com/bids',
      { mode: 'cors' },
    );
  
    if (resBids) {
      const arrBids = await resBids.json();
      console.log('result: bidding array', arrBids);

      const highestBid = Math.max.apply(
        Math,
        arrBids.map(function (o: any) {
          return o.bidLimit;
        }),
      );
      console.log('fetching positions...');
      const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
      const client: HoneyClient = await HoneyClient.connect(provider, honeyId, true);
      let arrPositions: NftPosition[] = [];
    
    
      const solPriceUsd = await getOraclePrice(devnet?'devnet': 'mainnet-beta', connection, honeyReserves[0].data?.switchboardPriceAggregator);
      const nftPriceUsd = await getOraclePrice(devnet?'devnet': 'mainnet-beta', connection, honeyMarket.nftSwitchboardPriceAggregator);
      const nftPrice = nftPriceUsd / solPriceUsd;
    
      let obligations = await honeyMarket.fetchObligations();
      if (obligations && marketReserveInfo) {
        await Promise.all(
          obligations.map(async (item) => {
            let nftMints: PublicKey[] = item.account.collateralNftMint;
    
            const parsePosition = (position: any) => {
              const pos: ObligationPositionStruct = {
                account: new PublicKey(position.account),
                amount: new BN(position.amount),
                side: position.side,
                reserveIndex: position.reserveIndex,
                _reserved: [],
              };
              return pos;
            };
    
            item.account.loans = PositionInfoList.decode(Buffer.from(item.account.loans as any as number[])).map(
              parsePosition,
            );
            await Promise.all(
              nftMints.map(async (nft) => {
                if (nft.toString() != '11111111111111111111111111111111') {
                  const totalDebt =
                    marketReserveInfo[0].loanNoteExchangeRate
                      .mul(item.account?.loans[0]?.amount)
                      .div(new BN(10 ** 15))
                      .div(new BN(10 ** 6)) //!!
                      .div(new BN(10 ** 5))
                      .toNumber() /
                    10 ** 4; //dividing lamport
                  let position: NftPosition = {
                    obligation: item.publicKey.toString(),
                    debt: totalDebt,
                    nft_mint: new PublicKey(nft),
                    owner: item.account.owner,
                    ltv: 40,
                    is_healthy: getHealthStatus(totalDebt, nftPrice),
                    highest_bid: highestBid,
                  };
                  arrPositions.push(position);
                }
              }),
            );
          }),
        );
        return { positions: arrPositions, bids: arrBids };
      }  
    } 
    
    else {
      console.log('THE RESULT @@ inside else')
      return [];
    }
  } catch (error) {
    console.log('THE RESULT @@ ERROR', error);
  }


};
/**
 * @description NON Active func. - future work; can be used to fetch collateral positions in the Front-end
 * @params connection | honeyUser
 * @returns collateral nft positions array | loanPositions array
*/
export const fetchBorrowPositions = async (connection: Connection, honeyUser: HoneyUser) => {

  const collateralNFTPositions: CollateralNFTPosition[] = [];
  const obligation = (await honeyUser.getObligationData()) as ObligationAccount;

  if (!obligation.market) {
    return [];
    throw Error('Obligation does not have a valid market');
  }

  const collateralNftMint: PublicKey[] = obligation.collateralNftMint;
  
  if (!collateralNftMint || collateralNftMint.length === 0) {
    throw Error('Obligation does not have a valid collateral nft mint');
  }
  const promises = collateralNftMint.map(async (key: PublicKey, index: number) => {
    if (!key.equals(PublicKey.default)) {
      const [nftMetadata, metadataBump] = await PublicKey.findProgramAddress(
        [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), key.toBuffer()],
        METADATA_PROGRAM_ID,
      );
      const data = await getNFTAssociatedMetadata(connection, nftMetadata);
      if (!data) return;
      const tokenMetadata = new Metadata(nftMetadata, data);
      const arweaveData = await (await fetch(tokenMetadata.data.data.uri)).json();
      collateralNFTPositions.push({
        mint: new PublicKey(tokenMetadata?.data?.mint),
        updateAuthority: new PublicKey(tokenMetadata?.data?.updateAuthority),
        name: tokenMetadata?.data?.data?.name,
        symbol: tokenMetadata?.data?.data.symbol,
        uri: tokenMetadata?.data?.data.uri,
        image: arweaveData?.image,
      });
    }
  });

  await Promise.all(promises);

  // build outstanding loans in market
  const loanPositions: LoanPosition[] = [];

  obligation.loans.map((loan: any) => {
    if (loan.account.equals(PublicKey.default)) return;
    loanPositions.push({
      amount: loan.amount.toNumber() / 10 ** 15,
      tokenAccount: loan.account,
    });
  });

  return { collateralNFTPositions, loanPositions };
};
