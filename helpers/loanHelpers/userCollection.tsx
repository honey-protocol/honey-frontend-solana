import { RoundHalfDown, RoundHalfUp } from 'helpers/utils';
import { HONEY_GENESIS_MARKET_ID, MAX_LTV } from '../../constants/loan';
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
} from '../../constants/interestRate';
import { ConnectedWallet } from '@saberhq/use-solana';

import * as anchor from "@project-serum/anchor";
import { CollateralNFTPosition, getHealthStatus, getNFTAssociatedMetadata, HoneyClient, HoneyMarket, HoneyMarketReserveInfo, HoneyReserve, HoneyUser, LoanPosition, METADATA_PROGRAM_ID, NftPosition, ObligationAccount, ObligationPositionStruct, PositionInfoList, TReserve } from '@honey-finance/sdk';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { formatNumber } from '../../helpers/format';
import { generateMockHistoryData } from 'helpers/chartUtils';
import { MarketTableRow } from 'types/markets';

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
    // let totalDeposit = BnDivided(honeyUser.deposits()[0].amount, 10, 5) * depositNoteExchangeRate / (10 ** 4)
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
export async function calculateCollectionwideAllowance(
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
      throw error;
    }
  }
}
/**
 * @description sets the interest rate based on Honey formula
 * @params utilization ratio
 * @returns interest rate for market
 */
export async function getInterestRate(utilizationRate: number) {
  let interestRate = 0;

  try {
    if (utilizationRate < OPTIMAL_RATIO_ONE) {
      interestRate = BASE_BORROW_RATE + (utilizationRate / OPTIMAL_RATIO_ONE) * (BORROW_RATE_ONE - BASE_BORROW_RATE);
      return (interestRate * 100);
    } else if (utilizationRate > OPTIMAL_RATIO_ONE) {
        if (utilizationRate < OPTIMAL_RATIO_TWO) {
          interestRate = BASE_BORROW_RATE + BORROW_RATE_ONE + ((utilizationRate - OPTIMAL_RATIO_ONE) / (1 - OPTIMAL_RATIO_ONE)) * (BORROW_RATE_TWO - BASE_BORROW_RATE);
          return (interestRate * 100);
        } else {
          interestRate = BASE_BORROW_RATE + BORROW_RATE_TWO + ((utilizationRate - OPTIMAL_RATIO_TWO) / (1 - OPTIMAL_RATIO_TWO)) * (BORROW_RATE_THREE - BASE_BORROW_RATE);
          return (interestRate * 100);
      }
    } 
  } catch (error) {
    throw error;
  }
}

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

export async function populateMarketData(collection: MarketTableRow, connection: Connection, wallet: ConnectedWallet, currentMarketId: string, liquidations: boolean) {
  if(wallet == null)
    return;
  
  const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
  const honeyClient = await HoneyClient.connect(provider, collection.id, false);
  const honeyMarket = await HoneyMarket.load(honeyClient, new PublicKey(collection.id));

  const honeyReserves: HoneyReserve[] = honeyMarket.reserves.map(
    (reserve) => new HoneyReserve(honeyClient, honeyMarket, reserve.reserve),
  );
  
  const honeyUser = await HoneyUser.load(honeyClient, honeyMarket, wallet.publicKey, honeyReserves);
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

    const totalMarketDebt = RoundHalfDown(parsedReserve.reserveState.outstandingDebt.div(new BN(10 ** 15)).toNumber() / LAMPORTS_PER_SOL);
    const sumOfTotalValue = totalMarketDeposits + totalMarketDebt;

    collection.available = totalMarketDeposits;
    collection.value = sumOfTotalValue;
    collection.connection = connection;
    collection.utilizationRate = Number(f((totalMarketDebt) / (totalMarketDeposits + totalMarketDebt)));
    collection.user = honeyUser;
    collection.name;

    return collection;
  }
}

export const fetchPositionBids = async (devnet:boolean, connection: Connection, wallet: ConnectedWallet, honeyId: string, honeyReserves: HoneyReserve[], honeyMarket: HoneyMarket, marketReserveInfo: HoneyMarketReserveInfo[]) => {
  console.log('fetching bids...');
  const resBids = await fetch(
    devnet?'https://honey-nft-api.herokuapp.com/bids': 'https://honey-mainnet-api.herokuapp.com/bids',
    // 'http://localhost:3001/bids',
    { mode: 'cors' },
  );
  const arrBids = await resBids.json();
  // const parsedBids = arrBids.map((str) => JSON.parse(str));

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


};

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
