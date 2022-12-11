import React, { FC, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { PublicKey } from '@solana/web3.js';

import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { HoneyCheckbox } from 'components/HoneyCheckbox/HoneyCheckbox';
import { useAccounts } from 'hooks/useAccounts';
import { useGovernance, useLocker } from 'hooks/useVeHoney';
import { formatNumber } from 'helpers/format';

import honeyGenesisBee from 'public/images/imagePlaceholder.png';
import * as styles from './BurnNftsForm.css';
import useToast from 'hooks/useToast';
import { ProofType } from 'contexts/GovernanceProvider';

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
  const [selected, setSelected] = useState<string[]>([]);
  const { nfts } = useAccounts();
  const { proofs } = useGovernance();
  const { maxNFTRewardAmount, lockNft } = useLocker();
  const { toast, ToastComponent } = useToast();

  const onItemSelect = (e: CheckboxChangeEvent, id: string) => {
    if (e.target.checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter(i => i !== id));
    }
  };

  const burnableNfts = useMemo(() => {
    if (!proofs) return;
    const finalResults = [];
    for (let i = 0; i < proofs.length; i++) {
      if (proofs[i].proofType === ProofType.Creator) {
        const results = nfts.filter(nft => {
          if (!nft.data.creators) {
            return false;
          }
          const nftVerifiedCreatorAdresses = nft.data.creators
            .filter(creator => creator.verified)
            .map(creator => creator.address);
          return nftVerifiedCreatorAdresses.includes(
            proofs[i].proofAddr.toString()
          );
        });
        finalResults.push(...results);
      } else if (proofs[i].proofType === ProofType.Mint) {
        const results = nfts.filter(
          nft => nft.data.mint.toString() === proofs[i].proofAddr.toString()
        );
        finalResults.push(...results);
      }
    }
    return finalResults;
  }, [nfts, proofs]);

  const lockNFT = useCallback(async () => {
    if (selected && selected.length > 0) {
      try {
        toast.processing();
        await lockNft(selected.map(s => new PublicKey(s)));
        toast.success('Successfully burnt NFT');
      } catch (error) {
        toast.error('Error. Failed to burn NFT');
      }
    }
  }, [lockNft, selected, toast]);

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
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
                Burn NFTs
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.burnNftsForm}>
        <div className={styles.articleWrapper}>
          <div className={styles.articleTitle}>Burn your NFTs</div>
          <div className={styles.articleDescription}>Earn veHONEY</div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message={`You can burn your Genesis Bee NFT and get some veHONEY tokens to participate in governance. 
            Note that this can’t be undone. 
            Learn more about this in our docs.`}
            />
          </div>
        </div>

        <div className={styles.list}>
          {burnableNfts?.map(nft => (
            <ListItem
              key={nft.data.mint.toBase58()}
              id={nft.data.mint.toString()}
              name={nft.data.name}
              image={nft.data.image}
              value={f(maxNFTRewardAmount?.asNumber)}
              isSelected={selected.includes(nft.data.mint.toBase58())}
              onChange={onItemSelect}
            />
          ))}
        </div>
      </div>
    </SidebarScroll>
  );
};

export default BurnNftsForm;
