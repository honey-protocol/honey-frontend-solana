import { Dropdown, Menu, Space, Typography } from 'antd';
import React from 'react';
import * as styles from './HeaderDropdownMenu.css';
import { DownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DownIcon } from 'icons/DownIcon';

const { Title } = Typography;

const HeaderDropdownMenu = () => {
  const menu = (
    <Menu
      selectable
      items={[
        {
          key: '1',
          label: (
            <Link href="/dashboard" passHref>
              <a>Dashboard</a>
            </Link>
          )
        }
      ]}
    />
  );

  return (
    <Dropdown overlay={menu}>
      <a onClick={e => e.preventDefault()}>
        <Space>
          <Title level={4} type="secondary" className={styles.title}>
            Markets
          </Title>
          <DownIcon />
        </Space>
      </a>
    </Dropdown>
  );
};

export default HeaderDropdownMenu;
