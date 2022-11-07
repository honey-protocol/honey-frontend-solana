import React, { useEffect, useState } from 'react';
import { Space, Spin, Typography } from 'antd';

import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { formatDurationSeconds } from 'helpers/format';
import { useLocker, useProposalWithKey } from 'hooks/useVeHoney';
import { Proposal, useGovernanceContext } from 'contexts/GovernanceProvider';

import * as icons from 'styles/icons.css';
import * as styles from '../../VoteForm.css';

const { Text } = Typography;
interface ProposalActivateProps {
  proposalInfo: Proposal;
}

const ProposalActivate = (props: ProposalActivateProps) => {
  const { proposalInfo } = props;

  const { governorInfo, lockerInfo } = useGovernanceContext();
  const { minActivationThreshold, votingPower, isActivatiable } = useLocker();
  const { earliestActivationTime } = useProposalWithKey(proposalInfo.pubkey);

  const [remainingTime, setRemainingTiime] = useState(0);

  useEffect(() => {
    if (!earliestActivationTime) return;

    const time = setInterval(() => {
      setRemainingTiime(
        Math.floor((earliestActivationTime.getTime() - Date.now()) / 1000)
      );
    }, 1000);

    return () => clearInterval(time);
  }, [earliestActivationTime]);

  return (
    <Space size="middle">
      <div className={styles.iconContainer}>
        <HexaBoxContainer borderColor="black" shadowColor="brownLight">
          <div className={icons.lampIcon} />
        </HexaBoxContainer>
      </div>
      {!earliestActivationTime || !governorInfo ? (
        <Spin />
      ) : earliestActivationTime > new Date() ? (
        <Space direction="vertical" size={4}>
          <Text className={styles.description}>
            You must wait {formatDurationSeconds(remainingTime)} for this
            proposal to be activated.
          </Text>
          <Text className={styles.description}>
            The proposal may be activated at{' '}
            {earliestActivationTime.toLocaleString(undefined, {
              timeZoneName: 'short'
            })}{' '}
            by anyone who possesses at least{' '}
            {minActivationThreshold?.formatUnits() ?? '-'}.
          </Text>
        </Space>
      ) : isActivatiable ? (
        <Space
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Text className={styles.description}>
            You can activate this proposal
          </Text>
        </Space>
      ) : (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Text className={styles.description}>
            You must have at least{' '}
            <strong>{minActivationThreshold?.formatUnits() ?? '-'}</strong> to
            activate this proposal for voting.
          </Text>
          {votingPower ? (
            <Text className={styles.description}>
              You currently have {votingPower?.formatUnits() ?? '-'}.
            </Text>
          ) : (
            <Text className={styles.description}>
              You currently don&apos;t have any tokens vote locked.
            </Text>
          )}
        </Space>
      )}
    </Space>
  );
};

export default ProposalActivate;
