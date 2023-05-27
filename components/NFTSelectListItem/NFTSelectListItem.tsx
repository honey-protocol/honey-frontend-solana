import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { HoneyCheckbox } from 'components/HoneyCheckbox/HoneyCheckbox';
import Image from 'next/image';
import React, { FC } from 'react';
import honeyGenesisBee from 'public/images/imagePlaceholder.png';
import * as styles from './NFTSelectListItem.css';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';
import { Skeleton } from 'antd';

interface ListItemProps {
  name: string;
  value: string;
  isLoadingValue: boolean;
  tokenName: string;
  image?: string;
  id: string;
  isSelected: boolean;
  disabled?: boolean;
  onChange: (event: CheckboxChangeEvent, id: string) => void;
}

const NFTSelectListItem: FC<ListItemProps> = ({
  name,
  value,
  tokenName,
  image,
  onChange,
  id,
  isSelected,
  disabled,
  isLoadingValue
}) => {
  return (
    <div className={styles.listItem}>
      <div className={styles.listItemLeft}>
        <HoneyTooltip
          placement="right"
          trigger={['hover']}
          title={
            <Image src={image ?? honeyGenesisBee} width={150} height={150} />
          }
        >
          <div className={styles.listItemIcon}>
            <HexaBoxContainer>
              <Image src={image ?? honeyGenesisBee} width={40} height={40} />
            </HexaBoxContainer>
          </div>
        </HoneyTooltip>
        <div className={styles.itemCollection}>
          <div className={styles.itemCollectionName}>{name}</div>
          {isLoadingValue ? (
            <Skeleton.Input
              size="small"
              style={{ height: '14px', marginTop: '3px' }}
              active
            />
          ) : (
            <div className={styles.itemCollectionValue}>
              <div className={styles.itemCollectionToken}>Borrow</div>
              <div className={styles.itemCollectionValueCount}>{value}</div>
              <div className={styles.itemCollectionToken}>{tokenName}</div>
            </div>
          )}
        </div>
      </div>
      <HoneyCheckbox
        disabled={disabled}
        checked={isSelected}
        onChange={e => onChange(e, id)}
      />
    </div>
  );
};

export default NFTSelectListItem;
