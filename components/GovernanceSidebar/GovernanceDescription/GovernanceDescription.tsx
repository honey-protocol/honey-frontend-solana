import ReactMarkdown from 'react-markdown';

// import { formatNumber } from '../../../helpers/format';
import HoneyButton from '../../../components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';

import * as styles from './GovernanceDescription.css';

// const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const GovernanceDescription = (props: {
  description: string;
  setActiveTab: Function;
}) => {
  return (
    <SidebarScroll
      footer={
        <div style={{ width: '100%' }}>
          <HoneyButton
            onClick={() => props.setActiveTab('vote')}
            variant="secondary"
            block
          >
            Return
          </HoneyButton>
        </div>
      }
    >
      <div className={styles.governanceDescription}>
        <ReactMarkdown className={styles.markdown} linkTarget="_blank">
          {props.description}
        </ReactMarkdown>
      </div>
    </SidebarScroll>
  );
};

export default GovernanceDescription;
