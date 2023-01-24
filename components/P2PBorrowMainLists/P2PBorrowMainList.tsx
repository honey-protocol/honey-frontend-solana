import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { P2PBorrowMainListProps } from './types';
import SearchInput from '../SearchInput/SearchInput';
import {
  cardsContainer,
  cardsGrid,
  gridFilters,
  searchInputWrapper,
  footer
} from '../../styles/p2p.css';
import { P2PNftCard } from '../P2PNftCard/P2PNftCard';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber } from '../../helpers/format';
import { noop } from 'lodash';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';

export const P2PBorrowMainList: FC<P2PBorrowMainListProps> = ({
  data,
  PageModeSwitchTab,
  selected,
  onSelect = noop
}) => {
  const { formatSol: fs } = formatNumber;

  return (
    <div className={cardsContainer}>
      {data.length ? (
        <div className={cardsGrid}>
          {data.map((item, index) => (
            <P2PNftCard
              isActive={selected === item.mint}
              onClick={() => onSelect(item.mint)}
              key={index}
              {...item}
              footer={
                <div className={footer}>
                  <InfoBlock title="Value" center value={fs(0)} />
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyStateDetails icon="" title="No NFTs found" description="" />
      )}
    </div>
  );
};
