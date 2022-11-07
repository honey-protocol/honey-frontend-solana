import React from 'react';
import { TokenAmount } from '@saberhq/token-utils';

import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import { HoneySlider } from 'components/HoneySlider/HoneySlider';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import { Proposal } from 'contexts/GovernanceProvider';

import * as styles from '../../VoteForm.css';

export type VoteType = 'vote_for' | 'vote_against';
interface ProposalVoteProps {
  proposalInfo: Proposal;
  voteType: VoteType;
  setVoteType: Function;
  votingPower: TokenAmount | null;
}
const ProposalVote = (props: ProposalVoteProps) => {
  const { proposalInfo, voteType, setVoteType, votingPower } = props;
  const totalDeterminingVotes = proposalInfo.data.forVotes.add(
    proposalInfo.data.againstVotes
  );

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
            value={proposalInfo.data.forVotes.toString() || ''}
            footer={<span>Voted for</span>}
          />
          <HoneySlider
            currentValue={proposalInfo.data.forVotes.toNumber() || 0}
            maxValue={totalDeterminingVotes?.toNumber() || 1000}
            minAvailableValue={0}
            isReadonly
          />
        </div>
        <div className={styles.gridCell}>
          <InfoBlock
            value={proposalInfo.data.againstVotes.toString() || ''}
            footer={<span>Voted against</span>}
          />
          <HoneySlider
            currentValue={proposalInfo.data.againstVotes.toNumber() || 0}
            maxValue={totalDeterminingVotes?.toNumber() || 0}
            minAvailableValue={0}
            maxSafePosition={0}
            dangerPosition={0}
            isReadonly
          />
        </div>
        <div className={styles.gridCell}>
          <InfoBlock
            value={votingPower?.asNumber.toString() ?? '--'}
            footer={<span>Your voting power</span>}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalVote;
