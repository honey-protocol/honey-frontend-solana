import { FC } from 'react';
import * as styles from './P2PNftCard.css';
import c from 'classnames';
import { P2PNftCardProps } from './types';
import Image from 'next/image';
import { Typography } from 'antd';
import { StatusCard } from '../StatusCard/StatusCard';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import { noop } from 'lodash';

const { Text } = Typography;

const cloudinary_uri = process.env.CLOUDINARY_URI;

export const P2PNftCard: FC<P2PNftCardProps> = ({
  name,
  verified,
  footer,
  isActive,
  onClick = noop,
  imageUrl,
  collectionName
}) => {
  return (
    <div
      className={c(styles.nftCard, { [styles.isActive]: isActive })}
      onClick={onClick}
    >
      <div className={styles.img}>
        <Image
          src={`${cloudinary_uri}${imageUrl}` ?? `${honeyGenesisBee}`}
          alt={`${name}`}
          layout="fill"
        />
      </div>

      <div className={styles.info}>
        <div className={styles.statusBlock}>
          <StatusCard status={collectionName} isVerified={verified} />
        </div>

        <Text className={styles.name}>{name}</Text>

        {footer && <div className={styles.values}>{footer}</div>}
      </div>
    </div>
  );
};
