export type NftCardProps = {
  id: string;
  onClick?: (name: string, id: string, img: string) => void;
  name: string;
  text: string;
  hint?: string;
  buttonText: string;
  img?: string;
  image: string;
  hasBorder?: boolean;
};
