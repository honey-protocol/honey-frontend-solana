import * as styles from './FeaturedCategoriesCard.css';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import SectionTitle from '../SectionTitle/SectionTitle';
import { Typography } from 'antd';
import { FeaturedCategoriesCardProps } from '../FeaturedCategories/types';
import { RightOutlined } from '@ant-design/icons';

export const FeaturedCategoriesCard = ({ title, subtitle, color, icon, onClick }: FeaturedCategoriesCardProps) => {
  return (
    <div className={styles.featuredCategoriesCard} onClick={() => onClick(title)}>
      <div className={styles.logoWrapper}>
        <HexaBoxContainer borderColor={color}>
            <img className={styles.logo} src={icon} alt="x"/>
        </HexaBoxContainer>
      </div>
      <div className={styles.textWrapper}>
        <div className={styles.titleWrapper}>
          <SectionTitle className={styles.cardTitle} title={title} />
          <RightOutlined color="red" />
        </div>
        <Typography.Text className={styles.description}>{subtitle}</Typography.Text>
      </div>
    </div>
  )
}