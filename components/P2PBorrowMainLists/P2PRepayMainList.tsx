import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { P2PRepayMainListProps } from './types';
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
import { P2PLoan } from 'types/p2p';
import { P2PLoanCard } from 'components/P2PNftCard/P2PLoanCard';

export const P2PRepayMainList: FC<P2PRepayMainListProps> = ({
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
        {data.length &&
          data.map((item: P2PLoan, index) => (
            <P2PLoanCard
              isActive={selected === Object.keys(data)[index]}
              onClick={() => onSelect()}
              key={index}
              {...item}
              footer={
                <div className={footer}>
                  <InfoBlock
                    title="Value"
                    center
                    value={fs(item.requestedAmount.toNumber())}
                  />
                </div>
              }
            />
          ))}
      </div>
    </div>
  );
};
