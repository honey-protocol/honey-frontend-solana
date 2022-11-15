import React, { FC, useState, useCallback } from 'react';
import Image from 'next/image';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { PublicKey } from '@solana/web3.js';

import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { HoneyCheckbox } from 'components/HoneyCheckbox/HoneyCheckbox';
import { useAccounts } from 'hooks/useAccounts';
import { useLocker } from 'hooks/useVeHoney';
import { formatNumber } from 'helpers/format';

import honeyGenesisBee from 'public/images/imagePlaceholder.png';
import * as styles from './BurnNftsForm.css';

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

interface ListItemProps {
  name: string;
  value: string;
  image?: string;
  id: string;
  isSelected: boolean;
  onChange: (event: CheckboxChangeEvent, id: string) => void;
}

const ListItem: FC<ListItemProps> = ({
  name,
  value,
  image,
  onChange,
  id,
  isSelected
}) => {
  return (
    <div className={styles.listItem}>
      <div className={styles.listItemLeft}>
        <div className={styles.listItemIcon}>
          <HexaBoxContainer>
            <Image src={image ?? honeyGenesisBee} width={40} height={40} />
          </HexaBoxContainer>
        </div>

        <div className={styles.itemCollection}>
          <div className={styles.itemCollectionName}>{name}</div>
          <div className={styles.itemCollectionValue}>
            <div className={styles.itemCollectionValueCount}>{value}</div>
            <div className={styles.itemCollectionToken}>veHONEY</div>
          </div>
        </div>
      </div>
      <HoneyCheckbox checked={isSelected} onChange={e => onChange(e, id)} />
    </div>
  );
};

const BurnNftsForm = (props: { onCancel: Function }) => {
  const [selected, setSelected] = useState<string>();
  const { nfts } = useAccounts();
  const { maxNFTRewardAmount, lockNft } = useLocker();

  const onItemSelect = (e: CheckboxChangeEvent, id: string) => {
    if (e.target.checked) {
      setSelected(id);
    } else {
      setSelected(undefined);
    }
  };

  const lockNFT = useCallback(async () => {
    if (selected) {
      await lockNft(new PublicKey(selected));
    }
  }, [lockNft, selected]);

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton onClick={() => props.onCancel()} variant="secondary">
              Close
            </HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={!selected}
              block
              onClick={lockNFT}
            >
              Burn NFT
            </HoneyButton>
          </div>
        </div>
      }
    >
      <div className={styles.burnNftsForm}>
        <div className={styles.articleWrapper}>
          <div className={styles.articleTitle}>Burn your NFTs</div>
          <div className={styles.articleDescription}>
            Earn 20,379.24 veHONEY
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning message="You can burn your Bee NFT and get some veHONEY tokens to participate in governance. Note that it can’t be undone" />
          </div>
        </div>

        <div className={styles.list}>
          {nfts.map(nft => (
            <ListItem
              key={nft.data.mint.toBase58()}
              id={nft.data.mint.toString()}
              name={nft.data.name}
              image={nft.data.image}
              value={f(maxNFTRewardAmount?.asNumber)}
              isSelected={selected === nft.data.mint.toBase58()}
              onChange={onItemSelect}
            />
          ))}
        </div>
      </div>
    </SidebarScroll>
  );
};

export default BurnNftsForm;
