import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import { HoneySlider } from 'components/HoneySlider/HoneySlider';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import * as styles from '../../VoteForm.css';
import React from 'react';
import { ProposalInfo } from 'hooks/tribeca/useProposals';
import { TokenAmount } from '@saberhq/token-utils';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { Spin } from 'antd';
import { VoteSide } from 'helpers/dao';
import { Fraction } from '@saberhq/token-utils';
import BN from 'bn.js';

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
  const { veToken } = useGovernor();

  const getVoteCountFmt = (side: VoteSide) => {
    const voteCount =
      side === VoteSide.For
        ? proposalInfo.proposalData.forVotes
        : side === VoteSide.Against
        ? proposalInfo.proposalData.againstVotes
        : new BN(0);

    return veToken && voteCount !== null ? (
      new Fraction(voteCount, 10 ** veToken.decimals).asNumber.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0
        }
      )
    ) : (
      <Spin />
    );
  };
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
            maxValue={totalDeterminingVotes?.toNumber() || 1000}
            minAvailableValue={0}
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
            maxSafePosition={0}
            dangerPosition={0}
            isReadonly
          />
        </div>
        <div className={styles.gridCell}>
          <InfoBlock
            value={vePower?.asNumber.toString() || '--'}
            footer={<span>Your voting power</span>}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalVote;
