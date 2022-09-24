import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import * as styles from './HeaderLinks.css';
import Link from 'next/link';
import { DownIcon } from 'icons/DownIcon';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { useRouter } from 'next/router';
import cs from 'classnames';

export const links = [
  {
    title: 'DASHBOARD',
    href: '/dashboard'
  },
  {
    title: 'BORROW',
    href: '/borrow'
  },
  {
    title: 'LEND',
    href: '/lend'
  },
  {
    title: 'LIQUIDATION',
    href: '/liquidate'
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
    href: 'https://feedback.honey.finance'
  },
  {
    title: 'LEGACY WEBSITE',
    href: 'https://honeylend.netlify.app/farm'
  }
];

const HeaderDropdownMenu = () => {
  const [linksDisplayed, setLinkDisplayed] = useState(6);
  const router = useRouter();
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
        setLinkDisplayed(6);
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
    <ul className={styles.container}>
      {links
        .filter((_, i) => i < linksDisplayed)
        .map((link, i) => (
          <li
            className={cs({
              [styles.activeLink]: router.pathname.includes(link.href)
            })}
            key={i}
          >
            <Link href={link.href} passHref>
              <HoneyButton variant="textSecondary">{link.title}</HoneyButton>
            </Link>
          </li>
        ))}
      <li>
        <Dropdown overlay={MoreMenu}>
          <HoneyButton variant="textSecondary">
            <Space>
              more
              <DownIcon />
            </Space>
          </HoneyButton>
        </Dropdown>
      </li>
    </ul>
  );
};

export default HeaderDropdownMenu;
