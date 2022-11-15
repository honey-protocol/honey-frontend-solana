import * as styles from './AvailableNFTsListSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../../HoneyTabs/HoneyTabs';
import { AvailableNFTsListTab } from '../AvailableNFTsListTab/AvailableNFTsListTab';
import { useState } from 'react';
import { NftCardProps } from '../../NftCard/types';
import { AvailableNFTsListSidebarProps } from '../types';

export const AvailableNFTsListSidebar = ({
  onSelectNFT,
  selectNFT
}: AvailableNFTsListSidebarProps) => {
  const borrowTabs: [HoneyTabItem, HoneyTabItem?] = [
    { label: 'New Borrow', key: 'new_borrow' },
    { label: 'Repay', key: 'repay' }
  ];
  const [NFTPrice, setNFTPrice] = useState<number>(0);

  const handleSelectNFT = (name: string, image: string, mint?: string) => {
    onSelectNFT({ name, image, mint });
  };

  const calculateNFTPrice = () => {
    //TODO: Include here fetching NFT price method
    setNFTPrice(Math.random() + 1000);
  };

  //TODO: Mock data for visible data without NFT on waller. Drop this when backend will be connected
  const availableNFTs: NftCardProps[] = [
    {
      id: '1',
      name: 'Honey Genesis',
      text: 'text',
      buttonText: 'Button text',
      mint: '123',
      image: '/images/mock-collection-image@2x.png',
      nftPrice: 123
    },
    {
      id: '2',
      name: 'Honey Genesis',
      text: 'text',
      buttonText: 'Button text',
      mint: '678',
      image: '/images/mock-collection-image@2x.png',
      nftPrice: 123
    },
    {
      id: '3',
      name: 'Honey Genesis',
      text: 'text',
      buttonText: 'Button text',
      mint: '456',
      image: '/images/mock-collection-image@2x.png',
      nftPrice: 123
    }
  ];

  return (
    <div className={styles.borrowP2PChoiceNFTSidebar}>
      <HoneyTabs
        activeKey={'new_borrow'}
        items={borrowTabs}
        active={true}
        onTabChange={() => {}}
      >
        <AvailableNFTsListTab
          price={NFTPrice}
          available={availableNFTs}
          onSelect={handleSelectNFT}
          selected={selectNFT?.mint}
        />
      </HoneyTabs>
    </div>
  );
};
