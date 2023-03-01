import * as styles from './AboutMarketStep.css';
import React from 'react';
import mockCollectionImage from '../../../public/images/mock-collection-image.svg';
import Image from 'next/image';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';

interface AboutMarketStepProps {
  collectionName: string;
  setCollectionName: any;
  collectionUrl: string;
  setCollectionUrl: any;
  collectionCreator: string | undefined;
  setNftCollectionCreator: any;
}
export const AboutMarketStep = (props: AboutMarketStepProps) => {
  const {
    setNftCollectionCreator,
    setCollectionUrl,
    setCollectionName,
    collectionCreator,
    collectionName,
    collectionUrl
  } = props;

  const cloudinary_uri = process.env.CLOUDINARY_URI;

  const mockCollectionData = {
    title: 'Mock collection title',
    description: 'mock data',
    image: (
      <Image
        src={`${cloudinary_uri}${mockCollectionImage}`}
        className={styles.collectionLogo}
      />
    )
  };

  const onChange = (value: string) => {
    try {
      setNftCollectionCreator(value);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.aboutMarketStep}>
      <div className={styles.aboutMarketStepContainer}>
        <div className={styles.stepTitle}></div>
        <HoneyInputWithLabel
          placeholder="NFT collection name"
          onChange={e => setCollectionName(e.target.value)}
          label="Collection Name"
          value={collectionName}
        />
        <div className={styles.spacer}></div>
        <HoneyInputWithLabel
          placeholder="https://magiceden.io/marketplace/y00ts"
          onChange={e => setCollectionUrl(e.target.value)}
          label="Collection on Magic Eden"
          value={collectionUrl}
        />
        <div className={styles.spacer}></div>
        <HoneyInputWithLabel
          placeholder="Collection's Verified Creator"
          onChange={e => setNftCollectionCreator(e.target.value)}
          label="Verified Creator"
          value={collectionCreator}
        />
      </div>
    </div>
  );
};
