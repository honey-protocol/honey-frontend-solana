import React from 'react';

import { Proposal } from 'contexts/GovernanceProvider';

import * as styles from '../../VoteForm.css';

interface ProposalQueueProps {
  proposalInfo: Proposal;
}

const ProposalQueue = (props: ProposalQueueProps) => {
  const { proposalInfo } = props;

  const votingEndedAt = new Date(
    proposalInfo.data.votingEndsAt.toNumber() * 1_000
  );
  return (
    <div className={styles.description}>
      The proposal passed successfully on {votingEndedAt.toLocaleString()}.
    </div>
  );
};

export default ProposalQueue;
