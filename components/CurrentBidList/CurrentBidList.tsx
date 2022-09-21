import React from 'react';
import CurrentBidCard from '../CurrentBidCard/CurrentBidCard';
import { CurrentBidCardProps } from '../CurrentBidCard/types';

type CurrentBidListProps = {
  data: CurrentBidCardProps[];
};

const CurrentBidList = (props: CurrentBidListProps) => {
  const { data } = props;

  return (
    <>
      {data &&
        data.map((item, index) => (
          <div key={index}>
            <CurrentBidCard
              {...item}
              hasBorder={index !== data.length - 1}
            />
          </ div>
        ))}
    </>
  );
};

export default CurrentBidList;
