import { P2PCollection } from '../../types/p2p';

export type statusType = 'verified' | 'all';
export type collectionsSortType = 'collections' | 'assets';

export interface CategoryCardProps {
  data: P2PCollection[];
  onSelect: (id: string) => void;
  selected: string | undefined;
}
