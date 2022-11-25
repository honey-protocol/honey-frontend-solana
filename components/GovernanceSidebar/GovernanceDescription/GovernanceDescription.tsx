import ReactMarkdown from 'react-markdown';

// import { formatNumber } from '../../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import { Proposal } from 'contexts/GovernanceProvider';

import * as styles from './GovernanceDescription.css';

// const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const GovernanceDescription = ({
  proposalInfo,
  setActiveTab
}: {
  proposalInfo: Proposal;
  setActiveTab: Function;
}) => {
  return (
    <SidebarScroll
      footer={
        <div style={{ width: '100%' }}>
          <HoneyButton
            onClick={() => setActiveTab('vote')}
            variant="secondary"
            block
          >
            Return
          </HoneyButton>
        </div>
      }
    >
      <div className={styles.governanceDescription}>
        <div>{proposalInfo.meta?.title ?? ''}</div>

        <ReactMarkdown className={styles.markdown} linkTarget="_blank">
          {proposalInfo.meta?.descriptionLink ?? ''}
        </ReactMarkdown>
      </div>
    </SidebarScroll>
  );
};

export default GovernanceDescription;
