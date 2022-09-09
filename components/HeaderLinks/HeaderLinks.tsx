import { Dropdown, Menu, Space, Typography } from 'antd';
import React from 'react';
import * as styles from './HeaderLinks.css';
import { DownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DownIcon } from 'icons/DownIcon';
import HoneyButton from 'components/HoneyButton/HoneyButton';

const { Title } = Typography;

const links = [
  {
    title: 'DASHBOARD',
    href: '/dashboard'
  },
  {
    title: 'MARKETS',
    href: '/markets'
  },
  {
    title: 'LEND',
    href: '/lend'
  },
  {
    title: 'FARM',
    href: '/farm'
  },
  {
    title: 'GOVERNANCE',
    href: '/governance'
  },
  {
    title: 'DOCUMENTATION',
    href: '/documentation'
  },
  {
    title: 'FEEDBACK',
    href: '/feedback'
  },
  {
    title: 'LEGACY WEBSITE',
    href: ''
  }
];

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
    <div className={styles.container}>
      {links
        .filter((_, i) => i < 7)
        .map((link, i) => (
          <Link href={link.href} passHref key={i}>
            <HoneyButton variant="textSecondary">{link.title}</HoneyButton>
          </Link>
        ))}
      <Dropdown overlay={menu}>
        <HoneyButton variant="textSecondary">
          <Space>
            more
            <DownIcon />
          </Space>
        </HoneyButton>
      </Dropdown>
    </div>
  );
};

export default HeaderDropdownMenu;
