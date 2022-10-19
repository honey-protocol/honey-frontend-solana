import { FC } from 'react';
import { BorrowPositionCardProps } from '../types';
import * as styles from './BorrowPositionCard.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName as fnn } from '../../../helpers/format';
import { HoneySlider } from '../../HoneySlider/HoneySlider';
import c from 'classnames';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import { BorrowPositionCardSlider } from '../../BorrowPositionCardSlider/BorrowPositionCardSlider';
import { LIQUIDATION_THRESHOLD, MAX_LTV } from '../../../constants/loan';

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
        <HoneyTooltip label={position.name}>{fnn(position.name)}</HoneyTooltip>
        <div className={styles.arrowIcon} />
      </div>
      <div className={styles.positionValues}>
        <InfoBlock title="Floor price" value={fu(position.price)} />
        <InfoBlock title="Debt" value={fu(position.debt)} />
        <InfoBlock title="IR" value={fp(position.ir * 100)} />
      </div>
      <div className={styles.divider} />
      <BorrowPositionCardSlider
        debt={position.debt}
        collateralValue={position.price}
        liquidationThreshold={LIQUIDATION_THRESHOLD}
        maxLoanToValue={MAX_LTV}
      />
    </div>
  );
};
