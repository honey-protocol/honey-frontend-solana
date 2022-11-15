import * as styles from './HoneySelect.css';
import {Select, SelectProps} from 'antd';

export const HoneySelect = (props: SelectProps) => {
  return <Select {...props} className={styles.honeySelect} dropdownClassName={styles.honeySelectDropdownList} suffixIcon={
    <div className={styles.openIcon} />
  }></Select>
}