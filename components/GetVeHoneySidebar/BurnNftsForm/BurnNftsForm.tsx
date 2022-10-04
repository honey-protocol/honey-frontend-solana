import React, { FC, useState } from 'react';
import * as styles from './BurnNftsForm.css';
import { formatNumber } from '../../../helpers/format';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import HoneyWarning from '../../HoneyWarning/HoneyWarning';
import HoneyButton from '../../HoneyButton/HoneyButton';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import honeyEyes from '/public/nfts/honeyEyes.png';
import { Checkbox } from 'antd';
import Image from 'next/image';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { HoneyCheckbox } from '../../HoneyCheckbox/HoneyCheckbox';

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const nftToBurn = [
  {
    name: 'HONEY #1291',
    value: '1,000',
    id: '1'
  },
  {
    name: 'HONEY #1291',
    value: '1,000',
    id: '2'
  },
  {
    name: 'HONEY #1291',
    value: '1,000',
    id: '3'
  },
  {
    name: 'HONEY #1291',
    value: '1,000',
    id: '4'
  },
  {
    name: 'HONEY #1291',
    value: '1,000',
    id: '5'
  }
];

interface ListItemProps {
  name: string;
  value: string;
  id: string;
  isSelected: boolean;
  onChange: (event: CheckboxChangeEvent, id: string) => void;
}

const ListItem: FC<ListItemProps> = ({
  name,
  value,
  onChange,
  id,
  isSelected
}) => {
  return (
    <div className={styles.listItem}>
      <div className={styles.listItemLeft}>
        <div className={styles.listItemIcon}>
          <HexaBoxContainer>
            <Image src={honeyEyes} />
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

const BurnNftsForm: FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const onItemSelect = (e: CheckboxChangeEvent, id: string) => {
    if (e.target.checked) {
      setSelected(prevState => [...prevState, id]);
    } else {
      setSelected(prevState => prevState.filter(item => item !== id));
    }
  };

  const setSelectAll = () => {
    setSelected(nftToBurn.map(token => token.id));
  };

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary">Close</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={false}
              isFluid={true}
              onClick={setSelectAll}
            >
              {selected.length ? 'Burn selected' : 'Select All'}
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
            <HoneyWarning
              message="You can burn your Bee NFT and get some veHONEY tokens to participate in governance. Note that it can’t be undone"
              link="https://google.com"
            />
          </div>
        </div>

        <div className={styles.list}>
          {nftToBurn.map((token, index) => (
            <ListItem
              key={index}
              id={token.id}
              name={token.name}
              value={token.value}
              isSelected={selected.includes(token.id)}
              onChange={onItemSelect}
            />
          ))}
        </div>
      </div>
    </SidebarScroll>
  );
};

export default BurnNftsForm;