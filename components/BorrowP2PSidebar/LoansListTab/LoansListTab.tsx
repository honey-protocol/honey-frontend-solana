import * as styles from './LoansListTab.css';
import { P2PLoan, P2PLoans, P2PPosition } from '../../../types/p2p';
import c from 'classnames';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import React from 'react';
import { formatNumber } from '../../../helpers/format';
import { differenceInDays, differenceInHours } from 'date-fns';
import LoansListCard from './LoansListCard';

type LoansListTabProps = {
  loans: P2PLoans;
  onSelect: (loan: P2PLoan) => void;
  selected?: string;
};

const { formatPercentRounded: fpr, formatSol: fs } = formatNumber;

export const LoansListTab = ({
  loans,
  onSelect,
  selected
}: LoansListTabProps) => {
  const calcLoanPeriod = (start: number, end: number) => {};

  const pluralize = (text: string, value: number): string => {
    return value > 1 ? `${text}s` : text;
  };
  const formatLoanPeriod = (start: number, end: number) => {
    const days = differenceInDays(end, start);
    let hours = differenceInHours(end, start);
    return days < 1
      ? `${hours} ${pluralize('hour', hours)}`
      : `${days} ${pluralize('day', days)}`;
  };

  return (
    <div className={styles.LoansList}>
      {loans.map((loan: P2PLoan) => {
        return (
          <LoansListCard
            loan={loan}
            key={loan.nftMint.toString()}
            selected={selected}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
};
