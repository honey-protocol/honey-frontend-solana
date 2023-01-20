import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TokenAmount } from '@saberhq/token-utils';
import { VoteSide, ProposalInstruction } from '@tribecahq/tribeca-sdk';
import { BN } from '@project-serum/anchor';

import { GovernanceContext } from 'contexts/GovernanceProvider';
import {
  calculateClaimableAmountFromStakePool,
  calculateVotingPower,
  calculateNFTReceiptClaimableAmount,
  calculateMaxRewardAmount
} from 'helpers/sdk';

export const useGovernance = () => {
  const context = useContext(GovernanceContext);

  if (!context) {
    throw new Error('Govern context undefined');
  }

  return context;
};

export const useProposals = () => {
  const { governorWrapper, setIsProcessing, proposals } = useGovernance();

  const createProposal = useCallback(
    async (instructions: ProposalInstruction[]) => {
      if (!governorWrapper) {
        throw new Error('Error: governor undefined');
      }
      const { index, proposal, tx } = await governorWrapper.createProposal({
        instructions
      });
      setIsProcessing?.(true);
      const receipt = await tx.confirm();
      setIsProcessing?.(false);

      return { index, proposal, receipt };
    },
    [governorWrapper, setIsProcessing]
  );

  const cancelProposal = useCallback(
    async (proposal: PublicKey) => {
      if (!governorWrapper) {
        throw new Error('Error: governor undefined');
      }
      const tx = governorWrapper.cancelProposal({ proposal });
      setIsProcessing?.(true);
      const receipt = await tx.confirm();
      setIsProcessing?.(false);

      return { receipt };
    },
    [governorWrapper, setIsProcessing]
  );

  const createProposalMeta = useCallback(
    async (proposal: PublicKey, title: string, descriptionLink: string) => {
      if (!governorWrapper) {
        throw new Error('Error: governor undefined');
      }
      const tx = await governorWrapper.createProposalMeta({
        proposal,
        title,
        descriptionLink
      });
      setIsProcessing?.(true);
      const receipt = await tx.confirm();
      setIsProcessing?.(false);

      return { receipt };
    },
    [governorWrapper, setIsProcessing]
  );

  return {
    proposals,
    createProposal,
    cancelProposal,
    createProposalMeta
  };
};

export const useProposalWithKey = (pubkey: PublicKey) => {
  const { proposals, governorInfo } = useGovernance();

  const proposal = useMemo(
    () => proposals?.find(p => p.pubkey.equals(pubkey)),
    [proposals, pubkey]
  );

  const earliestActivationTime = useMemo(
    () =>
      governorInfo && proposal
        ? new Date(
            proposal.data.createdAt
              .add(governorInfo.params.votingDelay)
              .toNumber() * 1_000
          )
        : null,
    [proposal, governorInfo]
  );

  return {
    proposalInfo: proposal,
    earliestActivationTime
  };
};

export interface Vote {
  pubkey: PublicKey;
  weight?: TokenAmount;
  side: VoteSide;
}

export const useVote = (proposal: PublicKey) => {
  const { governorWrapper, govToken } = useGovernance();

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
          weight: govToken ? new TokenAmount(govToken, vote.weight) : undefined,
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
    stakePoolUser,
    preToken,
    govToken
  } = useGovernance();

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
    if (stakePoolInfo && stakePoolUser && govToken) {
      return new TokenAmount(
        govToken,
        calculateClaimableAmountFromStakePool(
          stakePoolUser.data,
          stakePoolInfo.params
        )
      );
    }
    return null;
  }, [stakePoolInfo, stakePoolUser, govToken]);

  return {
    pool: stakePoolInfo,
    user: stakePoolUser,
    deposit,
    claim,
    vest,
    claimableAmount,
    preToken,
    govToken
  };
};

