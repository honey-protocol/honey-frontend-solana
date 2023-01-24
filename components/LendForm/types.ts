import { P2PLoan } from 'types/p2p';

export type LendFormProps = {
  name: string;
  imageUrl?: string;
  collectionName: string;
  loan: P2PLoan;
  borrowerTelegram?: string;
  borrowerDiscord?: string;
  onClose: () => void;
};
