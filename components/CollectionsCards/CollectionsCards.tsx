import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { categorySortType, CollectionsCardsProps, statusType } from './types';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import SearchInput from '../SearchInput/SearchInput';
import { CollectionCard } from '../CollectionCard/CollectionCard';
import {
  cardsContainer,
  cardsGrid,
  gridFilters,
  searchInputWrapper
} from '../../styles/p2p.css';

export const CollectionsCards: FC<CollectionsCardsProps> = ({
  data,
  selectedCollectionId,
  onCollectionSelect
}) => {
  const [collectionsStatusType, setCollectionsStatusType] =
    useState<statusType>('verified');
  const [categorySortType, setCategorySortType] =
    useState<categorySortType>('top');

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
            { name: 'Top', slug: 'top' },
            { name: 'Trending', slug: 'trending' },
            { name: 'Newcomers', slug: 'newcomers' }
          ]}
          activeItemSlug={categorySortType}
          onClick={slug => setCategorySortType(slug as categorySortType)}
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
            { name: 'Verified', slug: 'verified' },
            { name: 'All', slug: 'all' }
          ]}
          activeItemSlug={collectionsStatusType}
          onClick={slug => setCollectionsStatusType(slug as statusType)}
        />
      </div>

      <div className={cardsGrid}>
        {data &&
          data.map((items, index) => (
            <CollectionCard
              isActive={selectedCollectionId === items.id}
              onSelect={onCollectionSelect}
              key={index}
              {...items}
            />
          ))}
      </div>
    </div>
  );
};
