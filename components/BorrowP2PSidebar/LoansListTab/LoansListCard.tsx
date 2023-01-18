import { useConnection } from '@saberhq/use-solana';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { extractMetaData } from 'helpers/utils';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { P2PLoan } from 'types/p2p';
import * as styles from './LoansListTab.css';
import { formatNumber } from '../../../helpers/format';
import c from 'classnames';

const { formatPercentRounded: fpr, formatSol: fs } = formatNumber;

type LoansListCardProps = {
  loan: P2PLoan;
  onSelect: (address: string) => void;
  selected?: string;
};

const LoansListCard = (props: LoansListCardProps) => {
  const { loan, selected, onSelect } = props;
  const connection = useConnection();
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [nftDetails, setNFTDetails] = useState<NFT>();

  const fetchLoanMetadata = useCallback(async () => {
    try {
      setIsLoadingDetails(true);
      const nftDetails = await extractMetaData(loan.nftMint, connection);
      setNFTDetails(nftDetails);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [connection, loan.nftMint]);
  useEffect(() => {
    fetchLoanMetadata();
  }, [fetchLoanMetadata]);

  if (!nftDetails || isLoadingDetails) {
    return <div>No nfts</div>;
  }

  return (
    <div
      key={loan.nftMint.toString()}
      className={c(styles.loan.section, { [styles.selected]: selected })}
      onClick={() => onSelect(loan.nftMint.toString())}
    >
      <div className={styles.loan.image}>
        <HexaBoxContainer>
          <Image src={nftDetails.image} alt={nftDetails.name} layout="fill" />
        </HexaBoxContainer>
      </div>

      <div className={styles.loan.info}>
        <div className={styles.loan.title}>{nftDetails.name}</div>
        <div className={styles.loanStats.section}>
          <div className={styles.loanStats.row}>
            <div className={styles.loanStats.label}>Value: </div>
            <div className={styles.loanStats.value}>
              {/* {fs(loan.requestedAmount)} */}
              {fs(0)}
            </div>
          </div>

          <div className={styles.loanStats.row}>
            <div className={styles.loanStats.label}>Interest Ratio: </div>
            <div className={styles.loanStats.value}>
              {/* {fpr(loan.interest.toNumber())} */}
              {fpr(1000)}
            </div>
          </div>

          <div className={styles.loanStats.row}>
            <div className={styles.loanStats.label}>Time left: </div>
            <div className={styles.loanStats.value}>
              {/* {formatLoanPeriod(loan.start, loan.end)} */}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.loan.arrow}></div>
    </div>
  );
};

export default LoansListCard;
