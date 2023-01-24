import * as styles from './RepayP2PTab.css';
import { formatNumber } from '../../../helpers/format';
import { InputsBlock } from '../../InputsBlock/InputsBlock';
import React, { ReactNode, useState } from 'react';
import { RepayP2PSlider } from '../RepayP2PSlider/RepayP2PSlider';
import { BorrowP2PSidebarHeader } from '../BorrowP2PSidebarHeader/BorrowP2PSidebarHeader';
import { BorrowP2PSidebarFooter } from '../BorrowP2PSidebarFooter/BorrowP2PSidebarFooter';
import { useSolBalance } from '../../../hooks/useSolBalance';
import { P2PLoan, P2PPosition } from '../../../types/p2p';
import SectionTitle from '../../SectionTitle/SectionTitle';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { differenceInDays, format } from 'date-fns';
import { useSolPrice } from '../../../hooks/useSolPrice';
import Decimal from 'decimal.js';

const { formatSol: fs, formatPercentRounded: fpr } = formatNumber;

export interface RepayP2PTabProps {
  position: P2PLoan;
  onClose: () => void;
}

export const RepayP2PTab = ({ position, onClose }: RepayP2PTabProps) => {
  const [isDisableCreateButton, setIsDisableCreateButton] =
    useState<boolean>(false);

  const solBalance = useSolBalance();
  const solPrice = useSolPrice();

  const getDateFormatted = (date: number): string => {
    return format(new Date(date), 'dd.MM.yyyy');
  };

  const getTimeFormatted = (time: number): string => {
    return format(new Date(time), 'HH:MM:SS (O)');
  };

  const getPositionPeriodFormatted = (
    dateLeft: number,
    fateRight: number
  ): ReactNode => {
    const diff = differenceInDays(dateLeft, fateRight);
    return `${differenceInDays(dateLeft, fateRight).toString()} day${
      diff > 1 ? 's' : ''
    }`;
  };

  return (
    // <div className={styles.repayP2PTab}>
    //   <div className={styles.infoSection}>
    //     <BorrowP2PSidebarHeader
    //       NFTName={position.name}
    //       NFTLogo={position.imageUrl}
    //       collectionName={position.collectionName}
    //       isVerifiedCollection={position.verified}
    //     />
    //     <div className={styles.loanInfo.wrapper}>
    //       <div className={styles.loanInfo.section}>
    //         <div className={styles.loanInfo.title}>{fs(position.request)}</div>
    //         <div className={styles.loanInfo.description}>Your loan</div>
    //       </div>
    //       <div className={styles.loanInfo.section}>
    //         <div
    //           className={styles.loanInfo.title}
    //         >{`${getPositionPeriodFormatted(position.end, Date.now())}`}</div>
    //         <div className={styles.loanInfo.description}>Days left</div>
    //       </div>
    //       <div className={styles.loanInfo.section}>
    //         <div className={styles.loanInfo.title}>{fpr(position.ir, 2)}</div>
    //         <div className={styles.loanInfo.description}>Interest Rate</div>
    //       </div>
    //     </div>

    //     <div className={styles.userBalance.section}>
    //       <div className={styles.userBalance.wrapper}>
    //         <div className={styles.userBalance.title}>{`Your SOL balance`}</div>
    //         <div className={styles.userBalance.price}>{fs(solBalance)}</div>
    //       </div>
    //     </div>

    //     <SectionTitle className={styles.title} title="Period" />

    //     <InfoBlock
    //       value={<>{getDateFormatted(position.start)}</>}
    //       title="Loan start"
    //       valueSize="big"
    //       footer={<>{getTimeFormatted(position.start)}</>}
    //       className={styles.periodBlock}
    //     />

    //     <InfoBlock
    //       value={<>{getDateFormatted(position.end)}</>}
    //       title="Loan due"
    //       valueSize="big"
    //       footer={<>{getTimeFormatted(position.end)}</>}
    //       className={styles.periodBlock}
    //     />
    //   </div>
    //   <BorrowP2PSidebarFooter
    //     firstButtonTitle={'Close'}
    //     secondButtonTitle={'Repay'}
    //     isActionButtonDisabled={isDisableCreateButton}
    //     onClose={onClose}
    //     actionButtonProps={{
    //       solAmount: position.request,
    //       usdcValue: new Decimal(position.request).mul(solPrice || 0).toNumber()
    //     }}
    //   />
    // </div>
    <></>
  );
};
