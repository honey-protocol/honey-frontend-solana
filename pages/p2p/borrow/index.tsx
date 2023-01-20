import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage
} from 'next';
import React, { useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import LayoutRedesign from '../../../components/LayoutRedesign/LayoutRedesign';
import HoneyContent from '../../../components/HoneyContent/HoneyContent';
import HoneySider from '../../../components/HoneySider/HoneySider';
import {
  BorrowPageMode,
  P2PBorrowSidebarMode,
  PageMode,
  P2PPosition,
  P2PLoans,
  P2PLoan
} from '../../../types/p2p';
import { BorrowP2PSidebar } from '../../../components/BorrowP2PSidebar/BorrowP2PSidebar';
import { HoneyButtonTabs } from 'components/HoneyButtonTabs/HoneyButtonTabs';
import { P2PBorrowMainList } from 'components/P2PBorrowMainLists/P2PBorrowMainList';
import { P2PRepayMainList } from 'components/P2PBorrowMainLists/P2PRepayMainList';
import useFetchNFTByUser from 'hooks/useNFTV2';
import {
  ConnectedWallet,
  useConnectedWallet,
  useConnection
} from '@saberhq/use-solana';
import { getProgram } from 'helpers/p2p/getProgram';
import BN from 'bn.js';
import { Connection } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';

export const getUserAppliedAndActiveLoans = async (
  walletAddress: string,
  connection: Connection,
  wallet: ConnectedWallet
) => {
  const program = await getProgram(connection, wallet as any);
  let loansData = await program.account.loanMetadata.all();
  const appliedLoans: P2PLoans = [];
  const lentLoans: P2PLoans = [];

  loansData.forEach(loan => {
    if (loan.account.borrower.toString() === walletAddress) {
      appliedLoans.push({
        ...loan.account,
        id: loan.publicKey.toString(),
        requestedAmount: new BN(loan.account.requestedAmount),
        interest: new BN(loan.account.interest),
        period: new BN(loan.account.period)
      } as P2PLoan);
    } else if (loan.account.lender.toString() === walletAddress) {
      lentLoans.push({
        ...loan.account,
        id: loan.publicKey.toString(),
        requestedAmount: new BN(loan.account.requestedAmount),
        interest: new BN(loan.account.interest),
        period: new BN(loan.account.period)
      } as P2PLoan);
    }
  });

  return {
    appliedLoans,
    lentLoans
  };
};

const Borrowing: NextPage = () => {
  const [pageMode, setPageMode] = useState<BorrowPageMode>(
    BorrowPageMode.NEW_BORROW
  );

  const wallet = useConnectedWallet();
  const connection = useConnection();
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);

  // const mockCollectionsList = useMemo(() => getCollectionsListMock(), []);
  const [NFTs, isFetchingNFTs, refetchNFTs] = useFetchNFTByUser(wallet);
  const [appliedLoans, setAppliedLoans] = useState<P2PLoans>([]);
  const [activeLoans, setActiveLoans] = useState<P2PLoans>([]);

  useEffect(() => {
    if (!wallet) return;
    const getAppliedAndActiveLoans = async () => {
      const { appliedLoans, lentLoans } = await getUserAppliedAndActiveLoans(
        wallet?.publicKey.toString(),
        connection,
        wallet
      );
      setAppliedLoans(appliedLoans);
      setActiveLoans(lentLoans);
    };
    getAppliedAndActiveLoans();
  }, [wallet, connection]);

  console.log({ appliedLoans, activeLoans });

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  const handleOnCloseSidebar = () => {
    setSelectedNFT(undefined);
  };

  const borrowingSidebar = () => {
    return (
      <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
        <BorrowP2PSidebar
          userAppliedLoans={appliedLoans}
          selectedPosition={selectedNFT}
          onClose={handleOnCloseSidebar}
        />
      </HoneySider>
    );
  };

  const handleNftSelect = (address: string) => {
    const selected = NFTs.find(item => item.mint === address);
    setSelectedNFT(selected);
  };

  const PageModeSwitchTab = () => {
    return (
      <HoneyButtonTabs
        items={[
          { name: 'NEW BORROW', slug: BorrowPageMode.NEW_BORROW },
          { name: 'REPAY LOAN', slug: BorrowPageMode.REPAY_BORROWED }
        ]}
        activeItemSlug={pageMode}
        onClick={(slug: any) => setPageMode(slug)}
      />
    );
  };

  const renderTable = (pageMode: BorrowPageMode) => {
    switch (pageMode) {
      case BorrowPageMode.NEW_BORROW:
        return (
          <P2PBorrowMainList
            data={NFTs}
            onSelect={handleNftSelect}
            selected={selectedNFT?.mint}
            PageModeSwitchTab={PageModeSwitchTab}
          />
        );
      case BorrowPageMode.REPAY_BORROWED:
        return (
          <P2PRepayMainList
            data={activeLoans}
            onSelect={handleNftSelect}
            selected={selectedNFT?.mint}
            PageModeSwitchTab={PageModeSwitchTab}
          />
        );
    }
  };

  const renderTitle = (pagesMode: BorrowPageMode) => {
    switch (pagesMode) {
      case BorrowPageMode.NEW_BORROW:
        return (
          <>
            <Typography.Title className={pageTitle}>
              P2P Borrow
            </Typography.Title>
            <Typography.Text className={pageDescription}>
              Select a collateral and fill in your desired borrow params
            </Typography.Text>
          </>
        );
      case BorrowPageMode.REPAY_BORROWED:
        return (
          <>
            <Typography.Title className={pageTitle}>
              Repay P2P Loan
            </Typography.Title>
            <Typography.Text className={pageDescription}>
              Select a loan to repay.
            </Typography.Text>
          </>
        );
        return null;
    }
  };

  return (
    <LayoutRedesign>
      <HoneyContent>{renderTitle(pageMode)}</HoneyContent>
      <HoneyContent sidebar={borrowingSidebar()}>
        {renderTable(pageMode)}
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Borrowing;
