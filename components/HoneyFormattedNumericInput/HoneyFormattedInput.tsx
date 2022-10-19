import React from 'react';
import * as styles from './HoneyFormattedNumericInput.css';
import c from 'classnames';
import { HoneyFormattedInputProps } from './types';
import { InputNumber } from 'antd';

const HoneyFormattedNumericInput = (props: HoneyFormattedInputProps) => {
  const { className, ...rest } = props;
  return (
    <InputNumber
      {...rest}
      controls={false}
      className={c(styles.honeyFormattedInput, className)}
    />
  );
};

export default HoneyFormattedNumericInput;
