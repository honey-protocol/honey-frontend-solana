import type { NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import LayoutRedesign from '../../../components/LayoutRedesign/LayoutRedesign';
import HoneyContent from '../../../components/HoneyContent/HoneyContent';
import HoneySider from '../../../components/HoneySider/HoneySider';
import {
  BorrowPageMode,
  P2PBorrowSidebarMode,
  PageMode,
  P2PPosition
} from '../../../types/p2p';
import { BorrowP2PSidebar } from '../../../components/BorrowP2PSidebar/BorrowP2PSidebar';
import { P2PLendingMainList } from '../../../components/P2PLendingMainList/P2PLendingMainList';
import { P2PPageTitle } from '../../../components/P2PPagesTitle/P2PPageTitle';
import { P2PBorrowingMainList } from '../../../components/P2PBorrowingMainList/P2PBorrowingMainList';

function getNftListMock() {
  const preparedPositions: P2PPosition[] = [];
  for (let i = 0; i < 20; i++) {
    preparedPositions.push({
      name: `User #${i + 1000}`,
      collectionName: `tag #${i + 1000}`,
      request: Math.random() * 1000,
      ir: Math.random() * 1000,
      total: Math.random(),
      imageUrl: '/images/mock-collection-image@2x.png',
      end: 1667557681931,
      start: 1667395278840,
      walletAddress: '2ijWvdsnOP1vnjds8ыvkd12',
      borrowerTelegram: '#',
      borrowerDiscord: '#',
      address: i.toString() + '_lend'
    });
  }
  return preparedPositions;
}

const Borrowing: NextPage = () => {
  const [pageMode, setPageMode] = useState<BorrowPageMode>(
    BorrowPageMode.INITIAL_STATE
  );
  const cloudinary_uri = process.env.CLOUDINARY_URI;

  const [selectedNFT, setSelectedNFT] = useState<P2PPosition>();
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);

  // const mockCollectionsList = useMemo(() => getCollectionsListMock(), []);
  const nftListMock = useMemo(() => getNftListMock(), []);
  const userBorrowedPositionsMock = nftListMock.slice(0, 5);

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
          userBorrowedPositions={userBorrowedPositionsMock}
          selectedPosition={selectedNFT}
          onClose={handleOnCloseSidebar}
        />
      </HoneySider>
    );
  };

  const handleNftSelect = (address: string) => {
    debugger;
    const selected = nftListMock.find(item => item.address === address);
    setSelectedNFT(selected);
  };

  const renderTable = (pageMode: BorrowPageMode) => {
    switch (pageMode) {
      case BorrowPageMode.INITIAL_STATE:
        return (
          <P2PBorrowingMainList
            data={nftListMock}
            onSelect={handleNftSelect}
            selected={selectedNFT?.address}
          />
        );
      case BorrowPageMode.NFT_SELECTED:
        return (
          <P2PBorrowingMainList
            data={nftListMock}
            onSelect={handleNftSelect}
            selected={selectedNFT?.address}
          />
        );
    }
  };

  const renderTitle = (pagesMode: BorrowPageMode) => {
    switch (pagesMode) {
      case BorrowPageMode.INITIAL_STATE:
        return (
          <>
            <Typography.Title className={pageTitle}>
              P2P Borrow
            </Typography.Title>
            <Typography.Text className={pageDescription}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has
            </Typography.Text>
          </>
        );
      case BorrowPageMode.NFT_SELECTED:
        if (selectedNFT) {
          return (
            <P2PPageTitle
              onGetBack={() => setPageMode(BorrowPageMode.INITIAL_STATE)}
              name={selectedNFT.name}
              img={`https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${selectedNFT.imageUrl}`}
            />
          );
        }
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
