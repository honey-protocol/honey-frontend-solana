import * as styles from './FeaturedCategories.css';
import { FeaturedCategoriesCard } from "../FeaturedCategoriesCard/FeaturedCategoriesCard";
import SectionTitle from "../SectionTitle/SectionTitle";
import { FeaturedCategoriesProps } from "./types";

export const FeaturedCategories = ({ data, onClick }: FeaturedCategoriesProps) => {
  return (
    <div className={styles.featureCategories}>
      <SectionTitle className={styles.title} title={'Featured Categories'} />
      <div className={styles.categoriesWrapper}>
        {data.map(item => {
          return (
            <FeaturedCategoriesCard
              title={item.title}
              subtitle={item.subtitle}
              color={item.color}
              icon={item.icon}
              key={item.title}
              onClick={onClick}
            />
          )
        })}
      </div>
    </div>
  )
}