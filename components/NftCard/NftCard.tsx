import React, { useCallback } from 'react';
import * as styles from './NftCard.css';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../HoneyButton/HoneyButton';
import { NftCardProps } from './types';
import c from 'classnames';
import Image from 'next/image';
import { defaultNFTImageUrl } from 'hooks/useNFTV3';

const NftCard = (props: NftCardProps) => {
  const {
    onClick,
    name,
    text,
    hint,
    buttonText,
    image,
    mint,
    creators,
    hasBorder = true
  } = props;
  // runs onClick which is handleClick from NftList component - which selects the NFT
  const _onClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick(name, image, mint, creators);
    }
  }, [mint]);

  const cloudinary_uri = process.env.CLOUDINARY_URI;
  const imageSrc =
    image === defaultNFTImageUrl
      ? image
      : `https://res.cloudinary.com/${cloudinary_uri}/image/fetch/${image}`;

  return (
    <div
      className={c(styles.nftCard, { [styles.hasBorder]: hasBorder })}
      onClick={_onClick}
    >
      <div className={styles.nftImage}>
        <HexaBoxContainer>
          <Image src={imageSrc} layout={'fill'} alt={'NFT Image'} />
        </HexaBoxContainer>
      </div>
      <div className={styles.nftRight}>
        <div className={styles.nftDescription}>
          <div className={styles.nftName}>{name}</div>
          <div className={styles.nftLabel}>
            {text} {hint && <span className={styles.hint}>{hint}</span>}
          </div>
        </div>
        {text != 'Select a market for your NFTs' && (
          <HoneyButton variant="text">
            Up to {buttonText}
            <div className={styles.arrowRight} />
          </HoneyButton>
        )}
      </div>
    </div>
  );
};

export default NftCard;