export const useLocker = () => {
  const { lockerWrapper, lockerInfo, escrow, setIsProcessing, govToken } =
    useGovernance();

  const lock = useCallback(
    async (amount: BN, duration: BN) => {
      if (lockerWrapper) {
        const tx = await lockerWrapper.lock(amount, duration);
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [lockerWrapper, setIsProcessing]
  );

  const lockNft = useCallback(
    async (nft: PublicKey) => {
      if (lockerWrapper) {
        try {
        const tx = await lockerWrapper.lockNFT(nft);
        setIsProcessing?.(true);
        // const receipt = await tx.confirm();
          const receipt = await tx.simulate();
          console.log(receipt);
          setIsProcessing?.(false);
        } catch (e) {
          console.log(e)
        }

        // return { receipt };
      }
    },
    [lockerWrapper, setIsProcessing]
  );

  const castVote = useCallback(
    async (proposal: PublicKey, side: VoteSide) => {
      if (lockerWrapper) {
        const tx = await lockerWrapper.castVote(proposal, side);
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [lockerWrapper, setIsProcessing]
  );

  const activateProposal = useCallback(
    async (proposal: PublicKey) => {
      if (lockerWrapper) {
        const tx = await lockerWrapper.activateProposal(proposal);
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [lockerWrapper, setIsProcessing]
  );

  const unlock = useCallback(async () => {
    if (lockerWrapper) {
      const tx = await lockerWrapper.unlock();
      setIsProcessing?.(true);
      const receipt = await tx.confirm();
      setIsProcessing?.(false);

      return { receipt };
    }
    return null;
  }, [lockerWrapper, setIsProcessing]);

  const claim = useCallback(
    async (receiptId: BN) => {
      if (lockerWrapper) {
        const tx = await lockerWrapper.claim(receiptId);
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [lockerWrapper, setIsProcessing]
  );

  const closeReceipt = useCallback(
    async (receiptId: BN) => {
      if (lockerWrapper) {
        const tx = await lockerWrapper.closeReceipt(receiptId);
        setIsProcessing?.(true);
        const receipt = await tx.confirm();
        setIsProcessing?.(false);

        return { receipt };
      }
      return null;
    },
    [lockerWrapper, setIsProcessing]
  );

  const closeEscrow = useCallback(async () => {
    if (lockerWrapper) {
      const tx = await lockerWrapper.closeEscrow();
      setIsProcessing?.(true);
      const receipt = await tx.confirm();
      setIsProcessing?.(false);

      return { receipt };
    }
    return null;
  }, [lockerWrapper, setIsProcessing]);

  const minActivationThreshold = useMemo(() => {
    if (lockerInfo && govToken) {
      return new TokenAmount(
        govToken,
        lockerInfo.params.proposalActivationMinVotes
      );
    }
    return null;
  }, [lockerInfo, govToken]);

  const votingPower = useMemo(() => {
    if (lockerInfo && escrow && govToken) {
      return new TokenAmount(
        govToken,
        calculateVotingPower(escrow.data, lockerInfo.params)
      );
    }
    return null;
  }, [lockerInfo, escrow, govToken]);

  const lockedAmount = useMemo(() => {
    if (escrow && govToken) {
      return new TokenAmount(govToken, escrow.data.amount);
    }
    return null;
  }, [escrow, govToken]);

  const isActivatiable = useMemo(() => {
    if (minActivationThreshold && votingPower) {
      return (
        votingPower.greaterThan(minActivationThreshold) ||
        votingPower.equalTo(minActivationThreshold)
      );
    }
    return false;
  }, [votingPower, minActivationThreshold]);

  const getClaimableAmount = useCallback(
    (receiptId: number) => {
      if (lockerInfo && govToken && escrow?.receiptsMap.has(receiptId)) {
        const receipt = escrow.receiptsMap.get(receiptId);
        if (receipt) {
          return new TokenAmount(
            govToken,
            calculateNFTReceiptClaimableAmount(receipt, lockerInfo.params)
          );
        }
      }
      return null;
    },
    [lockerInfo, escrow, govToken]
  );

  const maxNFTRewardAmount = useMemo(() => {
    if (lockerInfo && govToken) {
      return new TokenAmount(
        govToken,
        calculateMaxRewardAmount(lockerInfo.params)
      );
    }
    return null;
  }, [lockerInfo, govToken]);

  return {
    locker: lockerInfo,
    escrow,
    govToken,
    votingPower,
    lockedAmount,
    maxNFTRewardAmount,
    minActivationThreshold,
    isActivatiable,
    getClaimableAmount,
    lock,
    lockNft,
    claim,
    unlock,
    closeReceipt,
    closeEscrow,
    castVote,
    activateProposal
  };
};
