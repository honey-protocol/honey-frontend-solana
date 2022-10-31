import { BN } from '@project-serum/anchor';

import { PoolUser, PoolParams } from '.';

export const calculateClaimableAmountFromStakePool = (
  user: PoolUser,
  params: PoolParams,
  currentTimestamp: number = Math.floor(Date.now() / 1_000)
): BN => {
  const nowBN = new BN(currentTimestamp);
  const claimStartsAt = user.depositedAt.gt(params.startsAt)
    ? user.depositedAt
    : params.startsAt;
  const duration = nowBN.sub(claimStartsAt);
  const maxClaimPeriod = params.claimPeriodUnit.muln(params.maxClaimCount);
  let claimableAmount = new BN(0);
  if (duration.gt(maxClaimPeriod)) {
    claimableAmount = user.depositAmount.sub(user.claimedAmount);
  } else {
    const count = parseInt(duration.div(params.claimPeriodUnit).toString());
    if (count > user.count) {
      const delta = count - user.count;
      claimableAmount = user.depositAmount
        .muln(delta)
        .divn(params.maxClaimCount);
    }
  }

  return claimableAmount;
};
