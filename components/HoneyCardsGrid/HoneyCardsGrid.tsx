import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import * as styles from './HoneyCardsGrid.css';
import c from 'classnames';
import { HoneyCardGridProps } from './types';
import { BorrowPositionCard } from './BorrowPositionCard/BorrowPositionCard';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import SearchInput from '../SearchInput/SearchInput';
import { LendPositionCard } from './LendPositionCard/LendPositionCard';

export const HoneyCardsGrid: FC<HoneyCardGridProps> = ({
  borrowPositions,
  selected,
  lendPositions,
  onSelect
}) => {
  type PositionByType = 'borrow' | 'lend';
  const [positionByType, setPositionByType] =
    useState<PositionByType>('borrow');

  type PositionByValue = 'high_risk' | 'high_ir' | 'high_debt';
  const [positionByValue, setPositionByValue] =
    useState<PositionByValue>('high_risk');

  const [searchValue, setSearchValue] = useState<string | undefined>();

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
    },
    []
  );

  const borrowedPositions = borrowPositions.filter(
    position => position.debt !== 0
  );
  const notBorrowedPositions = borrowPositions.filter(
    position => position.debt === 0
  );

  return (
    <div className={styles.honeyCardsGrid}>
      <div className={c(styles.pageTitle, styles.hideMobile)}>My assets</div>
      <div className={styles.gridFilters}>
        <div className={styles.mobilePageTitle}>
          <div className={c(styles.pageTitle, styles.showMobile)}>My assets</div>

          <HoneyButtonTabs
            items={[
              { name: 'Borrow', slug: 'borrow' },
              { name: 'Lend', slug: 'lend' }
            ]}
            activeItemSlug={positionByType}
            onClick={slug => setPositionByType(slug as PositionByType)}
          />
        </div>

        <div className={styles.searchInputWrapper}>
          <SearchInput
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder="Search by name"
          />
        </div>

        <HoneyButtonTabs
          items={[
            { name: 'High risk', slug: 'high_risk' },
            { name: 'High IR', slug: 'high_ir' },
            { name: 'High Debt', slug: 'high_debt' }
          ]}
          isFullWidth
          activeItemSlug={positionByValue}
          onClick={slug => setPositionByValue(slug as PositionByValue)}
        />
      </div>
      <div className={styles.gridContent}>
        <div className={styles.cardsGrid}>
          {positionByType === 'borrow'
            ? borrowedPositions.map((position, index) => {
              // TODO: DROP THIS CONDITION WHEN WILL USE REAL DATA !!!
              if (position.price > position.debt) {
                  return (
                      <BorrowPositionCard
                        position={position}
                        key={index}
                        isActive={selected === position.id}
                        onSelect={onSelect}
                      />)
                    }
            })
            : lendPositions.map((position, index) => (
                <LendPositionCard
                  position={position}
                  key={index}
                  isActive={selected === position.id}
                  onSelect={onSelect}
                />
              ))}
        </div>
        {Boolean(notBorrowedPositions.length) && positionByType === 'borrow' && (
          <>
            <div className={styles.cardsDivider}>
              <div className={styles.divider} />
              <span className={styles.dividerText}>Your not borrowed NFTs</span>
              <div className={styles.divider} />
            </div>
            <div className={styles.cardsGrid}>
              {notBorrowedPositions.map((position, index) => (
                <BorrowPositionCard
                  position={position}
                  key={index}
                  isActive={selected === position.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
