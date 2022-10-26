import { AnchorTypes } from '@saberhq/anchor-contrib';

import { Stake } from '../types/stake';
import { VeHoney } from '../types/ve_honey';

export type StakeTypes = AnchorTypes<
  Stake,
  {
    poolInfo: PoolInfo;
    poolUser: PoolUser;
  },
  {
    poolParams: PoolParams;
  }
>;

type StakeAccounts = StakeTypes['Accounts'];
export type PoolInfo = StakeAccounts['poolInfo'];
export type PoolUser = StakeAccounts['poolUser'];

export type PoolParams = StakeTypes['Defined']['PoolParams'];

export type StakeProgram = StakeTypes['Program'];

export type VeHoneyTypes = AnchorTypes<
  VeHoney,
  {
    locker: LockerData;
    escrow: EscrowData;
    whitelistEntry: WhitelistEntryData;
    proof: ProofData;
    receipt: ReceiptData;
  },
  {
    lockerParams: LockerParams;
  }
>;

type VeHoneyAccounts = VeHoneyTypes['Accounts'];
export type LockerData = VeHoneyAccounts['locker'];
export type EscrowData = VeHoneyAccounts['escrow'];
export type WhitelistEntryData = VeHoneyAccounts['whitelistEntry'];
export type ProofData = VeHoneyAccounts['proof'];
export type ReceiptData = VeHoneyAccounts['nftReceipt'];

export type LockerParams = VeHoneyTypes['Defined']['LockerParams'];

export type VeHoneyProgram = VeHoneyTypes['Program'];
