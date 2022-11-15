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

const { formatPercent: fp, formatUsd: fu } = formatNumber;

const LendForm = (props: LendFormProps) => {
  const {
    name,
    imageUrl,
    collectionName,
    borrowerTelegram,
    borrowerDiscord,
    duePeriod,
    loanStart,
    walletAddress,
    ir,
    request,
    total
  } = props;

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
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary">Cancel</HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              textRight="Borrow fees USDC 3.04"
              block
            >
              Lend
            </HoneyButton>
          </div>
        </div>
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
              value={fu(request)}
              valueSize="big"
              footer={<>Request</>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fp(ir)}
              valueSize="big"
              footer={<>Interest rate</>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fu(total)}
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
            <p className={styles.borrowerAddress}>{walletAddress}</p>

            <div
              className={styles.bidCardCopyIcon}
              onClick={() => navigator.clipboard.writeText(walletAddress)}
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
          value={`${getPositionPeriodFormatted(duePeriod, loanStart)}`}
          title="Total period"
          valueSize="big"
          className={styles.periodBlock}
        />

        <InfoBlock
          value={<>{getDateFormatted(loanStart)}</>}
          title="Loan start"
          valueSize="big"
          footer={<>{getTimeFormatted(loanStart)}</>}
          className={styles.periodBlock}
        />

        <InfoBlock
          value={<>{getDateFormatted(duePeriod)}</>}
          title="Loan due"
          valueSize="big"
          footer={<>{getTimeFormatted(duePeriod)}</>}
          className={styles.periodBlock}
        />
      </div>
    </SidebarScroll>
  );
};

export default LendForm;
