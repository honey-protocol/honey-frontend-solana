import { NftCardProps } from '../NftCard/types';
import { UserNFTs } from '../../types/markets';
import { P2PLoans, P2PPosition } from '../../types/p2p';
import HoneyButton, { HoneyButtonProps } from '../HoneyButton/HoneyButton';

export type ChooseNFTsTabProps = {
  available: NftCardProps[];
  onSelect: (name: string, img: string, mint?: string) => void;
  price: number;
  selected?: string;
};

export type BorrowP2PSidebarProps = {
  // requested loans by user that are not active
  userAppliedLoans: P2PLoans;
  // selected position
  selectedNFT?: NFT;
  onClose: () => void;
};

export type RepayP2PSliderProps = {
  currentValue: number;
  maxValue: number;
  onChange: (value: number) => void;
  minValue: number;
};

export type BorrowP2PSidebarHeaderProps = {
  NFTName: string;
  collectionName: string;
  isVerifiedCollection?: boolean;
  NFTLogo: string;
};

export type BorrowP2PSidebarFooterProps = {
  firstButtonTitle: string;
  secondButtonTitle: string;
  isActionButtonDisabled: boolean;
  onClose: () => void;
  actionButtonProps?: HoneyButtonProps;
};

export type BorrowP2PRequestFormTabProps = {
  collectionName: string;
  isVerifiedCollection?: boolean;
  onClose: () => void;
  NFT: NFT;
};

export type AvailableNFTsListSidebarProps = {
  onSelectNFT: Function;
  selectNFT?: UserNFTs;
};

export type Tab = 'borrow' | 'repay';
