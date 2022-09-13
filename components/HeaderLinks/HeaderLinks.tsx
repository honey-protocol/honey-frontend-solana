import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
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
  const [linksDisplayed, setLinkDisplayed] = useState(7);
  const MoreMenu = (
    <Menu
      selectable
      items={links
        .filter((_, i) => i >= linksDisplayed)
        .map(link => ({
          key: link.title,
          label: (
            <Link href={link.href} passHref>
              <a>{link.title}</a>
            </Link>
          )
        }))}
    />
  );

  useEffect(() => {
    const setLinksToDisplay = () => {
      const width = window.innerWidth;
      if (width > 1100) {
        setLinkDisplayed(7);
      }
      if (width < 1100 && width > 768) {
        setLinkDisplayed(4);
      }
    };
    setLinksToDisplay();
    window.onresize = setLinksToDisplay;
    return () => {
      window.onresize = null;
    };
  }, []);
  return (
    <div className={styles.container}>
      {links
        .filter((_, i) => i < linksDisplayed)
        .map((link, i) => (
          <Link href={link.href} passHref key={i}>
            <HoneyButton variant="textSecondary">{link.title}</HoneyButton>
          </Link>
        ))}
      <Dropdown overlay={MoreMenu}>
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
