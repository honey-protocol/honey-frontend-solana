import { useState, useEffect, useCallback } from 'react';
import {
  ProposalData,
  ProposalMetaData,
  ProposalState,
  getProposalState,
  ProposalInstruction,
  VoteData,
  VoteSide
} from '@tribecahq/tribeca-sdk';
import { PublicKey } from '@solana/web3.js';
import { useConnectedWallet } from '@saberhq/use-solana';

import { useGovernanceContext } from '../contexts/GovernanceProvider';

export interface Proposal {
  pubkey: PublicKey;
  data: ProposalData;
  status: ProposalState;
  meta?: ProposalMetaData;
}

export const useProposals = () => {
  const wallet = useConnectedWallet();
  const { governorWrapper } = useGovernanceContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  async function fetchProposals() {
    if (governorWrapper) {
      setIsLoading(true);
      const proposalDatas = await governorWrapper.program.account.proposal.all([
        {
          memcmp: {
            offset: 8,
            bytes: governorWrapper.governorKey.toBase58()
          }
        }
      ]);
      const fetchProposalMetasPromise = proposalDatas.map(p =>
        governorWrapper.fetchProposalMeta(p.publicKey)
      );
      const proposalMetas = await Promise.all(fetchProposalMetasPromise);

      const proposals: Proposal[] = proposalDatas.map(p => {
        const meta = proposalMetas.find(meta => meta.proposal === p.publicKey);
        return {
          pubkey: p.publicKey,
          data: p.account,
          status: getProposalState({ proposalData: p.account }),
          meta
        };
      });

      setProposals(proposals);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProposals();

    const timer = setInterval(() => {
      fetchProposals();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const createProposal = useCallback(
    async (instructions: ProposalInstruction[]) => {
      if (governorWrapper && wallet) {
        const { index, proposal, tx } = await governorWrapper.createProposal({
          proposer: wallet.publicKey,
          instructions
        });
        setIsProcessing(true);
        const receipt = await tx.confirm();
        setIsProcessing(false);
        return {
          receipt,
          index,
          proposal
        };
      }
      return null;
    },
    [governorWrapper, wallet]
  );

  const cancelProposal = useCallback(
    async (proposal: PublicKey) => {
      if (governorWrapper && wallet) {
        const tx = governorWrapper.cancelProposal({ proposal });
        setIsProcessing(true);
        const receipt = await tx.confirm();
        setIsProcessing(false);
        return {
          receipt
        };
      }
      return null;
    },
    [governorWrapper, wallet]
  );

  const createProposalMeta = useCallback(
    async (proposal: PublicKey, title: string, descriptionLink: string) => {
      if (governorWrapper && wallet) {
        const tx = await governorWrapper.createProposalMeta({
          proposal,
          title,
          descriptionLink
        });
        setIsProcessing(true);
        const receipt = await tx.confirm();
        setIsProcessing(false);
        return {
          receipt
        };
      }
      return null;
    },
    [governorWrapper, wallet]
  );

  return {
    isLoading,
    isProcessing,
    proposals,
    createProposal,
    cancelProposal,
    createProposalMeta
  };
};

export interface Vote {
  pubkey: PublicKey;
  data?: VoteData;
  side?: VoteSide;
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
        setVote({ pubkey: voteKey });
      }
    }
  }

  useEffect(() => {
    fetchVote();

    const timer = setInterval(() => {
      fetchVote();
    });

    return () => {
      clearInterval(timer);
    };
  }, []);

  return { vote };
};
