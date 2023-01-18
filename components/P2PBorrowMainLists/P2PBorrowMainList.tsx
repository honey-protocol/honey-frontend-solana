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

export const P2PBorrowMainList: FC<P2PBorrowMainListProps> = ({
  data,
  PageModeSwitchTab,
  selected,
  onSelect = noop
}) => {
  const [searchValue, setSearchValue] = useState<string | undefined>();

  const { formatSol: fs } = formatNumber;

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
    },
    []
  );

  return (
    <div className={cardsContainer}>
      <div className={gridFilters}>
        {PageModeSwitchTab && <PageModeSwitchTab />}
        <div className={searchInputWrapper}>
          <SearchInput
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder="Search by name"
          />
        </div>
      </div>

      <div className={cardsGrid}>
        {data &&
          data.map((item, index) => (
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
    </div>
  );
};
