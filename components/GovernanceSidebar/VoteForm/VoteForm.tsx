import { FC, useState } from 'react';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { HoneySlider } from '../../HoneySlider/HoneySlider';
import * as styles from './VoteForm.css';
import { formatNumber } from '../../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { HoneyButtonTabs } from '../../HoneyButtonTabs/HoneyButtonTabs';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';

type RepayFormProps = {};

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const VoteForm: FC<RepayFormProps> = () => {
  type VoteType = 'vote_for' | 'vote_against';
  const [voteType, setVoteType] = useState<VoteType>('vote_for');

  // Put your validators here
  const isRepayButtonDisabled = () => {
    return false;
  };

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary">Close</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={isRepayButtonDisabled()}
              isFluid={true}
            >
              Vote for
            </HoneyButton>
          </div>
        </div>
      }
    >
      <div className={styles.depositForm}>
        <div className={styles.tabTitle}>
          Upgrade the StarkProxy smart contract
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message="Discuss about this proposal on forum"
              link="https://google.com"
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value="Voting"
              valueSize="big"
              footer={<span>Status</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value="10m"
              valueSize="big"
              footer={<span>Min Quorum</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value="5m"
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
            <InfoBlock value="31,948,720.03" footer={<span>Voted for</span>} />
            <HoneySlider
              currentValue={200}
              maxValue={1000}
              minAvailableValue={0}
              isReadonly
            />
          </div>
          <div className={styles.gridCell}>
            <InfoBlock value="31,491" footer={<span>Voted against</span>} />
            <HoneySlider
              currentValue={200}
              maxValue={1000}
              minAvailableValue={0}
              isReadonly
            />
          </div>

          <div className={styles.gridCell}>
            <InfoBlock
              value="8,120.19"
              footer={<span>Your voting power</span>}
            />
            <HoneySlider
              currentValue={200}
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
