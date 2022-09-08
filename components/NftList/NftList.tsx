import React from 'react';
import NftCard from '../NftCard/NftCard';
import { NftCardProps } from '../NftCard/types';
import * as style from './NftList.css';

type NftListProps = {
  data: NftCardProps[];
  onItemClick: (id: string) => void;
};

const NftList = (props: NftListProps) => {
  const { data, onItemClick } = props;

  return (
    <div className={style.nftsListContainer}>
      {data &&
        data.map((item, index) => (
          <div className={style.listItem} key={item.name}>
            <NftCard
              onClick={onItemClick}
              {...item}
              hasBorder={index !== data.length - 1}
            />
          </div>
        ))}
    </div>
  );
};

export default NftList;
