import * as styles from './AboutMarketStep.css';
import React, { useCallback, useState } from 'react';
import mockCollectionImage from '../../../public/images/mock-collection-image.svg';
import Image from 'next/image';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';
import { PublicKey } from '@solana/web3.js';

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

  // const renderFoundCollectionInfo = () => {
  //   if (collectionUrl.length) {
  //     return (
  //       <div className={styles.foundCollectionInfo}>
  //         <div className={styles.collectionLogo}>
  //           {mockCollectionData.image}
  //         </div>
  //         <div className={styles.collectionInfoContainer}>
  //           <div className={styles.collectionTitle}>
  //             {mockCollectionData.title}
  //           </div>
  //           <div className={styles.collectionDescription}>
  //             {mockCollectionData.description}
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
  // };

  return (
    <div className={styles.aboutMarketStep}>
      <div className={styles.aboutMarketStepContainer}>
        <div className={styles.stepTitle}>
          {/* <TabTitle
            title="About Market"
            tooltip={
              <HoneyTooltip tooltipIcon placement="top" label={'Mock'} />
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
        {/* {renderFoundCollectionInfo()} */}
      </div>
    </div>
  );
};
