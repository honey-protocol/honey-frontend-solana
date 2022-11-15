export interface CollectionCardProps {
  tag: string;
  name: string;
  isVerified?: boolean;
  requested: number;
  items: number;
  total: number;
  imageUrl?: string;
  isActive: boolean;
  id: string;
  onSelect: (id: string) => void;
}
