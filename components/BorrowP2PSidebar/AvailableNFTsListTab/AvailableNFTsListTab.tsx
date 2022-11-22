import * as styles from './AvailableNFTsListTab.css';
import NftList from "../../NftList/NftList";
import { ChooseNFTsTabProps } from "../types";

export const AvailableNFTsListTab = ({ available, onSelect, price, selected }: ChooseNFTsTabProps) => {
  return (
    <div className={styles.availableNFTsTab}>
      <div className={styles.title}>
        Choose NFT
      </div>
      <NftList
        data={available}
        selectNFT={onSelect}
        nftPrice={price}
        selectedNFTMint={selected}
      />
    </div>
  )
}