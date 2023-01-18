import { FC, useCallback, useEffect, useState } from 'react';
import * as styles from './P2PNftCard.css';
import c from 'classnames';
import { P2PLoanCardProps } from './types';
import Image from 'next/image';
import { Typography } from 'antd';
import { StatusCard } from '../StatusCard/StatusCard';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import { noop } from 'lodash';
import { extractMetaData } from 'helpers/utils';
import { useConnection } from '@saberhq/use-solana';

const { Text } = Typography;

export const P2PLoanCard: FC<P2PLoanCardProps> = ({
  // verified,
  nftMint,
  footer,
  isActive,
  onClick = noop
  // collectionName
}) => {
  const connection = useConnection();

  const [nftDetails, setNFTDetails] = useState<NFT>();
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const fetchLoanMetadata = useCallback(async () => {
    try {
      setIsLoadingDetails(true);
      const nftDetails = await extractMetaData(nftMint, connection);
      setNFTDetails(nftDetails);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [connection, nftMint]);
  useEffect(() => {
    fetchLoanMetadata();
  }, [fetchLoanMetadata]);
  return (
    <div
      className={c(styles.nftCard, { [styles.isActive]: isActive })}
      onClick={onClick}
    >
      <div className={styles.img}>
        <Image
          src={nftDetails?.image ?? honeyGenesisBee}
          alt={`${nftMint.toString()}`}
          layout="fill"
        />
      </div>

      <div className={styles.info}>
        <div className={styles.statusBlock}>
          {/* get collection name and verify status */}
          <StatusCard status={'collectionName'} isVerified={true} />
        </div>

        <Text className={styles.name}>{nftDetails?.name}</Text>

        {footer && <div className={styles.values}>{footer}</div>}
      </div>
    </div>
  );
};
