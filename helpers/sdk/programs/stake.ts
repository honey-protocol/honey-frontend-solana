import { AnchorTypes } from '@saberhq/anchor-contrib';

import { Stake } from '../../types/stake';

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
