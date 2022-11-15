import * as styles from './LoansListTab.css';
import { P2PPosition } from '../../../types/p2p';
import c from 'classnames';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import React from 'react';
import { formatNumber } from '../../../helpers/format';
import { differenceInDays, differenceInHours } from 'date-fns';

type LoansListTabProps = {
  loans: P2PPosition[];
  onSelect: (address: string) => void;
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
      {loans.map(loan => {
        return (
          <div
            key={loan.address}
            className={c(styles.loan.section, { [styles.selected]: selected })}
            onClick={() => onSelect(loan.address)}
          >
            <div className={styles.loan.image}>
              <HexaBoxContainer>
                <Image src={loan.imageUrl} alt={loan.name} layout="fill" />
              </HexaBoxContainer>
            </div>

            <div className={styles.loan.info}>
              <div className={styles.loan.title}>{loan.name}</div>
              <div className={styles.loanStats.section}>
                <div className={styles.loanStats.row}>
                  <div className={styles.loanStats.label}>Value: </div>
                  <div className={styles.loanStats.value}>
                    {fs(loan.request)}
                  </div>
                </div>

                <div className={styles.loanStats.row}>
                  <div className={styles.loanStats.label}>Interest Ratio: </div>
                  <div className={styles.loanStats.value}>{fpr(loan.ir)}</div>
                </div>

                <div className={styles.loanStats.row}>
                  <div className={styles.loanStats.label}>Time left: </div>
                  <div className={styles.loanStats.value}>
                    {formatLoanPeriod(loan.start, loan.end)}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.loan.arrow}></div>
          </div>
        );
      })}
    </div>
  );
};
