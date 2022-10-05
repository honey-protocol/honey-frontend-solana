import { FC } from 'react';
import { BorrowPositionCardProps } from '../types';
import * as styles from './BorrowPositionCard.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { formatNumber } from '../../../helpers/format';
import { HoneySlider } from '../../HoneySlider/HoneySlider';
import c from 'classnames';

const { formatUsd: fu, formatPercent: fp } = formatNumber;

export const BorrowPositionCard: FC<BorrowPositionCardProps> = ({
  position,
  isActive,
  onSelect
}) => {
  return (
    <div
      className={c(styles.positionCard, { [styles.activeCard]: isActive })}
      onClick={() => onSelect(position.id)}
    >
      <div className={styles.collectionIcon}>
        <HexaBoxContainer>
          <Image width={46} height={46} src={position.imageUrl} />
        </HexaBoxContainer>
      </div>
      <div className={styles.positionName}>
        <span className={styles.nameText}>{position.name}</span>
        <div className={styles.arrowIcon} />
      </div>
      <div className={styles.positionValues}>
        <InfoBlock title="Floor price" value={fu(position.price)} />
        <InfoBlock title="Debt" value={fu(position.debt)} />
        <InfoBlock title="IR" value={fp(position.ir * 100)} />
      </div>
      <div className={styles.divider} />
      <HoneySlider
        minAvailableValue={200}
        currentValue={400}
        maxValue={1000}
        maxAvailablePosition={0.6}
        isReadonly
      />
    </div>
  );
};
