import React, { ReactNode } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import * as styles from './LendForm.css';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import HoneyWarning from '../HoneyWarning/HoneyWarning';
import SectionTitle from '../SectionTitle/SectionTitle';
import Link from 'antd/lib/typography/Link';
import { NewPageIcon } from '../../icons/NewPageIcon';
import { format, differenceInDays } from 'date-fns';
import { formatNumber } from '../../helpers/format';
import { LendFormProps } from './types';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import useToast from 'hooks/useToast';
import {
  acceptRequest,
  cancelRequest,
  liquidate,
  payback
} from 'helpers/p2p/apiServices';
import { formatAddress } from 'helpers/addressUtils';
import { ORDER_STATUS } from 'constants/p2p';
import { getOrderStatus } from 'helpers/p2p/filterLoans';
import { useRouter } from 'next/router';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const { formatPercent: fp, formatSol: fs } = formatNumber;

const todaysDate = new Date();

const LendForm = (props: LendFormProps) => {
  const {
    name,
    imageUrl,
    collectionName,
    borrowerTelegram,
    borrowerDiscord,
    loan
  } = props;

  const connection = useConnection();
  const wallet = useConnectedWallet();
  const { toast, ToastComponent } = useToast();
  const router = useRouter();

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

  const onAcceptCounterOffer = () => {};

  const isDefaulted = () => {
    if (!loan) return undefined;
    return (
      todaysDate.getTime() >
      Number(loan?.period) * 1000 + Number(loan?.loanStartTime) * 1000
    );
  };

  const orderStatus = getOrderStatus(
    loan?.lender.toString(),
    loan?.withdrewAt,
    loan?.paidBackAt,
    isDefaulted()
  );

  const onLend = async () => {
    if (wallet) {
      await acceptRequest(connection, wallet, toast, loan.id, loan);
      router.reload();
    }
  };

  const onRepay = async () => {
    if (wallet) {
      await payback(connection, wallet, toast, loan.id, loan);
      router.reload();
    }
  };

  const onCancelRequest = async () => {
    if (wallet) {
      await cancelRequest(connection, wallet, toast, loan.id, loan);
      router.replace('/lend');
    }
  };

  const onLiquidate = async () => {
    if (wallet) {
      await liquidate(connection, wallet, toast, loan.id, loan);
      router.replace('/lend');
    }
  };

  const getBtnTitleAndAction = () => {
    if (!loan) return null;

    if (Number(loan.paidBackAt) > 0) {
      return {
        title: `Loan repaid`,
        onClick: () => {},
        disabled: true
      };
    }

    // current connected wallet is lender
    if (loan.lender.toString() === wallet?.publicKey.toString()) {
      if (isDefaulted() && orderStatus === ORDER_STATUS.DEFAULTED) {
        return {
          title: `Liquidate`,
          onClick: onLiquidate
        };
      } else {
        return {
          title: `Awaiting repayment from
          ${formatAddress(loan?.borrower.toString())}`,
          onClick: () => {},
          disabled: true
        };
      }
    }
    // current connected wallet is borrower
    else if (loan.borrower.toString() === wallet?.publicKey.toString()) {
      if (loan.status) {
        return {
          title: 'Repay',
          onClick: onRepay
        };
      } else {
        return {
          title: 'Cancel Request',
          onClick: onCancelRequest
        };
      }
    }
    // connected wallet is neither borrower nor lender
    else {
      if (loan.status) {
        return {
          title: `Loan already granted by
          ${formatAddress(loan?.lender.toString())}`,
          onClick: () => {},
          disabled: true
        };
      } else {
        return {
          title: 'Lend',
          onClick: onLend
        };
      }
    }
  };

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton variant="secondary">Cancel</HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                textRight="Borrow fees USDC 3.04"
                block
                disabled={getBtnTitleAndAction()?.disabled}
                onClick={getBtnTitleAndAction()?.onClick}
              >
                {getBtnTitleAndAction()?.title}
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.lendForm}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              <Image
                src={imageUrl || honeyGenesisBee}
                layout="fill"
                alt={`${name}`}
              />
            </HexaBoxContainer>
          </div>
          <div className={styles.nftNameBlock}>
            <div className={styles.nftName}>{name}</div>
            <div className={styles.collectionName}>
              {collectionName}
              <div className={styles.verifiedIcon} />
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fs(Number(loan.requestedAmount) / LAMPORTS_PER_SOL)}
              valueSize="big"
              footer={<>Request</>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fp(Number(loan.interest))}
              valueSize="big"
              footer={<>Interest rate</>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fs(1000)}
              valueSize="big"
              footer={<>Total interest</>}
            />
          </div>
        </div>

        <div className={styles.warning}>
          <HoneyWarning message="View on solscan" link={'#'} />
        </div>

        <div className={styles.borrower}>
          <SectionTitle title="Borrower" />

          <div className={styles.borrowerCopy}>
            <p className={styles.borrowerAddress}>{loan.borrower.toString()}</p>

            <div
              className={styles.bidCardCopyIcon}
              onClick={() =>
                navigator.clipboard.writeText(loan.borrower.toString())
              }
            />
          </div>

          {borrowerTelegram && (
            <Link
              href={borrowerTelegram}
              target="_blank"
              className={styles.contactsBlock}
            >
              <div className={styles.contacts}>
                <p className={styles.contactsTitle}>Contact</p>
                <p className={styles.contactsLink}>Telegram</p>
              </div>
              <NewPageIcon />
            </Link>
          )}

          {borrowerDiscord && (
            <Link
              href={borrowerDiscord}
              target="_blank"
              className={styles.contactsBlock}
            >
              <div className={styles.contacts}>
                <p className={styles.contactsTitle}>Contact</p>
                <p className={styles.contactsLink}>Discord</p>
              </div>
              <NewPageIcon />
            </Link>
          )}
        </div>

        <SectionTitle className={styles.title} title="Period" />

        <InfoBlock
          value={`${getPositionPeriodFormatted(
            Number(loan.loanStartTime) + Number(loan.period),
            Number(loan.loanStartTime)
          )}`}
          title="Total period"
          valueSize="big"
          className={styles.periodBlock}
        />

        <InfoBlock
          value={<>{getDateFormatted(Number(loan.loanStartTime))}</>}
          title="Loan start"
          valueSize="big"
          footer={<>{getTimeFormatted(Number(loan.loanStartTime))}</>}
          className={styles.periodBlock}
        />

        <InfoBlock
          value={
            <>
              {getDateFormatted(
                Number(loan.loanStartTime) + Number(loan.period)
              )}
            </>
          }
          title="Loan due"
          valueSize="big"
          footer={
            <>
              {getTimeFormatted(
                Number(loan.loanStartTime) + Number(loan.period)
              )}
            </>
          }
          className={styles.periodBlock}
        />
      </div>
    </SidebarScroll>
  );
};

export default LendForm;
