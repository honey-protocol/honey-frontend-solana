import { HONEY_GENESIS_MARKET_ID, MAX_LTV, PESKY_PENGUINS_MARKET_ID } from 'constants/loan';
import { RoundHalfDown } from 'helpers/utils';
import React, {useEffect, useState} from 'react';
import NftCard from '../NftCard/NftCard';
import { NftCardProps } from '../NftCard/types';
import * as style from './NftList.css';
import cs from 'classnames';
import { renderNftList } from 'helpers/marketHelpers';
import { 
  HONEY_GENESIS_BEE_MARKET_NAME, 
  OG_ATADIANS_MARKET_NAME, 
  PESKY_PENGUINS_MARKET_NAME, 
  BURRITO_BOYZ_MARKET_NAME, 
  LIFINITY_FLARES_MARKET_NAME 
} from '../../helpers/marketHelpers';

type NftListProps = {
  data: NftCardProps[];
  selectNFT: (name: string, img: string, mint: any) => void;
  nftPrice: any;
  selectedNFTMint: string | undefined;
  currentMarketId: string;
};

const NftList = (props: NftListProps) => {
  const { data, selectNFT, nftPrice, selectedNFTMint, currentMarketId } = props;
  const [nftList, setNftList] = useState<Array<NFT>>([]);

  function handleClick(item: any) {
    selectNFT(item.name, item.image, item.mint);
  }

  async function filterNfts(currentMarketId: string, data: any) {
    const outcome = await renderNftList(currentMarketId, data);
    console.log('xyzz: outcome', outcome);
    setNftList(outcome);
  }

  useEffect(() => {
    if (currentMarketId && data) filterNfts(currentMarketId, data)
  }, [currentMarketId, data]);


  return (
    <div className={style.nftsListContainer}>
      {nftList && nftList.map(
          (item, index) =>  {
            console.log('ABC', item)
              return (
                <div 
                  className={cs(style.listItem, {[style.selectedListItem]: item.mint === selectedNFTMint })}
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
              )
            }
        )
      }
    </div>
  );
};

export default NftList;
