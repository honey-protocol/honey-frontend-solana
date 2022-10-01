import { FC, useState } from 'react';
import * as styles from './CreateProposalTab.css';
import { formatNumber } from '../../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { HoneyTextArea } from '../../HoneyTextArea/HoneyTextArea';


const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const CreateProposalTab: FC = () => {
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [discussionLinkValue, setDiscussionLinkValue] = useState('');

  // Put your validators here
  const isCreateProposalButtonDisabled = () => {
    return false;
  };

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary">Cancel</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={isCreateProposalButtonDisabled()}
              isFluid={true}
            >
              Create proposal
            </HoneyButton>
          </div>
        </div>
      }
    >
      <div className={styles.createProposalTab}>
        <div className={styles.tabTitle}>Create new proposal</div>

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
      </div>
    </SidebarScroll>
  );
};

export default CreateProposalTab;
