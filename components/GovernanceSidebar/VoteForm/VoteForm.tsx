import { FC, useEffect, useMemo, useState } from 'react';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { HoneySlider } from '../../HoneySlider/HoneySlider';
import * as styles from './VoteForm.css';
import { formatDurationSeconds, formatNumber } from '../../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { HoneyButtonTabs } from '../../HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';
import { VoteFormProps } from './types';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { useUserEscrow } from 'hooks/tribeca/useEscrow';
import { sleep, TokenAmount } from '@saberhq/token-utils';
import invariant from 'tiny-invariant';
import { createMemoInstruction } from '@saberhq/solana-contrib';
import { useSail, useTXHandlers } from '@saberhq/sail';
import { ProposalState, PROPOSAL_STATE_LABELS, VoteSide } from 'helpers/dao';
import useToast from 'hooks/useToast';
import { useVote } from 'hooks/tribeca/useVote';
import { useSDK } from 'helpers/sdk';
import ProposalVote, { VoteType } from './Proposals/ProposalVote/ProposalVote';
import BN from 'bn.js';
import { noop } from 'lodash';
import ProposalQueue from './Proposals/ProposalQueue/ProposalQueue';
import ProposalExecute from './Proposals/ProposalExecute/ProposalExecute';
import ProposalActivate from './Proposals/ProposalActivate/ProposalActivate';
import ProposalHistory from './Proposals/ProposalHistory/ProposalHistory';
import cs from 'classnames';

const { formatShortName: fsn } = formatNumber;

