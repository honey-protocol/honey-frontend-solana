import { BN } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';

import {
  ESCROW_SEED,
  NFT_RECEIPT_SEED,
  PROOF_SEED,
  TREASURY_SEED,
  VEHONEY_ADDRESSES,
  WHITELIST_ENTRY_SEED
} from '../../constant';

export function findEscrowAddress(locker: PublicKey, owner: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from(ESCROW_SEED), locker.toBuffer(), owner.toBuffer()],
    VEHONEY_ADDRESSES.Locker
  );
}

export function findWhitelistEntryAddress(
  locker: PublicKey,
  executableId: PublicKey,
  owner: PublicKey | null
) {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(WHITELIST_ENTRY_SEED),
      locker.toBuffer(),
      executableId.toBuffer(),
      owner?.toBuffer() ?? SystemProgram.programId.toBuffer()
    ],
    VEHONEY_ADDRESSES.Locker
  );
}

export function findProofAddress(locker: PublicKey, addressToProve: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from(PROOF_SEED), locker.toBuffer(), addressToProve.toBuffer()],
    VEHONEY_ADDRESSES.Locker
  );
}

export function findTreasuryAddress(locker: PublicKey, tokenMint: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from(TREASURY_SEED), locker.toBuffer(), tokenMint.toBuffer()],
    VEHONEY_ADDRESSES.Locker
  );
}

export function findNFTReceiptAddress(
  locker: PublicKey,
  owner: PublicKey,
  receiptId: BN
) {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(NFT_RECEIPT_SEED),
      locker.toBuffer(),
      owner.toBuffer(),
      receiptId.toBuffer('le', 8)
    ],
    VEHONEY_ADDRESSES.Locker
  );
}
