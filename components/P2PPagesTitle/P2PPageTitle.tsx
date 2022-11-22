import React, { FC } from 'react';
import * as styles from './P2PPagesTitle.css';
import { P2PPageTitleProps } from './types';
import { Typography } from 'antd';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
const { Text } = Typography;

export const P2PPageTitle: FC<P2PPageTitleProps> = ({
  img,
  name,
  onGetBack
}) => {
  return (
    <>
      <Text className={styles.prevPage} onClick={onGetBack}>
        <div className={styles.iconPrev} />
        Back to all collections
      </Text>

      <div className={styles.pagesTitle}>
        <div className={styles.img}>
          <HexaBoxContainer>
            <Image src={img || honeyGenesisBee} alt={`${name}`} layout="fill" />
          </HexaBoxContainer>
        </div>
        <Text className={styles.name}>{name}</Text>
      </div>
    </>
  );
};
