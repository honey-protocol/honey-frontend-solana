import { MAX_LTV } from 'constants/loan';
import { RoundHalfDown } from 'helpers/utils';
import React from 'react';
import NftCard from '../NftCard/NftCard';
import { NftCardProps } from '../NftCard/types';
import * as style from './NftList.css';

type NftListProps = {
  data: NftCardProps[];
  selectNFT: (name: string, img: string, mint: any) => void;
  nftPrice: any;
};

const NftList = (props: NftListProps) => {
  const { data, selectNFT, nftPrice } = props;
  
  function handleClick(item: any) {
    console.log('item', item)
    selectNFT(item.name, item.image, item.mint);
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
                text={`$ ${nftPrice.toFixed(2)} value`}
                buttonText={(RoundHalfDown(nftPrice * MAX_LTV, 4)).toString()}
              />
            </div>
          )
        ))}
    </div>
  );
};

export default NftList;
