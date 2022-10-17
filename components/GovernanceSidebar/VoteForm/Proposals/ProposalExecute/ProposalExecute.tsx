import { ProposalInfo } from 'hooks/tribeca/useProposals';
import Link from 'next/link';
import React from 'react';
import { useGokiTransactionData } from 'helpers/parser';
import { useExecutiveCouncil } from 'hooks/tribeca/useExecutiveCouncil';
import { mapSome, useTXHandlers } from '@saberhq/sail';
import { gokiTXLink, tsToDate } from 'helpers/utils';
import Countdown from 'react-countdown';
import * as styles from '../../VoteForm.css';
import { Space } from 'antd';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { ApiOutlined } from '@ant-design/icons';

interface ProposalExecuteProps {
  proposalInfo: ProposalInfo;
}
const ProposalExecute = (props: ProposalExecuteProps) => {
  const { proposalInfo } = props;
  const { ecWallet, isMemberOfEC } = useExecutiveCouncil();
  const { data: gokiTransactionData } = useGokiTransactionData(
    proposalInfo.proposalData.queuedTransaction
  );

  if (!gokiTransactionData) {
    return <></>;
  }

  const votingEndedAt = tsToDate(proposalInfo.proposalData.queuedAt);
  const eta = tsToDate(gokiTransactionData.account.eta);
  const gracePeriodEnd = mapSome(ecWallet.data, d =>
    !gokiTransactionData.account.eta.isNeg()
      ? tsToDate(gokiTransactionData.account.eta.add(d.account.gracePeriod))
      : null
  );

  const etaSurpassed = eta <= new Date();
  const gracePeriodSurpassed = mapSome(gracePeriodEnd, g => g <= new Date());

  return (
    <Space direction="vertical" size="small" align="start">
      {/* <ProseSmall> */}
      <div className={styles.description}>
        The proposal was queued on{' '}
        <span className={styles.highlight}>
          {votingEndedAt.toLocaleString(undefined, {
            timeZoneName: 'short'
          })}
        </span>
        .
      </div>
      {gracePeriodSurpassed ? (
        <div className={styles.description}>
          The proposal execution period expired on{' '}
          {gracePeriodEnd?.toLocaleString(undefined, {
            timeZoneName: 'short'
          })}
          . This proposal may no longer be executed by the Executive Council.
        </div>
      ) : etaSurpassed ? (
        <div className={styles.description}>
          It may now be executed by any member of the{' '}
          <Link href={'details'}>Executive Council</Link> at any time before{' '}
          {gracePeriodEnd?.toLocaleString(undefined, {
            timeZoneName: 'short'
          })}
          .
        </div>
      ) : (
        <div className={styles.description}>
          It may be executed by any member of the{' '}
          <Link href={'details'}>Executive Council</Link> in{' '}
          <Countdown date={eta} />.
        </div>
      )}
      <Link href={gokiTXLink(gokiTransactionData.account)} passHref>
        <HoneyButton variant="text" size="small">
          View on Goki <ApiOutlined />
        </HoneyButton>
      </Link>
      {/* </ProseSmall> */}
      {isMemberOfEC && (
        <div>
          {/* {gracePeriodSurpassed && (
						<AsyncConfirmButton
							modal={{
								title: 'Revive Proposal via Emergency DAO',
								contents: (
									<div tw="prose prose-light prose-sm">
										<p>
											You are about to propose the following{' '}
											{pluralize(
												'instruction',
												gokiTransactionData.account.instructions.length
											)}{' '}
											on behalf of the emergency DAO:
										</p>
										<div>
											<EmbedTX txKey={gokiTransactionData.publicKey} />
										</div>
									</div>
								)
							}}
							disabled={!governorW || !ecWallet.data || !etaSurpassed}
							tw="w-3/4"
							variant="primary"
							onClick={async () => {
								invariant(
									governorW && sdkMut && smartWallet && ecWallet.data
								);

								const daoWallet = await sdkMut.loadSmartWallet(smartWallet);
								const emergencyDAOWallet = await sdkMut.loadSmartWallet(
									emergencyDAO
								);

								const { tx: innerTx } = await daoWallet.newTransaction({
									proposer: emergencyDAOWallet.key,
									instructions: proposal.proposalData.instructions.map(
										ix =>
											new TransactionInstruction({
												...ix,
												data: Buffer.from(ix.data)
											})
									)
								});
								const { tx } = await emergencyDAOWallet.newTransaction({
									instructions: innerTx.instructions
								});
								invariant(tx.instructions[0]);
								await signAndConfirmTX(tx, `Revive Proposal`);
							}}
						>
							{!etaSurpassed ? (
								<>
									<Box marginRight="1">
										<Text as="span">ETA in</Text>
									</Box>
									<Countdown date={eta} />
								</>
							) : (
								'Revive Proposal via Emergency DAO'
							)}
						</AsyncConfirmButton>
					)} */}
          {/* <ExecuteProposalButton
            tx={gokiTransactionData}
            onActivate={onActivate}
          /> */}
        </div>
      )}
    </Space>
  );
};

export default ProposalExecute;
