export type LendingSidebarProps = {
  collectionId?: string;
  onCancel: Function;
  name: string;
  imageUrl?: string;
  collectionName: string;
  request: number;
  ir: number;
  total: number;
  duePeriod: number;
  loanStart: number;
  walletAddress: string;
  borrowerTelegram?: string;
  borrowerDiscord?: string;
};