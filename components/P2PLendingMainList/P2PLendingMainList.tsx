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
import { getProgram } from 'helpers/p2p/getProgram';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { P2PLoan } from 'types/p2p';
import BN from 'bn.js';
import { P2PLoanCard } from 'components/P2PNftCard/P2PLoanCard';
import { LOAN_CURRENCY_LAMPORTS, ONE_DAY_IN_SECONDS } from 'constants/p2p';
const { Text } = Typography;

export const P2PLendingMainList: FC<P2PLendingMainListProps> = ({
  isFilterOpened,
  data,
  selected,
  onSelect = noop
}) => {
  const [searchValue, setSearchValue] = useState<string | undefined>();

  const { formatPercent: fp, formatSol: fs, formatUsd: fd } = formatNumber;

  const getPositionPeriodFormatted = (
    dateLeft: number,
    fateRight: number
  ): ReactNode => {
    const diff = differenceInDays(dateLeft, fateRight);
    return `${differenceInDays(dateLeft, fateRight).toString()} day${
      diff > 1 ? 's' : ''
    }`;
  };

  console.log(data);

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
        {data.length &&
          data.map((item: P2PLoan, index) => (
            <P2PLoanCard
              isActive={
                selected?.nftMint?.toString() === item.nftMint.toString()
              }
              onClick={() => onSelect(item)}
              key={index}
              {...item}
              footer={
                <>
                  <InfoBlock
                    title="Request"
                    center
                    value={fd(
                      Number(item.requestedAmount) / LOAN_CURRENCY_LAMPORTS
                    )}
                  />
                  <InfoBlock
                    title="IR"
                    center
                    value={Number(item.interest).toFixed() + '%'}
                  />
                  <InfoBlock
                    title="Period"
                    center
                    // value={`${getPositionPeriodFormatted(
                    //   item.end,
                    //   item.start
                    // )}`}
                    value={
                      (Number(item?.period) / ONE_DAY_IN_SECONDS).toString() +
                      'D'
                    }
                  />
                </>
              }
            />
          ))}
      </div>
    </div>
  );
};
