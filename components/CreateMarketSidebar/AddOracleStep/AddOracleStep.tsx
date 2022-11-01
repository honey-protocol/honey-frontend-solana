import React, { useCallback, useState } from 'react';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';
import * as styles from './AddOracleStep.css';

export const AddOracleStep = (setNftOracle: any) => {
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
        onChange={e => setNftOracle(e.target.value)}
        allowClear
      />
    </>
  );
};
