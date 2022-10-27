import * as styles from './AboutMarketStep.css';
import React, { useCallback, useState } from 'react';
import mockCollectionImage from '../../../public/images/mock-collection-image.svg';
import Image from 'next/image';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import { HoneyInputWithLabel } from '../../HoneyInputWithLabel/HoneyInputWithLabel';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';

export const AboutMarketStep = () => {
  const [collectionUrl, setCollectionUrl] = useState<string>('');
  const mockCollectionData = {
    title: 'Mock collection title',
    description: 'mock data',
    image: <Image src={mockCollectionImage} className={styles.collectionLogo} />
  };

  const renderFoundCollectionInfo = () => {
    if (collectionUrl.length) {
      return (
        <div className={styles.foundCollectionInfo}>
          <div className={styles.collectionLogo}>
            {mockCollectionData.image}
          </div>
          <div className={styles.collectionInfoContainer}>
            <div className={styles.collectionTitle}>
              {mockCollectionData.title}
            </div>
            <div className={styles.collectionDescription}>
              {mockCollectionData.description}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.aboutMarketStep}>
      <div className={styles.aboutMarketStepContainer}>
        <div className={styles.stepTitle}>
          <TabTitle
            title="About Market"
            tooltip={
              <HoneyTooltip tooltipIcon placement="top" label={'Mock'} />
            }
          />
        </div>
        <HoneyInputWithLabel
          placeholder="Collection URL"
          onChange={e => setCollectionUrl(e.target.value)}
          label="Collection URL"
        />
        {renderFoundCollectionInfo()}
      </div>
    </div>
  );
};
