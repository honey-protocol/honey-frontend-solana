import { FC } from 'react';
import * as styles from './SliderPosition.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { SliderPositionProps } from '../types';
import { formatNumber, formatNFTName as fnn } from '../../../helpers/format';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';

const { formatPercent: fp, formatShortName: fsn } = formatNumber;

export const SliderPosition: FC<SliderPositionProps> = ({ position }) => {
  const { name, value, image, difference } = position;
  return (
    <div className={styles.honeyPosition}>
      <div className={styles.collectionIconWrapper}>
        <HexaBoxContainer>
          <Image src={image} width={34} height={34} />
        </HexaBoxContainer>
      </div>
      <div className={styles.honeyPositionValues}>
        <span className={styles.honeyPositionName}>
          <HoneyTooltip label={name}>{fnn(name)}</HoneyTooltip>
        </span>
        <div className={styles.honeyPositionDigits}>
          <div className={styles.honeyPositionPrice}>$ {fsn(value)}</div>
          <div className={styles.honeyPositionDifference}>
            <div className={styles.stonksPositionIcon} />
            <span>{fp(difference * 100)}</span>
          </div>
        </div>
      </div>
      <div className={styles.verticalDivider} />
    </div>
  );
};
