import { Dropdown, Menu, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import * as styles from './HeaderLinks.css';
import Link from 'next/link';
import { DownIcon } from 'icons/DownIcon';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { useRouter } from 'next/router';
import cs from 'classnames';
import { DESKTOP_BP, TABLET_BP } from '../../constants/breakpoints';
import { featureFlags } from '../../helpers/featureFlags';
import { vars } from 'styles/theme.css';

type MenuLink = {
  title: string;
  href: string;
  disabled?: boolean;
  submenu?: Array<{
    title: string;
    href: string;
  }>;
};

export const links: MenuLink[] = [
  // {
  //   title: 'DASHBOARD',
  //   href: '/dashboard',
  //   disabled: true
  // },
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
    title: 'SWAP',
    href: '/swap'
  },
  {
    title: 'GOVERNANCE',
    href: 'https://governance.honey.finance/'
  },
  {
    title: 'FARM',
    href: 'https://farms.honey.finance/'
  },
  {
    title: 'DOCUMENTATION',
    href: 'https://docs.honey.finance'
  },
  {
    title: 'FEEDBACK',
    href: 'https://feedback.honey.finance'
  },
  {
    title: 'BLOG',
    href: 'https://blog.honey.finance'
  }
  // {
  //   title: 'LEGACY WEBSITE',
  //   href: 'https://honeylend.netlify.app/farm'
  // },
  // {
  //   title: 'V1',
  //   href: 'https://app.honey.finance'
  // }
];

if (featureFlags.isP2PPageEnabled) {
  links.splice(5, 0, {
    title: 'p2p',
    href: '',
    submenu: [
      {
        title: 'Lend',
        href: '/p2p/lend'
      },
      {
        title: 'Borrow',
        href: '/p2p/borrow'
      }
    ]
  });
}

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
      if (width > DESKTOP_BP) {
        setLinkDisplayed(6);
      }
      if (width < DESKTOP_BP && width > TABLET_BP) {
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
    <Menu className={styles.container} triggerSubMenuAction="hover">
      {links
        .filter((_, i) => i < linksDisplayed)
        .map((link, i) => (
          <Menu.Item
            className={cs(styles.item, {
              [styles.activeLink]: router.pathname === link.href
            })}
            key={i}
          >
            {link.disabled && !link.submenu ? (
              <HoneyButton disabled variant="textSecondary">
                {link.title}
              </HoneyButton>
            ) : (
              <>
                {!link.submenu && (
                  <Link href={link.href} passHref>
                    <HoneyButton variant="textSecondary">
                      {link.title}
                    </HoneyButton>
                  </Link>
                )}
              </>
            )}

            {link.submenu && (
              <Menu.SubMenu
                title={
                  <>
                    {link.title}
                    <DownIcon />
                  </>
                }
                className={styles.submenu}
              >
                {link.submenu.map(s => (
                  <Menu.Item
                    key={s.title}
                    className={cs(styles.item, styles.subItem, {
                      [styles.activeLink]: router.pathname === s.href
                    })}
                  >
                    <Link href={s.href} passHref>
                      <HoneyButton variant="textSecondary">
                        {s.title}
                      </HoneyButton>
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            )}
          </Menu.Item>
        ))}
      <li>
        <Dropdown overlay={MoreMenu}>
          <HoneyButton variant="textSecondary">
            <Space>
              more
              <DownIcon fill={vars.colors.text} />
            </Space>
          </HoneyButton>
        </Dropdown>
      </li>
    </Menu>
  );
};
export default HeaderDropdownMenu;
