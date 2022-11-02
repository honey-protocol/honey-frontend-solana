import { FC, useState } from 'react';
import * as styles from './GovernanceDescription.css';
import { formatNumber } from '../../../helpers/format';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import ReactMarkdown from 'react-markdown';
import HoneyButton from 'components/HoneyButton/HoneyButton';

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

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
