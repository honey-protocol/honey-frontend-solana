import React from 'react';
import CurrentBidCard from '../CurrentBidCard/CurrentBidCard';
import { CurrentBidCardProps } from '../CurrentBidCard/types';

type CurrentBidListProps = {
  data: CurrentBidCardProps[];
  fetchedReservePrice: number;
};

const CurrentBidList = (props: CurrentBidListProps) => {
  const { data, fetchedReservePrice } = props;

  return (
    <>
      {data &&
        data.map((item, index) => (
          <div key={index}>
            <CurrentBidCard
              {...item}
              fetchedReservePrice={fetchedReservePrice}
              hasBorder={index !== data.length - 1}
            />
          </div>
        ))}
    </>
  );
};

export default CurrentBidList;
