import React, { useMemo } from 'react';
import { TokenAmount } from '@saberhq/token-utils';

import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import { HoneySlider } from 'components/HoneySlider/HoneySlider';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import { Proposal } from 'contexts/GovernanceProvider';
import { useLocker } from 'hooks/useVeHoney';
import c from 'classnames';

import * as styles from '../../VoteForm.css';
import Countdown from 'react-countdown';

export type VoteType = 'vote_for' | 'vote_against';
interface ProposalVoteProps {
  proposal?: Proposal;
  voteType: VoteType;
  setVoteType: Function;
}
const ProposalVote = ({
  voteType,
  setVoteType,
  proposal
}: ProposalVoteProps) => {
  const { govToken, votingPower } = useLocker();

  const votes = useMemo(() => {
    if (proposal && govToken) {
      return {
        for: new TokenAmount(govToken, proposal.data.forVotes),
        against: new TokenAmount(govToken, proposal.data.againstVotes),
        total: new TokenAmount(
          govToken,
          proposal.data.forVotes.add(proposal.data.againstVotes)
        )
      };
    }
    return null;
  }, [govToken, proposal]);

  const votingEndsAt = proposal?.data.votingEndsAt.toNumber();

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.row}>
        <HoneyButtonTabs
          items={[
            { name: 'Vote for', slug: 'vote_for' },
            { name: 'Vote against', slug: 'vote_against' }
          ]}
          activeItemSlug={voteType}
          onClick={itemSlug => setVoteType(itemSlug as VoteType)}
          isFullWidth
        />
      </div>

      <div className={styles.grid}>
        <div className={styles.gridCell}>
          <InfoBlock
            value={votes?.for.asNumber.toString() ?? '-'}
            footer={<span>Voted for</span>}
          />
          <HoneySlider
            currentValue={votes?.for.asNumber ?? 0}
            maxValue={votes?.total.asNumber ?? 1000}
            minAvailableValue={0}
            isReadonly
          />
        </div>
        <div className={styles.gridCell}>
          <InfoBlock
            value={votes?.against.asNumber.toString() ?? '-'}
            footer={<span>Voted against</span>}
          />
          <HoneySlider
            currentValue={votes?.against.asNumber ?? 0}
            maxValue={votes?.total.asNumber ?? 0}
            minAvailableValue={0}
            maxSafePosition={0}
            dangerPosition={0}
            isReadonly
          />
        </div>
        <div className={c(styles.gridCell, styles.span2Cell)}>
          <InfoBlock
            center
            value={votingPower?.asNumber.toString() ?? '--'}
            footer={<span>Your voting power</span>}
            className={styles.votingPowerInfo}
          />
        </div>
      </div>
      <div className={c(styles.gridCell, styles.span2Cell)}>
        <InfoBlock
          center
          value={<Countdown date={Number(votingEndsAt) * 1000} />}
          title="Voting ends in"
          className=""
        />
      </div>
    </div>
  );
};

export default ProposalVote;
