import React, { FC } from 'react';
import * as styles from './P2PPagesTitle.css';
import { P2PPageTitleProps } from './types';
import { Typography } from 'antd';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import { LeftOutlined } from '@ant-design/icons';
const { Text } = Typography;

const cloudinary_uri = process.env.CLOUDINARY_URI;

export const P2PPageTitle: FC<P2PPageTitleProps> = ({
  img,
  name,
  onGetBack
}) => {
  return (
    <>
      <Text className={styles.prevPage} onClick={onGetBack}>
        <LeftOutlined />
        Back to all collections
      </Text>

      <div className={styles.pagesTitle}>
        <div className={styles.img}>
          <HexaBoxContainer>
            <Image
              src={
                `https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${img}` ??
                `${honeyGenesisBee}`
              }
              alt={`${name}`}
              layout="fill"
            />
          </HexaBoxContainer>
        </div>
        <Text className={styles.name}>{name}</Text>
      </div>
    </>
  );
};
