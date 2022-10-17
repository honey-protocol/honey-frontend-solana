import React from 'react';
import { ProposalInfo } from 'hooks/tribeca/useProposals';
import * as styles from '../../VoteForm.css';

interface ProposalQueueProps {
  proposalInfo: ProposalInfo;
}

const ProposalQueue = (props: ProposalQueueProps) => {
  const { proposalInfo } = props;

  const votingEndedAt = new Date(
    proposalInfo.proposalData.votingEndsAt.toNumber() * 1_000
  );
  return (
    <div className={styles.description}>
      The proposal passed successfully on {votingEndedAt.toLocaleString()}.
    </div>
  );
};

export default ProposalQueue;
