import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  VoteData,
  VoteSide,
  ProposalInstruction
} from '@tribecahq/tribeca-sdk';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

import { useGovernanceContext } from '../contexts/GovernanceProvider';
import { calculateClaimableAmountFromStakePool } from '../helpers/sdk';

export const useProposals = () => {
  const { governorWrapper, setIsProcessing } = useGovernanceContext();

  const createProposal = useCallback(
    async (instructions: ProposalInstruction[]) => {
      if (governorWrapper) {
        const { index, proposal, tx } = await governorWrapper.createProposal({
          instructions
        });
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { index, proposal, receipt };
      }
      return null;
    },
    [governorWrapper, setIsProcessing]
  );

  const cancelProposal = useCallback(
    async (proposal: PublicKey) => {
      if (governorWrapper) {
        const tx = governorWrapper.cancelProposal({ proposal });
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [governorWrapper, setIsProcessing]
  );

  const createProposalMeta = useCallback(
    async (proposal: PublicKey, title: string, descriptionLink: string) => {
      if (governorWrapper) {
        const tx = await governorWrapper.createProposalMeta({
          proposal,
          title,
          descriptionLink
        });
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [governorWrapper, setIsProcessing]
  );

  return {
    createProposal,
    cancelProposal,
    createProposalMeta
  };
};

export interface Vote {
  pubkey: PublicKey;
  data: VoteData;
  side: VoteSide;
}

export const useVote = (proposal: PublicKey) => {
  const { governorWrapper } = useGovernanceContext();

  const [vote, setVote] = useState<Vote>();

  async function fetchVote() {
    if (governorWrapper) {
      const { voteKey, instruction } = await governorWrapper.getOrCreateVote({
        proposal
      });

      if (!instruction) {
        const vote = await governorWrapper.program.account.vote.fetch(voteKey);
        setVote({
          pubkey: voteKey,
          data: vote,
          side: vote.side as VoteSide
        });
      } else {
        setVote(undefined);
      }
    }
  }

  useEffect(() => {
    fetchVote();

    const timer = setInterval(() => {
      fetchVote();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return { vote };
};

export const useStake = () => {
  const {
    stakeWrapper,
    lockerWrapper,
    governorWrapper,
    setIsProcessing,
    stakePoolInfo,
    stakePoolUser
  } = useGovernanceContext();

  const deposit = useCallback(
    async (amount: BN) => {
      if (stakeWrapper) {
        const tx = await stakeWrapper.deposit(amount);
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [stakeWrapper, setIsProcessing]
  );

  const claim = useCallback(async () => {
    if (stakeWrapper) {
      const tx = await stakeWrapper.claim();
      setIsProcessing?.(true);
      const receipt = await tx.confirm();
      setIsProcessing?.(false);

      return { receipt };
    }
    return null;
  }, [stakeWrapper]);

  const vest = useCallback(
    async (amount: BN, duration: BN) => {
      if (stakeWrapper && lockerWrapper && governorWrapper) {
        const tx = await stakeWrapper.vest(
          amount,
          duration,
          undefined,
          lockerWrapper.locker,
          governorWrapper.governorKey
        );
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [stakeWrapper, lockerWrapper, governorWrapper, setIsProcessing]
  );

  const claimableAmount = useMemo(() => {
    if (stakePoolInfo && stakePoolUser) {
      return calculateClaimableAmountFromStakePool(
        stakePoolUser.data,
        stakePoolInfo.params
      );
    }
    return null;
  }, [stakePoolInfo, stakePoolUser]);

  return {
    deposit,
    claim,
    vest,
    claimableAmount
  };
};

export const useLocker = () => {};
