import React, { FC } from 'react';
import { Checkbox, CheckboxProps } from 'antd';
import c from 'classnames';
import * as styles from './HoneyCheckbox.css'

export const HoneyCheckbox: FC<CheckboxProps> = ({ className, ...props }) => {
  return (
    <div
      className={c(className, styles.honeyCheckbox)}
    >
      <Checkbox {...props}>{props.children}</Checkbox>
    </div>
  );
};
