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

export const P2PNftCard: FC<P2PNftCardProps> = ({
  name,
  // verified,
  footer,
  isActive,
  onClick = noop,
  image
  // collectionName
}) => {
  return (
    <div
      className={c(styles.nftCard, { [styles.isActive]: isActive })}
      onClick={onClick}
    >
      <div className={styles.img}>
        <Image src={image || honeyGenesisBee} alt={`${name}`} layout="fill" />
      </div>

      <div className={styles.info}>
        <div className={styles.statusBlock}>
          {/* get collection name and verify status */}
          <StatusCard status={'collectionName'} isVerified={true} />
        </div>

        <Text className={styles.name}>{name}</Text>

        {footer && <div className={styles.values}>{footer}</div>}
      </div>
    </div>
  );
};
