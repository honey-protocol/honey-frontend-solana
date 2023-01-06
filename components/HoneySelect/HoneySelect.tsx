import * as styles from './HoneySelect.css';
import { Select, SelectProps } from 'antd';
import { vars } from 'styles/theme.css';
import { DownIcon } from 'icons/DownIcon';

export const HoneySelect = (props: SelectProps) => {
  return (
    <Select
      {...props}
      className={styles.honeySelect}
      dropdownClassName={styles.honeySelectDropdownList}
      suffixIcon={<DownIcon fill={vars.colors.textSecondary} />}
    ></Select>
  );
};
