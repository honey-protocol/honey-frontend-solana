import { style } from '@vanilla-extract/css';
import { Space, Spin, Typography } from 'antd';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import { formatDurationSeconds } from 'helpers/format';
import { useUserEscrow } from 'hooks/tribeca/useEscrow';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { ProposalInfo } from 'hooks/tribeca/useProposals';
import React, { useEffect, useMemo } from 'react';
import * as icons from 'styles/icons.css';
import * as styles from '../../VoteForm.css';
import ProposalHistory from '../ProposalHistory/ProposalHistory';

const { Text } = Typography;
interface ProposalActivateProps {
  proposalInfo: ProposalInfo;
}

const ProposalActivate = (props: ProposalActivateProps) => {
  const { proposalInfo } = props;
  const { minActivationThreshold, governorData } = useGovernor();
  const { data: escrow, veBalance, refetch } = useUserEscrow();

  const earliestActivationTime = useMemo(
    () =>
      governorData
        ? new Date(
            proposalInfo.proposalData.createdAt
              .add(governorData.account.params.votingDelay)
              .toNumber() * 1_000
          )
        : null,
    [governorData, proposalInfo.proposalData.createdAt]
  );

  useEffect(() => {
    if (!earliestActivationTime) {
      return;
    }
    const remainingTime = earliestActivationTime.getTime() - Date.now();
    const timeout = setTimeout(() => {
      void refetch();
    }, remainingTime + 1);
    return () => clearTimeout(timeout);
  }, [earliestActivationTime, refetch]);

  return (
    <Space size="middle">
      <div className={styles.iconContainer}>
        <HexaBoxContainer borderColor="black" shadowColor="brownLight">
          <div className={icons.lampIcon} />
        </HexaBoxContainer>
      </div>
      {!earliestActivationTime || !governorData ? (
        <Spin />
      ) : earliestActivationTime > new Date() ? (
        <Space direction="vertical" size={4}>
          <Text className={styles.description}>
            You must wait{' '}
            {formatDurationSeconds(
              governorData.account.params.votingDelay.toNumber()
            )}{' '}
            for this proposal to be activated.
          </Text>
          <Text className={styles.description}>
            The proposal may be activated at{' '}
            {earliestActivationTime?.toLocaleString(undefined, {
              timeZoneName: 'short'
            })}{' '}
            by anyone who possesses at least{' '}
            {minActivationThreshold?.formatUnits()}.
          </Text>
        </Space>
      ) : minActivationThreshold &&
        veBalance?.greaterThan(minActivationThreshold) ? (
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
            <strong>{minActivationThreshold?.formatUnits()}</strong> to activate
            this proposal for voting.
          </Text>
          {veBalance ? (
            <Text className={styles.description}>
              You currently have {veBalance?.formatUnits()}.
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
