import * as styles from './Header.css';
import { FC, useState } from 'react';
import { Space } from 'antd';
import HeaderLinks from 'components/HeaderLinks/HeaderLinks';
import WalletMenu from 'components/WalletMenu/WalletMenu';
import HoneyCardYellowShadow from '../HoneyCardYellowShadow/HoneyCardYellowShadow';
import cs from 'classnames';
import MobileMenu from 'components/MobileMenu/MobileMenu';
import Link from 'next/link';
import Logo from 'icons/Logo';

const Header: FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className={styles.headerContainer}>
      <HoneyCardYellowShadow isOverflowHiddenDisabled={true}>
        <div className={cs(styles.content, { ['open']: showMobileMenu })}>
          <div className={styles.main}>
            <Space size="small">
              <div
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={cs(
                  styles.menuToggle,
                  showMobileMenu ? styles.menuClose : styles.menuOpen
                )}
              />

              <Link href="/" passHref>
                <Logo />
              </Link>
            </Space>
            <HeaderLinks />
            <WalletMenu />
          </div>
          <MobileMenu isVisible={showMobileMenu} />
        </div>
      </HoneyCardYellowShadow>
    </div>
  );
};

export default Header;
