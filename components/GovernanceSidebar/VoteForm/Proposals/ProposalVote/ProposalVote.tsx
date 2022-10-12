import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import { HoneySlider } from 'components/HoneySlider/HoneySlider';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import * as styles from '../../VoteForm.css';
import React from 'react';
import { ProposalInfo } from 'hooks/tribeca/useProposals';
import { TokenAmount } from '@saberhq/token-utils';
import { Space } from 'antd';

export type VoteType = 'vote_for' | 'vote_against';
interface ProposalVoteProps {
  proposalInfo: ProposalInfo;
  voteType: VoteType;
  setVoteType: Function;
  vePower: TokenAmount | null;
}
const ProposalVote = (props: ProposalVoteProps) => {
  const { proposalInfo, voteType, setVoteType, vePower } = props;
  const totalDeterminingVotes = proposalInfo?.proposalData.forVotes.add(
    proposalInfo.proposalData.againstVotes
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
            value={proposalInfo?.proposalData.forVotes.toString() || ''}
            footer={<span>Voted for</span>}
          />
          <HoneySlider
            currentValue={proposalInfo?.proposalData.forVotes.toNumber() || 0}
            maxValue={totalDeterminingVotes?.toNumber() || 0}
            minAvailableValue={10}
            isReadonly
          />
        </div>
        <div className={styles.gridCell}>
          <InfoBlock
            value={proposalInfo?.proposalData.againstVotes.toString() || ''}
            footer={<span>Voted against</span>}
          />
          <HoneySlider
            currentValue={
              proposalInfo?.proposalData.againstVotes.toNumber() || 0
            }
            maxValue={totalDeterminingVotes?.toNumber() || 0}
            minAvailableValue={0}
            isReadonly
          />
        </div>
        {/* 
        <div className={styles.gridCell}>
          <InfoBlock
            value={vePower?.toString() || '--'}
            footer={<span>Your voting power</span>}
          />
          <HoneySlider
            currentValue={vePower?.asNumber || 0}
            maxValue={1000}
            minAvailableValue={0}
            isReadonly
          />
        </div> */}
      </div>
    </div>
  );
};

export default ProposalVote;
