import { HexaBoxBordersColor } from "../HexaBoxContainer/types";

export type FeaturedCategory = {
  title: string,
  subtitle: string,
  color: HexaBoxBordersColor,
  icon: string,
}


export type FeaturedCategoriesProps = {
  data: FeaturedCategory[],
  onClick: (value: string) => void,
}

export type FeaturedCategoriesCardProps = {
  title: string,
  subtitle: string,
  color: HexaBoxBordersColor,
  icon: string,
  onClick: (value: string) => void,
}