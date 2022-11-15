import React, { useCallback, useState } from 'react';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import SectionTitle from '../../SectionTitle/SectionTitle';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';
import * as styles from './AddOracleStep.css';

export const AddOracleStep = () => {
  const [value, setValue] = useState<string>('');
  return (
    <>
      <div className={styles.SectionTitle}>
        <SectionTitle
          title="Oracle"
          tooltip={<HoneyTooltip tooltipIcon placement="top" title={'Mock'} />}
        />
      </div>

      <HoneyInputWithLabel
        label="Oracle"
        placeholder="Oracle"
        onChange={e => setValue(e.target.value)}
        allowClear
      />
    </>
  );
};
