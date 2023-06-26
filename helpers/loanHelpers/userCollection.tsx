import { getOraclePrice } from '../../helpers/loanHelpers/index';
import { network } from 'pages/_app';
import { formatNumber } from '../../helpers/format';
import { MarketTableRow } from 'types/markets';
import {
  renderMarketName,
  COLLATERAL_FACTOR,
  LOAN_CURRENCY_SOL,
  marketsTokens
} from 'helpers/marketHelpers';

// filters out zero debt obligations and multiplies outstanding obl. by nft price
export async function fetchTVL(obligations: any) {
  if (!obligations.length) return 0;
  return obligations.filter((obl: any) => obl.debt !== 0).length;
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
 * @description sets the obligations for the liquidation page of a collection and filters out obligations with zero debt
 * @params obligations array, currentmarketid. nft
 * @returns chart data
 */
export const setObligations = async (
  obligations: any,
  nftPrice: number,
  selectedMarket?: MarketTableRow
) => {
  if (!obligations) return [];
  if (!selectedMarket) return [];
  let decimals =
    selectedMarket.loanCurrency === LOAN_CURRENCY_SOL
      ? marketsTokens.SOL.decimals
      : marketsTokens.USDC.decimals;

  return obligations
    .map((obligation: any) => {
      const obl = {
        name: renderMarketName(selectedMarket.id),
        riskLvl: (obligation.debt / nftPrice) * 100,
        healthLvl:
          ((nftPrice * obligation.count -
            obligation.debt / obligation.count / COLLATERAL_FACTOR) /
            (nftPrice * obligation.count)) *
          100,
        debt: obligation.debt,
        estimatedValue: nftPrice * obligation.count,
        nftMint: obligation.nft_mint,
        owner: obligation.owner,
        obligation: obligation.obligation,
        highestBid: obligation.highest_bid,
        count: obligation.count
      };
      return obl;
    })
    .filter((obl: any) => obl.debt.toString() != 0);
};
/**
 * @description calculates the risk of a market
 * @params array of obligations | nft price | boolean: false will calculate the risk - true will calculate the total debt | market id | name of collection
 * @returns total debt of market if type is true, risk of market if type is false
 */
export const calculateRisk = async (
  obligations: any,
  nftPrice: number,
  type: boolean
) => {
  if (!obligations) return 0;
  let filtered = await obligations.filter(
    (obl: any) => obl.debt.toString() != 0
  );

  let sumOfDebt = await filtered.reduce((acc: number, obligation: any) => {
    return (acc += obligation.debt);
  }, 0);

  const sum = (sumOfDebt / filtered.length / nftPrice) * 100;
  return sum;
};
