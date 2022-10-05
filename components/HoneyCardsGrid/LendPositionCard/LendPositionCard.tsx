import { FC } from 'react';
import { LendPositionCardProps } from '../types';
import * as styles from './LendPositionCard.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { formatNumber } from '../../../helpers/format';
import { HoneySlider } from '../../HoneySlider/HoneySlider';
import c from 'classnames';

const { formatUsd: fu, formatPercent: fp } = formatNumber;

export const LendPositionCard: FC<LendPositionCardProps> = ({
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
        <InfoBlock
          title="IR"
          value={
            <span className={styles.irValue}>{fp(position.ir * 100)}</span>
          }
        />
        <InfoBlock title="Your Deposit" value={fu(position.deposit)} />
        <InfoBlock title="Value" value={fu(position.value)} />
        <InfoBlock title="Available" value={fu(position.available)} />
      </div>
    </div>
  );
};
