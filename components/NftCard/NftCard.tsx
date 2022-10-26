import React, { useCallback, useEffect } from 'react';
import * as styles from './NftCard.css';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../HoneyButton/HoneyButton';
import { NftCardProps } from './types';
import c from 'classnames';
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
      onClick(name, image, mint);
    }
  }, [mint]);
  
  useEffect(() => {

  }, [image, name, mint, text, hint, buttonText,])
  
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
            layout={'fill'}
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
