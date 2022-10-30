import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import * as styles from './TabsAndManualForm.css';
import { TabsAndManualFormProps } from './types';
import c from 'classnames';
import HoneyFormattedNumericInput from '../HoneyFormattedNumericInput/HoneyFormattedInput';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import { noop } from 'lodash';
import { isNil } from '../../helpers/utils';

const MAX_VALUE_ERROR = 'Slippage should be 0.1% — 1%';

export const TabsAndManualForm: FC<TabsAndManualFormProps> = ({
  tabs,
  onChange = noop,
  value,
  disabled,
  maxValue,
  tabInnerClassName,
  manualTabText
}) => {
  const [isManualTabSelected, setManualTabSelected] = useState(false);
  const [isManualTabBlurred, setManualTabBlurred] = useState(false);
  const [error, setError] = useState('');

  const tabsRef = useRef<HTMLDivElement>(null);

  const onClick = (val: number) => {
    if (disabled) {
      return;
    }
    setError('');
    setManualTabSelected(false);
    onChange(val);
  };

  useEffect(() => {
    if (isManualTabBlurred) {
      setManualTabSelected(false);
    }
  }, [isManualTabBlurred]);

  const onManualTabFocus = (e: ChangeEvent<HTMLInputElement>) => {
    if (!error.length) {
      onChange(Number(e.target.value));
    }

    if (Number(e.target.value) > maxValue) {
      setError(MAX_VALUE_ERROR);
    }

    setManualTabBlurred(false);
    setManualTabSelected(true);
  };

  const onManualTabBlur = (e: ChangeEvent<HTMLInputElement>) => {
    setManualTabBlurred(true);

    if (!e.target.value || e.target.value === '0') {
      setManualTabSelected(false);
    }
  };

  const onManualTabChange = useCallback(
    (inputValue: ValueType | null) => {
      if (isNil(inputValue)) {
        onChange(undefined);
        setError('');
      }
      onChange(Number(inputValue));
      setError(inputValue! > maxValue ? MAX_VALUE_ERROR : '');
    },
    [maxValue, onChange]
  );

  const onManuallyClick = () => {
    if (disabled) {
      return;
    }
    setManualTabBlurred(false);
    setManualTabSelected(true);
  };

  return (
    <>
      <div className={styles.tabs} ref={tabsRef}>
        {tabs.map(tab => (
          <div
            className={c(styles.tab, tabInnerClassName, {
              [styles.isActive]: value === tab.value && !isManualTabSelected
            })}
            onClick={() => onClick(tab.value)}
            key={`${tab.value}_${tab.title}`}
          >
            {tab.title}
          </div>
        ))}

        <div
          className={c(
            styles.manualInput,
            { [styles.isActive]: isManualTabSelected },
            { [styles.isError]: error }
          )}
        >
          {!isManualTabSelected && (
            <div className={styles.manual} onClick={onManuallyClick}>
              {manualTabText}
            </div>
          )}
          {isManualTabSelected && (
            <HoneyFormattedNumericInput
              className={c(styles.manualInputStyle, {
                [styles.isErrorInput]: error
              })}
              autoFocus
              onFocus={onManualTabFocus}
              onBlur={onManualTabBlur}
              onChange={onManualTabChange}
              bordered={false}
            />
          )}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </>
  );
};

export default TabsAndManualForm;