const VoteForm: FC<VoteFormProps> = (props: VoteFormProps) => {
  const [voteType, setVoteType] = useState<VoteType>('vote_for');
  const { proposalInfo, setSidebarMode } = props;
  const { veToken, governorData, minActivationThreshold, governorW } =
    useGovernor();
  const { data: escrow, veBalance, refetch } = useUserEscrow();
  const [reason, setReason] = useState<string>('');
  const { handleTX } = useSail();
  const { sdkMut } = useSDK();
  const { signAndConfirmTX } = useTXHandlers();
  const { toast, ToastComponent } = useToast();

  const { data: myVote } = useVote(
    proposalInfo?.proposalKey,
    sdkMut?.provider.wallet.publicKey
  );
  const [hasVoted, setHasVoted] = useState<boolean>(
    myVote?.accountInfo.data.side !== undefined ? true : false
  );

  const side: VoteSide =
    myVote?.accountInfo.data.side ||
    (voteType === 'vote_for' ? VoteSide.For : VoteSide.Against);

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

  //FOR ACTIVATING A DRAFT PROPOSAL
  const earliestActivationTime = useMemo(
    () =>
      governorData && proposalInfo
        ? new Date(
            proposalInfo?.proposalData.createdAt
              .add(governorData.account.params.votingDelay)
              .toNumber() * 1_000
          )
        : null,
    [governorData, proposalInfo]
  );

  useEffect(() => {
    if (!earliestActivationTime) return;
    const remainingTime = earliestActivationTime.getTime() - Date.now();
    const timeout = setTimeout(() => {
      void refetch();
    }, remainingTime + 1);
    return () => clearTimeout(timeout);
  }, [earliestActivationTime, refetch]);

  const activateProposal = async () => {
    try {
      if (!proposalInfo) return;
      toast.processing();
      invariant(escrow);
      const tx = escrow.escrowW.activateProposal(proposalInfo?.proposalKey);
      await signAndConfirmTX(tx, 'Activate Proposal');
      await sleep(1_000);
      await refetch();
      noop();
      toast.success('Successfully activated proposal');
    } catch (error) {
      console.log(error);
      toast.error('Failed to activate proposal');
    } finally {
      toast.clear();
    }
  };

  const cancelProposal = async () => {
    if (
      governorW &&
      proposalInfo &&
      proposalInfo.proposalData.proposer.equals(
        governorW.provider.wallet.publicKey
      )
    ) {
      const tx = governorW.cancelProposal({
        proposal: proposalInfo.proposalKey
      });
      const handle = await handleTX(tx, 'Cancel Proposal');
      if (!handle.pending) {
        return;
      }
      await handle.pending.wait();
    }
  };

  // FOR VOTING
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

  // FOR QUEUING
  const queueProposal = async () => {
    if (!proposalInfo) return;
    invariant(governorW);
    const tx = await governorW.queueProposal({
      index: new BN(proposalInfo.index)
    });
    const { pending, success } = await handleTX(tx, 'Queue Proposal');
    if (!pending || !success) {
      return;
    }
    await pending.wait();
    noop();
  };

  // FOR EXECUTING PROPOSAL
  const executeProposal = async () => {};

  const getBtnDetails = (): {
    title: string;
    onClick: Function;
    disabled?: boolean;
  } => {
    if (!proposalInfo) return { title: '', onClick: () => {} };
    switch (proposalInfo?.status.state) {
      case ProposalState.Draft:
        return {
          title:
            minActivationThreshold &&
            veBalance?.greaterThan(minActivationThreshold)
              ? 'Activate'
              : 'Not enough vehoney',
          onClick:
            minActivationThreshold &&
            veBalance?.greaterThan(minActivationThreshold)
              ? activateProposal
              : () => {},
          disabled: Boolean(
            (earliestActivationTime && earliestActivationTime > new Date()) ||
              !veBalance?.greaterThan(minActivationThreshold || 0)
          )
        };
      case ProposalState.Active:
        return {
          title: `Vote ${voteType === 'vote_for' ? 'for' : 'against'}`,
          onClick: vote
        };
      case ProposalState.Succeeded:
        return {
          title: 'Queue proposal',
          onClick: queueProposal
        };
      case ProposalState.Queued:
        return {
          title: 'Execute proposal',
          onClick: executeProposal,
          disabled: true
        };
      default:
        return {
          title: '--',
          onClick: () => {},
          disabled: true
        };
    }
  };

  console.log({
    proposalInfo,
    minActivationThreshold,
    veToken,
    earliestActivationTime,
    vePower,
    escrow
  });

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div>
            {proposalInfo?.status.state === ProposalState.Draft &&
              !veBalance?.greaterThan(minActivationThreshold || 0) && (
                <div
                  onClick={() => setSidebarMode('get_vehoney')}
                  className={styles.row}
                >
                  <HoneyWarning
                    message={`You need ${
                      10000 - (veBalance?.asNumber || 0)
                    } more veHONEY to activate this proposal. Lock more HONEY to earn them!`}
                  />
                </div>
              )}
            <div className={styles.buttons}>
              <div className={styles.smallCol}>
                <HoneyButton variant="secondary">Close</HoneyButton>
              </div>
              <div className={styles.bigCol}>
                <HoneyButton
                  variant="primary"
                  disabled={getBtnDetails().disabled}
                  isFluid={true}
                  onClick={() => getBtnDetails().onClick()}
                >
                  {getBtnDetails().title}
                </HoneyButton>
              </div>
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
          <HoneyWarning
            message="Discuss about this proposal on forum"
            link={proposalInfo?.proposalMetaData?.descriptionLink
              .split('(')
              .pop()
              ?.slice(0, -1)}
          />
        </div>
        {hasVoted && (
          <div className={cs(styles.row, styles.hasVoteContainer)}>
            <div>You voted {side === VoteSide.For ? 'for' : 'against'}</div>
          </div>
        )}
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={
                proposalInfo?.status.executed
                  ? 'Executed'
                  : proposalInfo?.status.state === ProposalState.Active
                  ? 'Voting'
                  : PROPOSAL_STATE_LABELS[proposalInfo?.status.state || 0]
              }
              valueSize="big"
              footer={<span>Status</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fsn(10000000)}
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
        {proposalInfo?.status.state !== ProposalState.Active && (
          <>
            {/* <div className={styles.grid}>
              <div className={styles.gridCell}>
                <InfoBlock
                  value={proposalInfo?.proposalData.forVotes.toString() || ''}
                  footer={<span>Voted for</span>}
                />
                <HoneySlider
                  currentValue={
                    proposalInfo?.proposalData.forVotes.toNumber() || 0
                  }
                  maxValue={totalDeterminingVotes?.toNumber() || 0}
                  minAvailableValue={10}
                  isReadonly
                />
              </div>
              <div className={styles.gridCell}>
                <InfoBlock
                  value={
                    proposalInfo?.proposalData.againstVotes.toString() || ''
                  }
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
            </div> */}
            <div className={styles.row}>
              <InfoBlock
                value={vePower?.asNumber.toString() || '0'}
                title={<span>Your voting power</span>}
              />
            </div>
          </>
        )}

        {!proposalInfo?.status.executed && <div className={styles.divider} />}
        <div className={styles.row}>
          {proposalInfo?.status.state === ProposalState.Draft && (
            <ProposalActivate proposalInfo={proposalInfo} />
          )}
          {proposalInfo?.status.state === ProposalState.Active && (
            <ProposalVote
              proposalInfo={proposalInfo}
              voteType={voteType}
              setVoteType={setVoteType}
              vePower={vePower}
            />
          )}
          {proposalInfo?.status.state === ProposalState.Succeeded && (
            <ProposalQueue proposalInfo={proposalInfo} />
          )}
          {proposalInfo?.status.state === ProposalState.Queued &&
            !proposalInfo.status.executed && (
              <ProposalExecute proposalInfo={proposalInfo} />
            )}
        </div>
        <div className={styles.divider} />
        <ProposalHistory proposalInfo={proposalInfo} />
      </div>
    </SidebarScroll>
  );
};

export default VoteForm;
