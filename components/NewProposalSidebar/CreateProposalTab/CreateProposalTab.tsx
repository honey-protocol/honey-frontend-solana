import React, { useMemo, useState } from 'react';
import { Transaction } from '@solana/web3.js';
import { extractErrorMessage } from '@saberhq/sail';

import SectionTitle from 'components/SectionTitle/SectionTitle';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import { HoneyTextArea } from 'components/HoneyTextArea/HoneyTextArea';
import useToast from 'hooks/useToast';
import { useProposals } from 'hooks/useVeHoney';

import * as styles from './CreateProposalTab.css';

const CreateProposalTab = (props: { onCancel: Function }) => {
  const { toast, ToastComponent } = useToast();

  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [discussionLinkValue, setDiscussionLinkValue] = useState('');

  const { createProposal, createProposalMeta } = useProposals();

  const [txRaw, _setTxRaw] = useState<string>('');
  // const [actionType, setActionType] = useState<ActionType>('Memo');
  // const [theError, setError] = useState<string | null>(null);

  const { tx } = useMemo(() => {
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

  // if (!smartWallet || !ownerInvokerKey) {
  //   return <Spinner />;
  // }

  // Put your validators here
  const isCreateProposalButtonDisabled = () => {
    return false;
  };

  // const ctx = { locker: lockerData?.publicKey, governor, minter };

  const doProposeTransaction = async () => {
    try {
      toast.processing();
      // invariant(tribecaMut);
      // const gov = new GovernorWrapper(tribecaMut, governor!);
      const { proposal: proposalKey } = await createProposal(
        tx?.instructions ?? []
      );
      await createProposalMeta(
        proposalKey,
        titleValue,
        discussionLinkValue
          ? `${descriptionValue}\n\n[View Discussion](${discussionLinkValue})`
          : descriptionValue
      );
      toast.success('New proposal created');
    } catch (error) {
      toast.error('Error creating new proposal');
    }
  };

  // const actor = smartWallet;
  // const currentAction = ACTIONS.find(action => action.title === actionType);

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
        <SectionTitle title="Create new proposal" />

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

        {/*  <SectionTitle title="Proposed Action" />

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
        </div> */}

        {/* {currentAction && (
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
        )} */}
      </div>
    </SidebarScroll>
  );
};

export default CreateProposalTab;
