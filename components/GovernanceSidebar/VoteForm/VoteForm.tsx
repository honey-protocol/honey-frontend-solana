import { FC, useState } from 'react';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { HoneySlider } from '../../HoneySlider/HoneySlider';
import * as styles from './VoteForm.css';
import { formatNumber } from '../../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { HoneyButtonTabs } from '../../HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';
import { VoteFormProps } from './types';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { useUserEscrow } from 'hooks/tribeca/useEscrow';
import { TokenAmount } from '@saberhq/token-utils';
import invariant from 'tiny-invariant';
import { createMemoInstruction } from '@saberhq/solana-contrib';
import { useSail } from '@saberhq/sail';
import { PROPOSAL_STATE_LABELS, VoteSide } from 'helpers/dao';
import useToast from 'hooks/useToast';
import { useVote } from 'hooks/tribeca/useVote';
import { useSDK } from 'helpers/sdk';

const { formatShortName: fsn } = formatNumber;

const VoteForm: FC<VoteFormProps> = (props: VoteFormProps) => {
  type VoteType = 'vote_for' | 'vote_against';
  const [voteType, setVoteType] = useState<VoteType>('vote_for');
  const { proposalInfo } = props;
  const { veToken } = useGovernor();
  const { data: escrow, veBalance } = useUserEscrow();
  const [reason, setReason] = useState<string>('');
  const { handleTX } = useSail();
  const { sdkMut } = useSDK();
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const { toast, ToastComponent } = useToast();

  const { data: myVote } = useVote(
    proposalInfo?.proposalKey,
    sdkMut?.provider.wallet.publicKey
  );

  const side: VoteSide =
    voteType === 'vote_for' ? VoteSide.For : VoteSide.Against;
  myVote?.accountInfo.data.side;

  // Put your validators here
  const isRepayButtonDisabled = () => {
    return false;
  };

  const totalDeterminingVotes = proposalInfo?.proposalData.forVotes.add(
    proposalInfo.proposalData.againstVotes
  );

  const vePower =
    veToken && escrow
      ? new TokenAmount(
          veToken,
          escrow.calculateVotingPower(
            proposalInfo?.proposalData.votingEndsAt.toNumber() || 0
          )
        )
      : null;

  const vote = async () => {
    try {
      toast.processing();
      if (!proposalInfo) return toast.error('No proposal info');

      invariant(escrow && side);
      const tx = await escrow.escrowW.castVote({
        proposal: proposalInfo.proposalKey,
        side
      });
      const memoIX = createMemoInstruction(reason, [
        escrow.escrowW.provider.wallet.publicKey
      ]);
      tx.append(memoIX);
      const { pending } = await handleTX(
        tx,
        `Vote ${voteType === 'vote_for' ? 'For' : 'Against'}`
      );
      if (!pending) {
        return;
      }
      await pending.wait();
      setHasVoted(true);
      toast.success('Vote Success');
    } catch (error) {
      console.log(error);
      toast.error('Vote error');
    }
  };

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="secondary">Close</HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={isRepayButtonDisabled()}
                isFluid={true}
                onClick={vote}
              >
                Vote {voteType === 'vote_for' ? 'for' : 'against'}
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.depositForm}>
        <div className={styles.tabTitle}>
          {proposalInfo?.proposalMetaData?.title || '--'}
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message="Discuss about this proposal on forum"
              link={proposalInfo?.proposalMetaData?.descriptionLink
                .split('(')
                .pop()
                ?.slice(0, -1)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                proposalInfo?.status.state
                  ? PROPOSAL_STATE_LABELS[proposalInfo?.status.state]
                  : '--'
              }
              valueSize="big"
              footer={<span>Status</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fsn(
                proposalInfo?.proposalData.quorumVotes.toNumber() || 0
              )}
              valueSize="big"
              footer={<span>Min Quorum</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fsn(5000000)}
              valueSize="big"
              footer={<span>Min Diff</span>}
            />
          </div>
        </div>

        <div className={styles.divider} />

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
              isReadonly
            />
          </div>

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
          </div>
        </div>
      </div>
    </SidebarScroll>
  );
};

export default VoteForm;
