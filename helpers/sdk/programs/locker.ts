import { AnchorTypes } from '@saberhq/anchor-contrib';

import { VeHoney as Locker } from '../idls/ve_honey';

export type LockerTypes = AnchorTypes<
  Locker,
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

type VeHoneyAccounts = LockerTypes['Accounts'];
export type LockerData = VeHoneyAccounts['locker'];
export type EscrowData = VeHoneyAccounts['escrow'];
export type WhitelistEntryData = VeHoneyAccounts['whitelistEntry'];
export type ProofData = VeHoneyAccounts['proof'];
export type ReceiptData = VeHoneyAccounts['nftReceipt'];

export type LockerParams = LockerTypes['Defined']['LockerParams'];

export type LockerProgram = LockerTypes['Program'];
