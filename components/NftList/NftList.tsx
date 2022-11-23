import { MAX_LTV } from 'constants/loan';
import { RoundHalfDown } from 'helpers/utils';
import React from 'react';
import NftCard from '../NftCard/NftCard';
import { NftCardProps } from '../NftCard/types';
import * as style from './NftList.css';
import cs from 'classnames';

type NftListProps = {
  data: NftCardProps[];
  selectNFT: Function
  nftPrice: any;
  selectedNFTMint: string | undefined;
};

const NftList = (props: NftListProps) => {
  const { data, selectNFT, nftPrice, selectedNFTMint } = props;

  function handleClick(item: any) {
    console.log('item----', item)
    selectNFT(item.name, item.image, item.mint, item.creators);
  }

  return (
    <div className={style.nftsListContainer}>
      {data.length > 0 ? (
        data.map((item, index) => {
          return (
            <div
              className={cs(style.listItem, {
                [style.selectedListItem]: item.mint === selectedNFTMint
              })}
              key={item.name}
            >
              <NftCard
                onClick={() => handleClick(item)}
                {...item}
                hasBorder={
                  index !== data.length - 1 || item.mint === selectedNFTMint
                }
                text={`◎ ${nftPrice.toFixed(2)} value`}
                buttonText={RoundHalfDown(nftPrice * MAX_LTV, 4).toString()}
              />
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default NftList;
