import React, { useCallback, useState } from 'react';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import SectionTitle from '../../SectionTitle/SectionTitle';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';
import * as styles from './AddOracleStep.css';
import { PublicKey } from '@solana/web3.js';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';

interface AddOracleStepProps {
  setOracle: any;
}

export const AddOracleStep = (props: AddOracleStepProps) => {
  const { setOracle } = props;

  const onChange = (value: string) => {
    try {
      const pk = new PublicKey(value);
      setOracle(pk);
      console.log('working');
    } catch (e) {}
  };

  const openSwitchboardApp = () => {
    window.open(
      'https://app.switchboard.xyz/',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const openDocs = () => {
    window.open(
      'https://docs.switchboard.xyz/about',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <>
      <div className={styles.SectionTitle}>
        <SectionTitle
          title="Oracle"
          tooltip={<HoneyTooltip tooltipIcon placement="top" title={'Mock'} />}
        />
      </div>

      <span>Create the Switchboard oracle for your NFT collection </span>
      <div className={styles.spacer}></div>

      <HoneyButton block variant="primary" onClick={() => openSwitchboardApp()}>
        Open Switchboard app
      </HoneyButton>
      <div className={styles.spacer}></div>

      <HoneyInputWithLabel
        label="Switchboard oracle"
        placeholder="Switchboard oracle public key"
        onChange={e => onChange(e.target.value)}
        allowClear
      />
    </>
  );
};
