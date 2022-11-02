import React, { useCallback, useState } from 'react';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';
import * as styles from './AddOracleStep.css';

interface AddOracleStepProps {
  setOracle: any;
}

export const AddOracleStep = (props: AddOracleStepProps) => {
  const { setOracle } = props;
  const [value, setValue] = useState<string>('');
  return (
    <>
      <div className={styles.tabTitle}>
        <TabTitle
          title="Oracle"
          tooltip={<HoneyTooltip tooltipIcon placement="top" label={'Mock'} />}
        />
      </div>

      <HoneyInputWithLabel
        label="Oracle"
        placeholder="Oracle"
        onChange={e => setOracle(e.target.value)}
        allowClear
      />
    </>
  );
};
