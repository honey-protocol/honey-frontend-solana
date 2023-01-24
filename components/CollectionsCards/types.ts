import { P2PCollection } from '../../types/p2p';

export type statusType = 'verified' | 'all';
export type categorySortType = 'top' | 'trending' | 'newcomers';

export interface CollectionsCardsProps {
  data: P2PCollection[];
  onCollectionSelect: (id: string) => void;
  selectedCollectionId: string | undefined;
}
