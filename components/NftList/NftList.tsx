import { MAX_LTV } from 'constants/loan';
import { RoundHalfDown } from 'helpers/utils';
import React from 'react';
import NftCard from '../NftCard/NftCard';
import { NftCardProps } from '../NftCard/types';
import * as style from './NftList.css';
import cs from 'classnames';
// type definition for Nft list
type NftListProps = {
  data: NftCardProps[];
  selectNFT: Function
  nftPrice: any;
  selectedNFTMint: string | undefined;
};
// type definition for Nft Object 
type NFTObject = {
  name: string;
  image: string;
  mint: string;
  creators: [];
  symbol?: string;
  tokenId?: string;
  updateAuthority?: string;
}

const NftList = (props: NftListProps) => {
  // get props
  const { data, selectNFT, nftPrice, selectedNFTMint } = props;
  /**
   * @description runs selectNFT with nft
   * @params NFT object - see type definition NFTObject
   * @returns fires off selectNFT with desired values
  */
  function handleClick(nft: NFTObject) {
    selectNFT(nft.name, nft.image, nft.mint, nft.creators);
  }

  return (
    <div className={style.nftsListContainer}>
      {data.length > 0 ? (
        data.map((nft, index) => {
          return (
            <div
              className={cs(style.listItem, {
                [style.selectedListItem]: nft.mint === selectedNFTMint
              })}
              key={nft.name}
            >
              <NftCard
                onClick={() => handleClick(nft)}
                {...nft}
                hasBorder={
                  index !== data.length - 1 || nft.mint === selectedNFTMint
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
