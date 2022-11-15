import { style } from '@vanilla-extract/css';
import { Space, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import * as styles from './CustomDropdown.css';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined
} from '@ant-design/icons';
import cs from 'classnames';

const { Text } = Typography;

type Option = {
  value: string;
  title: string;
};

interface CustomDropdownProps {
  options: Option[];
  onChange: (value: string) => void;
}

const CustomDropdown = (props: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.options[0]);
  const optionsContainerRef = useRef(null);
  const onSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    props.onChange(option.value);
  };

  useEffect(() => {
    // @ts-ignore
    window.onclick = event => {
      if (isOpen && event.target !== optionsContainerRef.current) {
        setIsOpen(false);
      }
    };
    return () => {
      window.onclick = null;
    };
  }, [isOpen, setIsOpen, optionsContainerRef]);

  return (
    <div className={cs(styles.dropdown, { [styles.dropdownActive]: isOpen })}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={styles.dropdownFilterSelected}
      >
        <Space
          direction="horizontal"
          style={{ justifyContent: 'space-between' }}
        >
          <Text>{selectedOption.title}</Text>
          {!isOpen ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </Space>
      </div>
      <div
        style={{ display: isOpen ? 'block' : 'none' }}
        className={styles.dropdownSelect}
        ref={optionsContainerRef}
      >
        {props.options.map(
          (option, i) =>
            option.title.length > 0 &&
            option.value.length > 0 && (
              <div
                onClick={() => onSelect(option)}
                key={option.value}
                className={styles.dropdownSelectOption}
              >
                <Space
                  direction="horizontal"
                  style={{ justifyContent: 'space-between' }}
                >
                  <Text>{option.title}</Text>
                  {option.value === selectedOption.value && <CheckOutlined />}
                </Space>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
