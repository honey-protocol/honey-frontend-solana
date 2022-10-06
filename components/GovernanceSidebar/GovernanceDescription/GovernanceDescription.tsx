import { FC, useState } from 'react';
import * as styles from './GovernanceDescription.css';
import { formatNumber } from '../../../helpers/format';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import ReactMarkdown from 'react-markdown';

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const GovernanceDescription = (props: { description: string }) => {
  return (
    <SidebarScroll>
      <div className={styles.governanceDescription}>
        {/* <div className={styles.articleWrapper}>
          <div className={styles.articleTitle}>Simple Summary</div>
          <div className={styles.articleDescription}>
            Upgrade StarkProxy smart contracts to support deposit cancellation
            and recovery.
          </div>
        </div>

        <div className={styles.articleWrapper}>
          <div className={styles.articleTitle}>Abstract</div>
          <div className={styles.articleDescription}>
            When depositing USDC to the dYdX Layer 2 exchange, the funds are
            held in a bridge contract while waiting for the deposit to be
            processed by the L2 sequencer and prover. While funds are on the
            bridge awaiting confirmation, the depositor can initiate a
            time-locked recovery process to cancel the deposit. This
            functionality is not currently supported by the Stark Proxy smart
            contracts which manage the funds borrowed by market makers from the
            Liquidity Module staking pool. These Stark Proxy smart contracts
            should be upgraded to support deposit cancelation and recovery.
          </div>
        </div>

        <div className={styles.articleWrapper}>
          <div className={styles.articleTitle}>Motivation</div>
          <div className={styles.articleDescription}>
            On October 27, 2021 09:37:37 AM +UTC, we (Wintermute) borrowed 50
            million USDC (transaction here) from the Liquidity Staking Pool and
            attempted to deposit the funds to our trading account on the dYdX
            exchange. We had to send deposit programmatically because the client
            provided by the dYdX Foundation team does not support wallet-connect
            yet. Unfortunately, the wrong “vaultId” parameter was passed in the
            call to “depositToExchange” (transaction here). Because this
            “vaultId” did not correspond to our STARK key, the deposit was
            invalid and could not be confirmed on L2. The 50M USDC are safely
            held by the dYdX L2 exchange smart contract and can be reclaimed by
            the StarkProxy contract. However, to reclaim the funds, the
            StarkProxy contract must call “depositCancel” and “depositReclaim”
            on the L2 exchange smart contract. Upgrading these smart contracts
            would allow us to recover the 50M USDC and ensure that other market
            makers can safely make use of the Liquidity Staking Pool.
          </div>
        </div> */}

        <ReactMarkdown className={styles.markdown} linkTarget="_blank">
          {props.description}
        </ReactMarkdown>
      </div>
    </SidebarScroll>
  );
};

export default GovernanceDescription;
