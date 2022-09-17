import React from 'react';
import NftCard from '../NftCard/NftCard';
import { NftCardProps } from '../NftCard/types';
import * as style from './NftList.css';

type NftListProps = {
  data: NftCardProps[];
  selectNFT: (name: string, id: string, img: string) => void;
};

const NftList = (props: NftListProps) => {
  const { data, selectNFT } = props;
  
  function handleClick(item: any) {
    selectNFT(item.name, item.tokenId, item.image);
  }

  return (
    <div className={style.nftsListContainer}>
      {data &&
        data.map((item, index) => (
          item.name.includes('When') && (
            <div className={style.listItem} key={item.name}>
              <NftCard
                onClick={() => handleClick(item)}
                {...item}
                hasBorder={index !== data.length - 1}
              />
            </div>
          )
        ))}
    </div>
  );
};

export default NftList;
