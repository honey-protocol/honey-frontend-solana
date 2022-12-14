import { FC, useState } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import * as styles from './HoneyTextArea.css';
import { HoneyTextAreaProps } from './types';
import c from 'classnames';
export const HoneyTextArea: FC<HoneyTextAreaProps> = props => {
  const [isActive, setIsActive] = useState(false);
  const {
    value,
    maxLength,
    isShowCounter,
    title,
    placeholder,
    isValueInvalid,
    error
  } = props;
  return (
    <>
      <div
        className={c(styles.honeyTextArea, {
          [styles.activeTextArea]: isActive,
          [styles.invalidValueTextArea]: isValueInvalid
        })}
      >
        {Boolean(isActive || value.length) && (
          <div className={c(styles.title, { [styles.activeTitle]: isActive })}>
            {title}
          </div>
        )}
        <TextArea
          {...props}
          placeholder={isActive ? placeholder : title}
          bordered={false}
          maxLength={maxLength}
          autoSize
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
        {Boolean(isShowCounter && maxLength) && (
          <div
            className={styles.counter}
          >{`${value?.length}/${maxLength}`}</div>
        )}
      </div>
      {Boolean(error) && <div className={styles.errorText}>{error} </div>}
    </>
  );
};
