import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useCallback,
  useState
} from 'react';
import * as styles from './P2PLendingMainList.css';
import c from 'classnames';
import { P2PLendingMainListProps } from './types';
import SearchInput from '../SearchInput/SearchInput';
import {
  cardsContainer,
  cardsGrid,
  gridFilters,
  searchInputWrapper
} from '../../styles/p2p.css';
import { Typography } from 'antd';
import { P2PNftCard } from '../P2PNftCard/P2PNftCard';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber } from '../../helpers/format';
import { differenceInDays } from 'date-fns';
import { noop } from 'lodash';
const { Text } = Typography;

export const P2PLendingMainList: FC<P2PLendingMainListProps> = ({
  isFilterOpened,
  data,
  selected,
  onSelect = noop
}) => {
  const [searchValue, setSearchValue] = useState<string | undefined>();

  const { formatPercent: fp, formatSol: fs } = formatNumber;

  const getPositionPeriodFormatted = (
    dateLeft: number,
    fateRight: number
  ): ReactNode => {
    const diff = differenceInDays(dateLeft, fateRight);
    return `${differenceInDays(dateLeft, fateRight).toString()} day${
      diff > 1 ? 's' : ''
    }`;
  };

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

        <div className={c(styles.filterBtn, { [styles.open]: isFilterOpened })}>
          <div className={styles.filter} />
          <Text className={styles.textBtn}>filter</Text>
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
                <>
                  <InfoBlock title="Request" center value={fs(item.request)} />
                  <InfoBlock title="IR" center value={fp(item.ir)} />
                  <InfoBlock
                    title="Period"
                    center
                    value={`${getPositionPeriodFormatted(
                      item.end,
                      item.start
                    )}`}
                  />
                </>
              }
            />
          ))}
      </div>
    </div>
  );
};
