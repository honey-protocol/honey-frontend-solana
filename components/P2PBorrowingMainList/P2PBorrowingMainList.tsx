import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { P2PBorrowingMainListProps } from './types';
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

export const P2PBorrowingMainList: FC<P2PBorrowingMainListProps> = ({
  data,
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
              isActive={selected === item.address}
              onClick={() => onSelect(item.address)}
              key={index}
              {...item}
              footer={
                <div className={footer}>
                  <InfoBlock title="Value" center value={fs(item.request)} />
                </div>
              }
            />
          ))}
      </div>
    </div>
  );
};
