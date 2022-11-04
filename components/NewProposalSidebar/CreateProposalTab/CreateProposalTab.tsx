import React, { FC, useMemo, useState } from 'react';
import * as styles from './CreateProposalTab.css';
import { formatNumber } from '../../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { HoneyTextArea } from '../../HoneyTextArea/HoneyTextArea';
import invariant from 'tiny-invariant';
import { useSDK } from 'helpers/sdk';
import { GovernorWrapper } from '@tribecahq/tribeca-sdk';
import { useGovernor, useGovernorParams } from 'hooks/tribeca/useGovernor';
import { extractErrorMessage, useSail } from '@saberhq/sail';
import { Transaction } from '@solana/web3.js';
import CustomDropdown from 'components/CustomDropdown/CustomDropdown';
import { ACTIONS, ActionType } from 'actions/types';
import { HelperCard } from 'components/common/HelperCard';
import { Spinner, Text } from 'degen';
import { useExecutiveCouncil } from 'hooks/tribeca/useExecutiveCouncil';
import useToast from 'hooks/useToast';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import cs from 'classnames';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const CreateProposalTab = (props: { onCancel: Function }) => {
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [discussionLinkValue, setDiscussionLinkValue] = useState('');

  const { tribecaMut } = useSDK();
  const { handleTX } = useSail();
  const [txRaw, setTxRaw] = useState<string>('');
  const [actionType, setActionType] = useState<ActionType>('Memo');
  const [theError, setError] = useState<string | null>(null);
  const { smartWallet, lockerData, governor, minter } = useGovernor();
  const { ownerInvokerKey } = useExecutiveCouncil();
  const { toast, ToastComponent } = useToast();

  const { tx, error: parseError } = useMemo(() => {
    try {
      const buffer = Buffer.from(txRaw, 'base64');
      const tx = Transaction.from(buffer);
      if (tx.instructions.length === 0) {
        return { error: 'Transaction cannot be empty' };
      }
      return { tx };
    } catch (e) {
      return {
        error: extractErrorMessage(e)
      };
    }
  }, [txRaw]);

  if (!smartWallet || !ownerInvokerKey) {
    return <Spinner />;
  }

  // Put your validators here
  const isCreateProposalButtonDisabled = () => {
    return false;
  };

  const ctx = { locker: lockerData?.publicKey, governor, minter };

  const proposal = {
    title: titleValue,
    description: discussionLinkValue
      ? `${descriptionValue}\n\n[View Discussion](${discussionLinkValue})`
      : descriptionValue,
    instructions: tx?.instructions ?? []
  };

  const doProposeTransaction = async () => {
    try {
      toast.processing();
      invariant(tribecaMut);
      const gov = new GovernorWrapper(tribecaMut, governor!);
      const createProposal = await gov.createProposal({
        instructions: proposal.instructions
      });
      const createProposalMetaTX = await gov.createProposalMeta({
        proposal: createProposal.proposal,
        title: proposal.title,
        descriptionLink: proposal.description
      });
      for (const txEnv of [createProposal.tx, createProposalMetaTX]) {
        const { pending, success } = await handleTX(txEnv, 'Create Proposal');
        if (!success || !pending) {
          return;
        }
        await pending.wait();
      }
      toast.success('New proposal created');
      // notify({
      //   message: `Proposal ${`000${createProposal.index.toString()}`.slice(
      //     -4
      //   )} created`
      // // });
    } catch (error) {
      toast.error('Error creating new proposal');
    }
  };

  const actor = smartWallet;
  const currentAction = ACTIONS.find(action => action.title === actionType);

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="secondary" onClick={() => props.onCancel()}>
                Cancel
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={isCreateProposalButtonDisabled()}
                block
                onClick={doProposeTransaction}
              >
                Create proposal
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.createProposalTab}>
        <TabTitle title='Create new proposal' />

        <div className={styles.titleInput}>
          <HoneyTextArea
            isShowCounter
            title="Title"
            maxLength={140}
            placeholder="A short summary of your proposal"
            value={titleValue}
            onChange={e => setTitleValue(e.target.value)}
          />
        </div>

        <div className={styles.descriptionInput}>
          <HoneyTextArea
            isShowCounter
            title="Description"
            maxLength={750}
            placeholder={`Describe your proposal \nMarkdown is available`}
            value={descriptionValue}
            onChange={e => setDescriptionValue(e.target.value)}
          />
        </div>

        <div className={styles.discussionInput}>
          <HoneyTextArea
            title="URL to discussion"
            placeholder="https://forum.honey.finance/t"
            value={discussionLinkValue}
            onChange={e => setDiscussionLinkValue(e.target.value)}
          />
        </div>

        <TabTitle title='Proposed Action' />

        <div className={cs(styles.row, styles.mb12)}>
          <CustomDropdown
            onChange={value => {
              setActionType(value as ActionType);
              setError(null);
              setTxRaw('');
            }}
            options={ACTIONS.map(({ title, isEnabled }) => {
              if (isEnabled && ctx && !isEnabled(ctx)) {
                return { title: '', value: '' };
              }
              return {
                title,
                value: title
              };
            })}
          />
        </div>

        {currentAction && (
          <>
            {currentAction.description && (
              <div className={styles.row}>
                <HoneyWarning message={currentAction.description} />
              </div>
            )}
            <currentAction.Renderer
              actor={actor}
              // payer={ownerInvokerKey}
              ctx={ctx}
              txRaw={txRaw}
              setError={setError}
              setTxRaw={setTxRaw}
            />
          </>
        )}
      </div>
    </SidebarScroll>
  );
};

export default CreateProposalTab;
