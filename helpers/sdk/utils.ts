import { BN } from '@project-serum/anchor';

import { PoolUser, PoolParams, EscrowData, LockerParams, ReceiptData } from '.';

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

export const calculateVotingPower = (
  escrow: EscrowData,
  params: LockerParams,
  currentTimestamp: number = Math.floor(Date.now() / 1_000)
): BN => {
  if (escrow.escrowStartedAt.eqn(0)) {
    return new BN(0);
  }
  if (
    escrow.escrowStartedAt.gtn(currentTimestamp) ||
    escrow.escrowEndsAt.lten(currentTimestamp)
  ) {
    return new BN(0);
  }
  const duration = escrow.escrowEndsAt.sub(escrow.escrowStartedAt);
  return calculateVotingPowerWithParams(escrow.amount, duration, params);
};

export const calculateVotingPowerWithParams = (
  amount: BN,
  duration: BN,
  params: LockerParams
): BN => {
  return amount
    .mul(duration)
    .muln(params.multiplier)
    .div(params.maxStakeDuration);
};

export const calculateNFTReceiptClaimableAmount = (
  receipt: ReceiptData,
  params: LockerParams,
  currentTimestamp: number = Math.floor(Date.now() / 1_000)
): BN => {
  const nowBN = new BN(currentTimestamp);
  const due = nowBN.lt(receipt.vestEndsAt) ? nowBN : receipt.vestEndsAt;
  let duration = due.sub(receipt.vestStartedAt).toNumber();

  if (duration < 0) {
    return new BN(0);
  }

  let count = Math.floor(duration / params.nftStakeDurationUnit.toNumber());
  let amountPerUnit = params.nftStakeBaseReward;
  let claimableAmount = new BN(0);

  for (let i = 0; i < count; i++) {
    if (i >= params.nftRewardHalvingStartsAt) {
      amountPerUnit = amountPerUnit.divn(2);
    }
    claimableAmount = claimableAmount.add(amountPerUnit);
  }

  return claimableAmount.gt(receipt.claimedAmount)
    ? claimableAmount.sub(receipt.claimedAmount)
    : new BN(0);
};

export const calculateMaxRewardAmount = (params: LockerParams): BN => {
  let amount = new BN(0);
  let amountPerUnit = params.nftStakeBaseReward;

  for (let i = 0; i < params.nftStakeDurationCount; i++) {
    if (i >= params.nftRewardHalvingStartsAt) {
      amountPerUnit = amountPerUnit.divn(2);
    }
    amount = amount.add(amountPerUnit);
  }

  return amount;
};
