import React from 'react';
import { startCase } from 'lodash';
import { BN } from '@project-serum/anchor';
import type { ProgramAccount } from '@saberhq/token-utils';
import type { SmartWalletTransactionData } from '@gokiprotocol/client';
import {
  ProposalData,
  getProposalState,
  PROPOSAL_STATE_LABELS,
  ProposalState
} from '@tribecahq/tribeca-sdk';

import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import { Proposal } from 'contexts/GovernanceProvider';
import { useGokiTransactionData } from 'helpers/parser';
import SectionTitle from 'components/SectionTitle/SectionTitle';

import * as styles from '../../VoteForm.css';

const ZERO = new BN(0);

interface Props {
  className?: string;
  proposalInfo?: Proposal | null;
}

interface ProposalEvent {
  title: string;
  date: Date;
  link?: string | null;
}

export const makeDate = (num: BN): Date => new Date(num.toNumber() * 1_000);

const extractEvents = (
  proposalData: ProposalData,
  tx?: ProgramAccount<SmartWalletTransactionData>
): ProposalEvent[] => {
  const events: ProposalEvent[] = [];
  if (!proposalData.canceledAt.eq(ZERO)) {
    events.push({ title: 'Canceled', date: makeDate(proposalData.canceledAt) });
  }
  if (!proposalData.activatedAt.eq(ZERO)) {
    events.push({
      title: 'Activated',
      date: makeDate(proposalData.activatedAt)
    });
  }
  if (!proposalData.createdAt.eq(ZERO)) {
    events.push({ title: 'Created', date: makeDate(proposalData.createdAt) });
  }
  if (!proposalData.queuedAt.eq(ZERO)) {
    events.push({
      title: 'Queued',
      date: makeDate(proposalData.queuedAt),
      link: tx
        ? `https://goki.so/#/wallets/${tx.account.smartWallet.toString()}/tx/${tx.account.index.toString()}`
        : null
    });
  }
  if (
    !proposalData.votingEndsAt.eq(ZERO) &&
    makeDate(proposalData.votingEndsAt) <= new Date()
  ) {
    // TODO: update quorum
    const state = getProposalState({ proposalData });
    events.push({
      title: startCase(
        PROPOSAL_STATE_LABELS[
          state === ProposalState.Queued ? ProposalState.Succeeded : state
        ]
      ),
      date: makeDate(proposalData.votingEndsAt)
    });
  }
  if (tx?.account.executedAt.gt(new BN(0))) {
    events.push({
      title: 'Executed',
      date: makeDate(tx.account.executedAt),
      link: tx
        ? `https://goki.so/#/wallets/${tx.account.smartWallet.toString()}/tx/${tx.account.index.toString()}`
        : null
    });
  }
  return events.sort((a, b) => (a.date < b.date ? -1 : 1));
};

const ProposalHistory: React.FC<Props> = ({ proposalInfo }: Props) => {
  const { data: tx } = useGokiTransactionData(
    !proposalInfo?.data.queuedAt.eq(ZERO)
      ? proposalInfo?.data.queuedTransaction
      : null
  );
  const events = proposalInfo
    ? extractEvents(proposalInfo.data, tx ?? undefined)
    : [];

  return (
    <div>
      <SectionTitle title="History" />
      {events.map((event, i) => (
        <div className={styles.row} key={i}>
          <InfoBlock
            title={event.date.toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
            value={`Proposal was ${event.title}`}
          />
        </div>
      ))}
    </div>
  );
};

export default ProposalHistory;
