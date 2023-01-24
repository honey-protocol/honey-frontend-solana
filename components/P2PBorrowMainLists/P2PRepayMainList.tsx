import React, { FC } from 'react';
import { P2PRepayMainListProps } from './types';
import { cardsContainer, cardsGrid, footer } from '../../styles/p2p.css';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber } from '../../helpers/format';
import { noop } from 'lodash';
import { P2PLoan } from 'types/p2p';
import { P2PLoanCard } from 'components/P2PNftCard/P2PLoanCard';
import { emptyPageContainer } from 'styles/common.css';

export const P2PRepayMainList: FC<P2PRepayMainListProps> = ({
  data,
  selected,
  onSelect = noop
}) => {
  const { formatSol: fs } = formatNumber;

  return (
    <div className={cardsContainer}>
      {data.length ? (
        <div className={cardsGrid}>
          {data.map((item: P2PLoan, index) => (
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
      ) : (
        <div className={emptyPageContainer}>No Loans found</div>
      )}
    </div>
  );
};
