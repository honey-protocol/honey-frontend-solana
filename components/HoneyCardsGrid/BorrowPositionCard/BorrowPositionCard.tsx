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
import { MAX_LTV } from '../../../constants/loan';
import { COLLATERAL_FACTOR } from 'helpers/marketHelpers';

const { formatUsd: fu, formatPercent: fp } = formatNumber;
const cloudinary_uri = process.env.CLOUDINARY_URI;

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
          <Image
            width={46}
            height={46}
            src={`https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${position.imageUrl}`}
            alt=""
          />
        </HexaBoxContainer>
      </div>
      <div className={styles.positionName}>
        <HoneyTooltip title={position.name}>{fnn(position.name)}</HoneyTooltip>
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
        liquidationThreshold={COLLATERAL_FACTOR}
        maxLoanToValue={MAX_LTV}
      />
    </div>
  );
};
