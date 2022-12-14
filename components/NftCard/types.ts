export type NftCardProps = {
  id?: string;
  onClick?: (name: string, img: string, mint: any, creators: any) => void;
  name: string;
  text: string;
  hint?: string;
  buttonText?: string;
  img?: string;
  image: string;
  mint: any;
  hasBorder?: boolean;
  nftPrice?: any;
  currentMarketId: string;
  creators: any;
};
