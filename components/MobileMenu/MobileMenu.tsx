import { links } from 'components/HeaderLinks/HeaderLinks';
import React, { useEffect } from 'react';
import * as styles from './MobileMenu.css';
import cs from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { DiscordIcon } from 'icons/DiscordIcon';
import { TwitterIcon } from 'icons/TwitterIcon';
import { MediumIcon } from 'icons/MediumIcon';
import { GithubIcon } from 'icons/GithubIcon';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from '../../styles/theme.css';

interface MobileMenuProps {
  isVisible: boolean;
}

const MobileMenu = (props: MobileMenuProps) => {
  const router = useRouter();

  useEffect(() => {
    if (props.isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [props.isVisible]);
  return (
    <ul
      className={cs(
        styles.mobileMenu,
        props.isVisible ? styles.visible : styles.hidden
      )}
    >
      {links.map((link, i) => (
        <li
          className={cs(styles.link, {
            [styles.activeLink]: router.pathname.includes(link.href)
          })}
          style={assignInlineVars({
            [styles.linkOrder]: props.isVisible
              ? `${i + 1}`
              : `${links.length - i + 1}`
          })}
          key={i}
        >
          <Link href={link.href} passHref>
            <HoneyButton variant="textSecondary">{link.title}</HoneyButton>
          </Link>
        </li>
      ))}
      <li
        className={cs(styles.socialLinks, styles.link)}
        style={assignInlineVars({
          [styles.linkOrder]: props.isVisible ? `${links.length + 1}` : '1'
        })}
      >
        <DiscordIcon color={vars.colors.black} />
        <TwitterIcon color={vars.colors.black} />
        <MediumIcon color={vars.colors.black} />
        <GithubIcon color={vars.colors.black} />
      </li>
    </ul>
  );
};

export default MobileMenu;
