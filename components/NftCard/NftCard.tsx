import React, { useCallback } from 'react';
import * as styles from './NftCard.css';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../HoneyButton/HoneyButton';
import { NftCardProps } from './types';
import c from 'classnames';
import honeyEyes from '/public/nfts/honeyEyes.png';
import Image from 'next/image';

const NftCard = (props: NftCardProps) => {
  const {
    onClick,
    id,
    name,
    text,
    hint,
    buttonText,
    img,
    image,
    mint,
    hasBorder = true
  } = props;

  const _onClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick(name, id, image, mint);
    }
  }, [id]);

  return (
    <div
      className={c(styles.nftCard, { [styles.hasBorder]: hasBorder })}
      onClick={_onClick}
    >
      <div className={styles.nftImage}>
        <HexaBoxContainer>
          <Image 
            src={image} 
            alt={'user nft'} 
            layout='fill'
          />
        </HexaBoxContainer>
      </div>
      <div className={styles.nftRight}>
        <div className={styles.nftDescription}>
          <div className={styles.nftName}>{name}</div>
          <div className={styles.nftLabel}>
            {text} {hint && <span className={styles.hint}>{hint}</span>}
          </div>
        </div>
        <HoneyButton variant="text">
          Up to {buttonText}
          <div className={styles.arrowRight} />
        </HoneyButton>
      </div>
    </div>
  );
};

export default NftCard;
