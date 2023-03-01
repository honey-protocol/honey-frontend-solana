import { FC } from 'react';
import * as styles from './CollectionCard.css';
import { CollectionCardProps } from './types';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { Typography } from 'antd';
import { StatusCard } from '../StatusCard/StatusCard';
import { formatNumber } from '../../helpers/format';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import c from 'classnames';

const { Text } = Typography;
const { format: f, formatSol: fs } = formatNumber;

const cloudinary_uri = process.env.CLOUDINARY_URI;

export const CollectionCard: FC<CollectionCardProps> = ({
  tag,
  name,
  isVerified,
  requested,
  items,
  total,
  imageUrl,
  isActive,
  id,
  onSelect
}) => {
  return (
    <div
      className={c(styles.collectionCard, { [styles.isActive]: isActive })}
      onClick={() => onSelect(id)}
    >
      <div className={styles.blur}>
        <div className={styles.iconBlur}>
          <Image
            src={`${cloudinary_uri}${imageUrl}` || honeyGenesisBee}
            alt={`${name}`}
            layout="fill"
          />
        </div>
        <div className={styles.icon}>
          <HexaBoxContainer>
            <Image
              // TODO: validate backup and place in each render / collection
              src={`${cloudinary_uri}${imageUrl}` || honeyGenesisBee}
              alt={`${name}`}
              layout="fill"
            />
          </HexaBoxContainer>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.statusBlock}>
          <StatusCard status={tag} isVerified={isVerified} />
        </div>

        <Text className={styles.name}>{name}</Text>

        <div className={styles.values}>
          <InfoBlock title="Requested" center value={fs(requested)} />
          <InfoBlock title="Items" center value={f(items)} />
          <InfoBlock title="Total supplied" center value={fs(total)} />
        </div>
      </div>
    </div>
  );
};
