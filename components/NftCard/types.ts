export type NftCardProps = {
  id: string;
  onClick?: (id: string) => void;
  name: string;
  text: string;
  hint?: string;
  buttonText: string;
  img: string;
  hasBorder?: boolean;
};
