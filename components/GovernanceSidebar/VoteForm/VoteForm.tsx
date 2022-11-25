import React, { FC, useEffect, useMemo, useState } from 'react';
import cs from 'classnames';
import invariant from 'tiny-invariant';
import { noop } from 'lodash';
import { sleep } from '@saberhq/token-utils';
import {
  ProposalState,
  PROPOSAL_STATE_LABELS,
  VoteSide
} from '@tribecahq/tribeca-sdk';

import { VoteFormProps } from './types';
import ProposalVote, { VoteType } from './Proposals/ProposalVote/ProposalVote';
import ProposalQueue from './Proposals/ProposalQueue/ProposalQueue';
import ProposalActivate from './Proposals/ProposalActivate/ProposalActivate';
import ProposalHistory from './Proposals/ProposalHistory/ProposalHistory';
import SectionTitle from 'components/SectionTitle/SectionTitle';

import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import useToast from 'hooks/useToast';
import {
  useLocker,
  useProposalWithKey,
  useVote,
  useGovernance
} from 'hooks/useVeHoney';
import { formatNumber } from 'helpers/format';

import { questionIcon } from 'styles/icons.css';
import * as styles from './VoteForm.css';

const { formatShortName: fsn } = formatNumber;

const VoteForm: FC<VoteFormProps> = (props: VoteFormProps) => {
  const { proposalInfo, setSidebarMode, onCancel } = props;

  const { reload } = useGovernance();
  const {
    escrow,
    votingPower,
    minActivationThreshold,
    isActivatiable,
    activateProposal,
    castVote
  } = useLocker();
  const { vote } = useVote(proposalInfo.pubkey);
  const { earliestActivationTime } = useProposalWithKey(proposalInfo.pubkey);
  const { toast, ToastComponent } = useToast();

  const [voteType, setVoteType] = useState<VoteType>('vote_for');
  const [hasVoted, setHasVoted] = useState<boolean>(!!vote?.data.side);

  const side = useMemo(
    () =>
      vote?.data.side ||
      (voteType === 'vote_for' ? VoteSide.For : VoteSide.Against),
    [vote]
  );

  // useEffect(() => {
  //   if (!earliestActivationTime) return;
  //   const remainingTime = earliestActivationTime.getTime() - Date.now();
  //   const timeout = setTimeout(() => {
  //     void reload?.();
  //   }, remainingTime + 1);
  //   return () => clearTimeout(timeout);
  // }, [earliestActivationTime]);

  const handleActivateProposal = async () => {
    try {
      if (!proposalInfo) return;
      toast.processing();
      invariant(escrow);
      await activateProposal(proposalInfo.pubkey);
      await sleep(1_000);
      await reload?.();
      noop();
      toast.success('Successfully activated proposal');
    } catch (error) {
      console.log(error);
      toast.error('Failed to activate proposal');
    } finally {
      toast.clear();
    }
  };

  // FOR VOTING
  const handleVote = async () => {
    try {
      toast.processing();
      if (!proposalInfo) return toast.error('No proposal info');

      invariant(escrow && side);
      await castVote(proposalInfo.pubkey, side);
      setHasVoted(true);
      toast.success('Vote Success');
    } catch (error) {
      console.log(error);
      toast.error('Vote error');
    }
  };

  // TODO: FOR QUEUING
  const handleQueueProposal = async () => {
    // if (!proposalInfo) return;
    // invariant(governorW);
    // const tx = await governorW.queueProposal({
    //   index: new BN(proposalInfo.index)
    // });
    // const { pending, success } = await handleTX(tx, 'Queue Proposal');
    // if (!pending || !success) {
    //   return;
    // }
    // await pending.wait();
    // noop();
  };

  // TODO: FOR EXECUTING PROPOSAL
  const handleExecuteProposal = async () => {};

  const votingPowerNeededMore = useMemo(() => {
    if (!minActivationThreshold) return 0;

    if (!votingPower) return minActivationThreshold.asNumber;

    if (votingPower.greaterThan(minActivationThreshold)) return 0;

    return minActivationThreshold.asNumber - votingPower.asNumber;
  }, [minActivationThreshold, votingPower]);

  const getBtnDetails = (): {
    title: string;
    onClick: Function;
    disabled?: boolean;
  } => {
    if (!proposalInfo) return { title: '', onClick: () => {} };
    switch (proposalInfo.status) {
      case ProposalState.Draft:
        return {
          title: isActivatiable ? 'Activate' : 'Not enough vehoney',
          onClick: isActivatiable ? activateProposal : () => {},
          disabled: Boolean(
            (earliestActivationTime && earliestActivationTime > new Date()) ||
              !isActivatiable
          )
        };
      case ProposalState.Active:
        return {
          title: `Vote ${voteType === 'vote_for' ? 'for' : 'against'}`,
          onClick: handleVote
        };
      case ProposalState.Succeeded:
        return {
          title: 'Queue proposal',
          onClick: handleQueueProposal
        };
      case ProposalState.Queued:
        return {
          title: 'Execute proposal',
          onClick: handleExecuteProposal,
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

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div>
            {proposalInfo.status === ProposalState.Draft && !isActivatiable && (
              <div
                onClick={() => setSidebarMode('get_vehoney')}
                className={styles.row}
              >
                <HoneyWarning
                  message={`You need ${votingPowerNeededMore} more veHONEY to activate this proposal. Lock more HONEY to earn them!`}
                />
              </div>
            )}
            <div className={styles.buttons}>
              <div className={styles.smallCol}>
                <HoneyButton onClick={() => onCancel()} variant="secondary">
                  Close
                </HoneyButton>
              </div>
              <div className={styles.bigCol}>
                <HoneyButton
                  variant="primary"
                  disabled={getBtnDetails().disabled}
                  block
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
        <SectionTitle title={proposalInfo?.meta?.title || '--'} />
        <div className={styles.row}>
          <HoneyWarning
            message="Discuss about this proposal on forum"
            link={proposalInfo.meta?.descriptionLink
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
                proposalInfo.status === ProposalState.Active
                  ? 'Voting'
                  : PROPOSAL_STATE_LABELS[proposalInfo.status || 0]
              }
              valueColor={
                proposalInfo.status === ProposalState.Succeeded
                  ? 'green'
                  : undefined
              }
              valueSize="normal"
              footer={<span>Status</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fsn(10000000)}
              valueSize="big"
              footer={
                <span>
                  Min Quorum <span className={questionIcon} />
                </span>
              }
              toolTipLabel="Tooltip label for Min Quorum"
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fsn(5000000)}
              valueSize="big"
              footer={
                <span>
                  Min Diff <span className={questionIcon} />
                </span>
              }
              toolTipLabel="Label for Min Diff"
            />
          </div>
        </div>

        {proposalInfo.status !== ProposalState.Succeeded && (
          <div className={styles.divider} />
        )}
        <div className={styles.row}>
          {proposalInfo.status === ProposalState.Draft && (
            <ProposalActivate proposalInfo={proposalInfo} />
          )}
          {proposalInfo.status === ProposalState.Active && (
            <ProposalVote
              proposalInfo={proposalInfo}
              voteType={voteType}
              setVoteType={setVoteType}
              votingPower={votingPower}
            />
          )}
          {proposalInfo.status === ProposalState.Succeeded && (
            <ProposalQueue proposalInfo={proposalInfo} />
          )}
          {/* {proposalInfo.status === ProposalState.Queued &&
            !proposalInfo.status && (
              <ProposalExecute proposalInfo={proposalInfo} />
            )} */}
        </div>
        <div className={styles.divider} />
        {/* <ProposalHistory proposalInfo={proposalInfo} /> */}
      </div>
    </SidebarScroll>
  );
};

export default VoteForm;
