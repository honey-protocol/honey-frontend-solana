import * as styles from './BorrowP2PSidebarHeader.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import { BorrowP2PSidebarHeaderProps } from '../types';

export const BorrowP2PSidebarHeader = ({
  NFTName,
  collectionName,
  isVerifiedCollection,
  NFTLogo
}: BorrowP2PSidebarHeaderProps) => {
  return (
    <div className={styles.NFTInfoSection}>
      <div className={styles.NFTLogoWrapper}>
        <HexaBoxContainer>
          <img className={styles.NFTLogo} src={NFTLogo} alt="x" />
        </HexaBoxContainer>
      </div>
      <div className={styles.NFTDescriptionWrapper}>
        <div className={styles.NFTTitle}>{NFTName}</div>
        <div className={styles.NFTCollectionTitle}>
          {collectionName}{' '}
          {isVerifiedCollection && (
            <div className={styles.NFTCollectionCheckIcon} />
          )}
        </div>
      </div>
    </div>
  );
};
