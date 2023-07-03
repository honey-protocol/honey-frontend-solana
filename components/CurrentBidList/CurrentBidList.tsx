import React from 'react';
import CurrentBidCard from '../CurrentBidCard/CurrentBidCard';
import { CurrentBidCardProps } from '../CurrentBidCard/types';

type CurrentBidListProps = {
  data: CurrentBidCardProps[];
  fetchedReservePrice: number;
  loanCurrency: string;
};

const CurrentBidList = (props: CurrentBidListProps) => {
  const { data, fetchedReservePrice, loanCurrency } = props;

  return (
    <>
      {data &&
        data.map((item, index) => (
          <div key={index}>
            <CurrentBidCard
              {...item}
              fetchedReservePrice={fetchedReservePrice}
              hasBorder={index !== data.length - 1}
              loanCurrency={loanCurrency}
            />
          </div>
        ))}
    </>
  );
};

export default CurrentBidList;
