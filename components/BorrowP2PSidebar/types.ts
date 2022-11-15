import { NftCardProps } from '../NftCard/types';
import { UserNFTs } from '../../types/markets';
import { P2PPosition } from '../../types/p2p';
import HoneyButton, { HoneyButtonProps } from '../HoneyButton/HoneyButton';

export type ChooseNFTsTabProps = {
  available: NftCardProps[];
  onSelect: (name: string, img: string, mint?: string) => void;
  price: number;
  selected?: string;
};

export type BorrowP2PSidebarProps = {
  // existing loans that user has to repay
  userBorrowedPositions: P2PPosition[];
  // selected position
  selectedPosition?: P2PPosition;
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
  NFTName: string;
  collectionName: string;
  NFTLogo: string;
  isVerifiedCollection?: boolean;
  onClose: () => void;
};

export type AvailableNFTsListSidebarProps = {
  onSelectNFT: Function;
  selectNFT?: UserNFTs;
};

export type Tab = 'borrow' | 'repay';
