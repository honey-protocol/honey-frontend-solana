import { PublicKey } from '@solana/web3.js';

import {
  POOL_USER_SEED,
  TOKEN_VAULT_SEED,
  VAULT_AUTHORITY_SEED,
  VEHONEY_ADDRESSES
} from '../../constant';

export function findPoolUserAddress(pool: PublicKey, owner: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from(POOL_USER_SEED), pool.toBuffer(), owner.toBuffer()],
    VEHONEY_ADDRESSES.Stake
  );
}

export function findVaultAuthorityAddress(pool: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from(VAULT_AUTHORITY_SEED), pool.toBuffer()],
    VEHONEY_ADDRESSES.Stake
  );
}

export function findTokenVaultAddress(
  preTokenMint: PublicKey,
  tokenMint: PublicKey
) {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(TOKEN_VAULT_SEED),
      tokenMint.toBuffer(),
      preTokenMint.toBuffer()
    ],
    VEHONEY_ADDRESSES.Stake
  );
}
