import React, { useEffect, useRef } from 'react';
import { Box, Button, IconMenu, Text } from 'degen';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import * as styles from './UserInfo.css';
import Tps from '../Tps/TpsBar';

interface UserInfoProps {
  setShowMobileSidebar: Function;
}

const UserInfo = (props: UserInfoProps) => {
  const { disconnect } = useSolana();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnTextRef = useRef<HTMLElement>(null);
  const walletAddress = wallet?.publicKey.toString();

  useEffect(() => {
    const btn = btnRef.current;
    if (!btnTextRef.current || !btn || !walletAddress) return;
    btn.addEventListener('mouseenter', e => {
      if (!btnTextRef.current) return;
      btnTextRef.current.innerHTML = 'Disconnect';
    });

    btn.addEventListener('mouseleave', e => {
      if (!btnTextRef.current) return;
      btnTextRef.current.innerHTML = walletAddress || '';
    });
    return () => {
      btn?.removeEventListener('mouseenter', () => {});
      btn?.removeEventListener('mouseleave', () => {});
    };
  }, [walletAddress]);

  return (
    <Box
      flexDirection={{ xs: 'column', md: 'row' }}
      paddingX="5"
      paddingY="3"
      height={{ xs: 'auto', md: '20' }}
      className={styles.topbar}
    >
      <Box className={styles.menuIcon}>
        <Button
          onClick={() => props.setShowMobileSidebar(true)}
          variant="transparent"
          shape="square"
          size="small"
        >
          <IconMenu size="8" color="accent" />
        </Button>
      </Box>
      <Box marginRight={{ xs: '0', md: 'auto' }}>
        <Tps />
      </Box>
      {wallet ? (
        <Button
          onClick={disconnect}
          ref={btnRef}
          variant="secondary"
          size="small"
          width="48"
        >
          <Box width="24">
            <Text ref={btnTextRef} ellipsis>
              {wallet?.publicKey?.toString()}
            </Text>
          </Box>
        </Button>
      ) : (
        <Button variant="primary" size="small" width="48" onClick={connect}>
          Connect Wallet
        </Button>
      )}
    </Box>
  );
};

export default UserInfo;
