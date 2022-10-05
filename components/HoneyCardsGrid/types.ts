export type BorrowUserPosition = {
  name: string;
  price: number;
  debt: number;
  ir: number;
  imageUrl: string;
  id: string;
};

export type LendUserPosition = {
  name: string;
  deposit: number;
  value: number;
  available: number;
  ir: number;
  imageUrl: string;
  id: string;
};

export interface HoneyCardGridProps {
  borrowPositions: BorrowUserPosition[];
  lendPositions: LendUserPosition[];
  onSelect: (id: string) => void;
  selected: string | undefined;
}

export interface BorrowPositionCardProps {
  position: BorrowUserPosition;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export interface LendPositionCardProps {
  position: LendUserPosition;
  isActive: boolean;
  onSelect: (id: string) => void;
}
