import { useMemo } from 'react';
import { Wallet } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { SolanaProvider } from '@saberhq/solana-contrib';
import { GovernorWrapper, TribecaSDK } from '@tribecahq/tribeca-sdk';

import { StakeClient, VeHoneyClient } from 'helpers/sdk';

// for not-connected wallet user
const HARD_CODE_WALLET = new Wallet(
  Keypair.fromSecretKey(
    Uint8Array.from([
      22, 250, 163, 95, 161, 69, 162, 10, 92, 245, 229, 52, 145, 142, 125, 204,
      118, 129, 237, 65, 168, 196, 95, 210, 187, 79, 245, 146, 214, 20, 31, 251,
      199, 180, 17, 213, 243, 82, 106, 185, 58, 28, 142, 91, 245, 186, 253, 133,
      63, 237, 3, 126, 158, 100, 172, 185, 119, 189, 145, 130, 40, 246, 170, 102
    ])
  )
);

export function useGovernSDK({ governor }: { governor: PublicKey }) {
  const connection = useConnection();
  const wallet = useConnectedWallet();

  return useMemo(() => {
    const provider = SolanaProvider.init({
      connection,
      wallet: wallet ?? HARD_CODE_WALLET,
      opts: { commitment: 'confirmed' }
    });
    const tribecaSDK = TribecaSDK.load({ provider });

    return {
      stakeClient: new StakeClient(
        connection,
        (wallet ?? HARD_CODE_WALLET) as any
      ),
      veHoneyClient: new VeHoneyClient(
        connection,
        (wallet ?? HARD_CODE_WALLET) as any
      ),
      governClient: new GovernorWrapper(tribecaSDK, governor)
    };
  }, [connection, wallet]);
}
