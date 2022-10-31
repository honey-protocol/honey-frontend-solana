import React, { useCallback, useEffect } from 'react';
import * as styles from './NftCard.css';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../HoneyButton/HoneyButton';
import { NftCardProps } from './types';
import c from 'classnames';
import Image from 'next/image';
import { renderMarketName } from 'helpers/marketHelpers';

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
    currentMarketId,
    hasBorder = true
  } = props;

  const _onClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick(name, image, mint);
    }
  }, [mint]);

  console.log('name', name)
  console.log('image', image)
  
  return (
    <div
      className={c(styles.nftCard, { [styles.hasBorder]: hasBorder })}
      onClick={_onClick}
    >
      <div className={styles.nftImage}>
        <HexaBoxContainer>
          <Image
            src={image}
            layout={'fill'}
            alt={'NFT Image'}
          />
        </HexaBoxContainer>
      </div>
      <div className={styles.nftRight}>
        <div className={styles.nftDescription}>
          <div className={styles.nftName}>
            {name}
          </div>
          <div className={styles.nftLabel}>
            <a href="https://magiceden.io">{text}</a> {hint && <span className={styles.hint}>{hint}</span>}
          </div>
        </div>
        {
          text != 'Get your NFT here' &&
          
          <HoneyButton variant="text">
            Up to {buttonText}
            <div className={styles.arrowRight} />
          </HoneyButton>
        }
      </div>
    </div>
  );
};

export default NftCard;
