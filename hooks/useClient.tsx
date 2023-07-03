import React from 'react';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { HoneyClient, HoneyContext, Wallet } from '@honey-finance/sdk';
import { PublicKey } from '@solana/web3.js';
import { HONEY_PROGRAM_ID } from 'helpers/marketHelpers';

export const HONEY_MARKET_IDS = [
  new PublicKey('6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3') // Honey Gen
  // new PublicKey("Bw77MGpg189EaATjN67WXcnp3c4544LhKoV4Ftmdg4C"), // Pesky Penguins
  // new PublicKey("H2H2pJuccdvpET9A75ajB3GgdYdCUL4T3kiwUMA6DJ7q"), // Lifinity flares
  // new PublicKey("Bxk1JQCbVjpeFnjzvH5n9bepnZeHjRADUFwZiVC7L5Gq"), // OG Atadians
  // new PublicKey("F8rZviSSuqgkTsjMeoyrTUSNSqh7yNDCAozJkxm7eujY"), // Burrito
  // new PublicKey("GrKPvcdHVb4cwR5a2CCgCTvdkSqhNDRgSUiUVzXRWLk6"), // Blocksmith
  // new PublicKey("5UKRRSxbi4PgPnQU2ZqtukUxd1fyN6ydn1hoxivP46A8"), // Ovols
  // new PublicKey("GAqyPziKPwVpwKaeqPhEsxiy6MwQ2bvtodruWErpLVKo"), // Droids
  // new PublicKey("2dxJ4eMkhMxm1ZqpAhKsjunvyziuq1JRnuHaqKFRY8et"), // Vandals
  // new PublicKey("FTBLaLcrx1aXALW2UEpu8a6HLRVFATezkK12wCABPAiA"), // Ukiyo
  // new PublicKey("Dmngi1MDEQU9fm6sX39EuyT3EpYEmXYuyg56uEjVCkD6"), // Marshies
  // new PublicKey("5ZxAjKpbYje5fCxhvnRYxbMh6XSZm5Cd7RA9mMGb1DLY"), // Heavenland
  // new PublicKey("7pfaZcAqpWRHpEqGMwPQrn5tj5WVQ48F4PrAtFLuS1P7"), // Drunken Ape Social Club
  // new PublicKey("HyUDgtmrERNC6xnPUjxs7fvkB6rX5esqvP5LW4LiXzrV"), // Wolf capital
  // new PublicKey("HxuWzw18mR93RmxPkPu8RCD8kjrSJxo7WyaaKHu5NQEZ"), // USDC HB market
  // new PublicKey("2SC72EUqsd5Bax6u6vmmwcGiqjrjZrXJ7S1FsGfL4hBR"), // USDC Mad Lads
  // new PublicKey("JD2mMtsdT7fTkWojVLh2rjMZBLnKUev7JSn6iLg7chM7"), // USDC Clayno
  // new PublicKey("4RNS5Z4oMbn6eDAjqLmaKbrpuwExg3sHkRg7FYCZ5HQS"), // SOL Clayno
  // new PublicKey("5rXuse6cWigMMNw9fRZMZXGmD2rV7RLpiettBwGKcXm7"), // Ubik/SOL
  // new PublicKey('A5FZGzNiHZEJ8qxzMjUs2Dxtz8oFi2wTrrvhoxYH3e7m') // USDC LIfinity
];

export const useClient = () => {
  const wallet = useWallet();
  if (wallet.publicKey) {
    const connection = useConnection().connection;
    const ctx = HoneyContext.from(
      connection,
      wallet as Wallet,
      new PublicKey(HONEY_PROGRAM_ID)
    );
    const client = new HoneyClient(ctx, wallet.publicKey, HONEY_MARKET_IDS);

    return {
      ctx,
      client
    };
  }
};
