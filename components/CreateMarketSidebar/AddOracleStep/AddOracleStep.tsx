import React, { useCallback, useState } from 'react';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import SectionTitle from '../../SectionTitle/SectionTitle';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';
import * as styles from './AddOracleStep.css';
import HoneyButton from 'components/HoneyButton/HoneyButton';

interface AddOracleStepProps {
  setOracle: any;
  oracle: string;
}

export const AddOracleStep = (props: AddOracleStepProps) => {
  const { setOracle, oracle } = props;

  const openSwitchboardApp = () => {
    window.open(
      'https://app.switchboard.xyz/',
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
        onChange={e => setOracle(e.target.value)}
        allowClear
        value={oracle}
      />
    </>
  );
};
