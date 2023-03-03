import { useConnection, useConnectedWallet } from '@saberhq/use-solana';
import { HONEY_PROGRAM_ID } from 'helpers/marketHelpers/index';
import { toast } from 'react-toastify';
import BN from 'bn.js';
import { Big } from 'big.js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  AggregatorAccount,
  loadSwitchboardProgram
} from '@switchboard-xyz/switchboard-v2';

/**
 * @description exports the current sdk configuration object
 * @params none
 * @returns connection | wallet | honeyID |
 */
export function ConfigureSDK() {
  return {
    saberHqConnection: useConnection(),
    sdkWallet: useConnectedWallet() || null,
    honeyId: 'AoaqbAiwMVK12MQHkRi7p5aemc1CQ271JyuyeHzXonXu'
  };
}
/**
 * @description exports function that validates if input is number
 * @params user input
 * @returns success or failure object
 */
export async function inputNumberValidator(val: any) {
  if (val == '000' || val == '0000') {
    return {
      success: true,
      message: '',
      value: '00'
    };
  }
  if (val >= 0 && val < 100) {
    return {
      success: true,
      message: '',
      value: val
    };
  } else {
    return {
      success: false,
      message: 'Please fill in a number between 0 and 100',
      value: val
    };
  }
}

/**
 * @description custom toast response
 * @params responseType | message | id | trigger type
 * @returns toast message object
 */
export async function toastResponse(
  responseType: string,
  message: string,
  id: any,
  triggerType?: string
) {
  if (responseType == 'ERROR' || responseType == 'FAILED') {
    return toast.error(message, { toastId: responseType });
  } else if (responseType == 'LOADING') {
    const resolveP = new Promise(resolve => setTimeout(resolve, 4000));
    return toast.promise(
      resolveP,
      {
        pending: 'Loading data',
        success: 'Data loaded',
        error: 'An error occurred'
      },
      {
        toastId: responseType
      }
    );
  } else if (responseType == 'SUCCESS') {
    // success logic
    if (triggerType && (triggerType == 'BORROW' || triggerType == 'REPAY')) {
      return toast.success(message, { toastId: responseType });
    }

    if (triggerType && triggerType == 'CLAIM_NFT') {
      // write logic to call open positions refresh function
      return toast.success(message, { toastId: responseType });
    }

    return toast.success(message, { toastId: responseType });
  } else if (responseType == 'LIQUIDATION') {
    return toast.success(message, { toastId: responseType });
  }
}
/**
 * @description custom async timeout which returns a promise
 * @params miliseconds
 * @returns promise
 */
export const asyncTimeout = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

/**
 * @description converts bn to decimal
 * @params value as in BN, amount of decimals required, amount of precision
 * @returns number with requested decimals
 */
export function BnToDecimal(
  val: BN | undefined,
  decimal: number,
  precision: number
) {
  if (!val) return 0;
  return (
    val.div(new BN(10 ** (decimal - precision))).toNumber() / 10 ** precision
  );
}
/**
 * @description function which extends the logic as a helper
 * @params value from SDK | first multiplier | second multiplier
 * @returns outcome of sum
 */
export function BnDivided(val: BN, a: number, b: number) {
  return val.div(new BN(a ** b)).toNumber();
}

export async function getOraclePrice(
  cluster: 'devnet' | 'mainnet-beta' = 'mainnet-beta',
  connection: Connection,
  aggregatorKey: PublicKey | undefined
): Promise<any> {
  // load the switchboard program
  if (!aggregatorKey) return 0;
  const program = await loadSwitchboardProgram(
    cluster,
    connection,
    Keypair.fromSeed(new Uint8Array(32).fill(1)) // using dummy keypair since we wont be submitting any transactions
  );

  // load the switchboard aggregator
  const aggregator = new AggregatorAccount({
    program,
    publicKey: aggregatorKey
  });

  // get the result
  const result = await aggregator.getLatestValue();
  // console.log(`Switchboard Result: ${result}`);
  if (result) {
    let val = new Big(result).toNumber();

    return val;
  } else {
    return 0;
  }
}
