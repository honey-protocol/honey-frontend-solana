import * as styles from './HoneyInputWithLabel.css';
import { HoneyInput } from '../HoneyInput/HoneyInput';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { HoneyInputWithLabelProps } from './types';
import { noop } from 'lodash';

export const HoneyInputWithLabel: FC<HoneyInputWithLabelProps> = props => {
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const {
    forceLabel,
    label,
    placeholder,
    onChange,
    onFocus = noop,
    onBlur = noop,
    ...rest
  } = props;

  useEffect(() => {
    if (forceLabel) {
      setIsLabelVisible(forceLabel);
    }
  }, [forceLabel]);

  const _onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.length && !forceLabel) {
      setIsLabelVisible(false);
    }

    onBlur(e);
  };

  const _onFocus = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLabelVisible(true);
    onFocus(e);
  };

  return (
    <div className={styles.honeyInputWithLabel}>
      {isLabelVisible && (
        <div className={styles.labelContainer}>
          <div className={styles.label}>{label}</div>
        </div>
      )}
      <HoneyInput
        onFocus={_onFocus}
        onBlur={_onBlur}
        placeholder={!forceLabel ? placeholder : ''}
        onChange={onChange}
        className={styles.input}
        allowClear
        {...rest}
      />
    </div>
  );
};
