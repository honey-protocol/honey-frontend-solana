import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { CategoryCardProps, collectionsSortType, statusType } from './types';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import SearchInput from '../SearchInput/SearchInput';
import { CollectionCard } from '../CollectionCard/CollectionCard';
import {
  cardsContainer,
  cardsGrid,
  gridFilters,
  searchInputWrapper
} from '../../styles/p2p.css';

export const CategoryCards: FC<CategoryCardProps> = ({
  data,
  selected,
  onSelect
}) => {
  const [collectionsStatusType, setCollectionsStatusType] =
    useState<statusType>('verified');
  const [collectionsSortType, setCollectionsSortType] =
    useState<collectionsSortType>('collections');

  const [searchValue, setSearchValue] = useState<string | undefined>();

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
        <HoneyButtonTabs
          items={[
            { name: 'Verified', slug: 'verified' },
            { name: 'All', slug: 'all' }
          ]}
          activeItemSlug={collectionsStatusType}
          onClick={slug => setCollectionsStatusType(slug as statusType)}
        />
        <div className={searchInputWrapper}>
          <SearchInput
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder="Search by asset or collection name"
          />
        </div>
        <HoneyButtonTabs
          items={[
            { name: 'Collections', slug: 'collections' },
            { name: 'Assets', slug: 'assets' }
          ]}
          activeItemSlug={collectionsSortType}
          onClick={slug => setCollectionsSortType(slug as collectionsSortType)}
        />
      </div>

      <div className={cardsGrid}>
        {data &&
          data.map((items, index) => (
            <CollectionCard
              isActive={selected?.id === items.id}
              onSelect={onSelect}
              key={index}
              {...items}
            />
          ))}
      </div>
    </div>
  );
};
