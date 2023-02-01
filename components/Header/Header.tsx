import * as styles from './Header.css';
import { FC, useContext, useState } from 'react';
import { Dropdown, Menu, Space } from 'antd';
import HeaderLinks from 'components/HeaderLinks/HeaderLinks';
import WalletMenu from 'components/WalletMenu/WalletMenu';
import HoneyCardYellowShadow from '../HoneyCardYellowShadow/HoneyCardYellowShadow';
import cs from 'classnames';
import MobileMenu from 'components/MobileMenu/MobileMenu';
import Link from 'next/link';
import Logo from 'icons/Logo';
import { MenuCloseIcon } from 'icons/MenuCloseIcon';
import { MenuOpenIcon } from 'icons/MenuOpenIcon';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { SwitchIcon } from 'icons/SwitchIcon';
import * as commonStyles from 'styles/common.css';
import { CopyIcon } from 'icons/CopyIcon';
import { formatAddress } from 'helpers/addressUtils';
import { HoneyThemeContext } from 'pages/_app';

const Header: FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { disconnect } = useSolana();
  const wallet = useConnectedWallet();
  const { theme } = useContext(HoneyThemeContext);

  const menu = (
    <Menu
      selectable
      className={styles.userMenu}
      items={[
        {
          key: '0',
          label: formatAddress(wallet?.publicKey.toString()),
          itemIcon: (
            <div className={styles.menuIconContainer}>
              <CopyIcon
                fill={['dark', 'dusk'].includes(theme) ? 'white' : 'black'}
              />
            </div>
          ),
          onClick: () =>
            navigator.clipboard.writeText(wallet?.publicKey.toString() ?? '')
        },
        {
          key: '1',
          label: 'Disconnect',
          onClick: disconnect,
          itemIcon: (
            <div className={styles.menuIconContainer}>
              <SwitchIcon
                fill={['dark', 'dusk'].includes(theme) ? 'white' : 'black'}
              />
            </div>
          )
        }
      ]}
    />
  );

  return (
    <div className={styles.headerContainer}>
      <HoneyCardYellowShadow isOverflowHiddenDisabled={true}>
        <div className={cs(styles.content, { ['open']: showMobileMenu })}>
          <div className={styles.main}>
            <Link href="/" passHref>
              <Logo />
            </Link>
            <HeaderLinks />
            <div className={styles.walletMenuBox}>
              <WalletMenu menu={menu} />
            </div>
            <Space direction="horizontal" className={commonStyles.showOnMobile}>
              {wallet?.connected && (
                <Dropdown placement="bottomRight" overlay={menu}>
                  <a onClick={e => e.preventDefault()}>
                    <Space size="small" align="center">
                      <div className={styles.userIcon} />
                    </Space>
                  </a>
                </Dropdown>
              )}
              <div
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={cs(styles.menuToggle)}
              >
                {showMobileMenu ? <MenuCloseIcon /> : <MenuOpenIcon />}
              </div>
            </Space>
          </div>
          <MobileMenu isVisible={showMobileMenu} />
        </div>
      </HoneyCardYellowShadow>
    </div>
  );
};

export default Header;
