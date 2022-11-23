import * as styles from './AboutMarketStep.css';
import React from 'react';
import mockCollectionImage from '../../../public/images/mock-collection-image.svg';
import Image from 'next/image';
import { PublicKey } from '@solana/web3.js';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';
import SectionTitle from '../../SectionTitle/SectionTitle';

interface AboutMarketStepProps {
  setCollectionName: any;
  setCollectionUrl: any;
  setNftCollectionCreator: any;
}
export const AboutMarketStep = (props: AboutMarketStepProps) => {
  const { setNftCollectionCreator, setCollectionUrl, setCollectionName } =
    props;

  const mockCollectionData = {
    title: 'Mock collection title',
    description: 'mock data',
    image: <Image src={mockCollectionImage} className={styles.collectionLogo} />
  };

  const onChange = (value: string) => {
    try {
      const pk = new PublicKey(value);
      setNftCollectionCreator(pk);
    } catch (e) {}
  };

  return (
    <div className={styles.aboutMarketStep}>
      <div className={styles.aboutMarketStepContainer}>
        <div className={styles.stepTitle}>
          {/* <SectionTitle
            title="About Market"
            tooltip={
              <HoneyTooltip tooltipIcon placement="top" title={'Mock'} />
            }
          /> */}
        </div>
        <HoneyInputWithLabel
          placeholder="NFT collection name"
          onChange={e => setCollectionName(e.target.value)}
          label="Collection Name"
        />
        <div className={styles.spacer}></div>
        <HoneyInputWithLabel
          placeholder="https://magiceden.io/marketplace/y00ts"
          onChange={e => setCollectionUrl(e.target.value)}
          label="Collection on Magic Eden"
        />
        <div className={styles.spacer}></div>
        <HoneyInputWithLabel
          placeholder="Collection's Verified Creator"
          onChange={e => onChange(e.target.value)}
          label="Verified Creator"
        />
      </div>
    </div>
  );
};
