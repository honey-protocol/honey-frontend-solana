import * as styles from './BorrowP2PRequestFormTab.css';
import { InputsBlock } from '../../InputsBlock/InputsBlock';
import { useState } from 'react';
import { HoneyInput } from '../../HoneyInput/HoneyInput';
import { BorrowP2PSidebarHeader } from '../BorrowP2PSidebarHeader/BorrowP2PSidebarHeader';
import { BorrowP2PSidebarFooter } from '../BorrowP2PSidebarFooter/BorrowP2PSidebarFooter';
import { BorrowP2PRequestFormTabProps } from '../types';

export const BorrowP2PRequestFormTab = ({
  collectionName,
  NFTName,
  isVerifiedCollection,
  NFTLogo,
  onClose
}: BorrowP2PRequestFormTabProps) => {
  const [firstInputValue, setFirstInputValue] = useState<number | undefined>();
  const [secondInputValue, setSecondInputValue] = useState<
    number | undefined
  >();
  const [periodInputValue, setPeriodInputValue] = useState<string>('');
  const [interestRateInputValue, setInterestRateInputValue] =
    useState<string>('');
  const [isDisableCreateButton, setIsDisableCreateButton] =
    useState<boolean>(false);

  const mockToken = { token: 'USDC', icon: '/images/USDC.svg' };

  return (
    <div className={styles.borrowP2PRequestTab}>
      <div className={styles.infoSection}>
        <BorrowP2PSidebarHeader
          NFTName={NFTName}
          collectionName={collectionName}
          isVerifiedCollection={isVerifiedCollection}
          NFTLogo={NFTLogo}
        />
        <div className={styles.amountSection}>
          <div className={styles.sectionsTitle}>Amount</div>
          <InputsBlock
            firstInputValue={firstInputValue}
            onChangeFirstInput={setFirstInputValue}
            onChangeSecondInput={setSecondInputValue}
            secondInputValue={secondInputValue}
            firstInputAddon={
              <div className={styles.inputsAddonsPriceTitle}>SOL</div>
            }
            secondInputAddon={
              <div className={styles.inputsAddonsTokenAddonWrapper}>
                <div className={styles.inputsAddonsTokenAddonIcon}>
                  <img src={mockToken.icon} alt="x" />
                </div>
                <div className={styles.inputsAddonsTokenAddonTitle}>
                  {mockToken.token}
                </div>
              </div>
            }
          />
        </div>
        <div className={styles.sectionsSeparator} />
        <div className={styles.requestDetailsSection}>
          <div className={styles.sectionsTitle}>Request details</div>
          <div className={styles.sectionsInput}>
            <HoneyInput
              allowClear
              bordered
              placeholder={'Interest rate'}
              value={interestRateInputValue}
              onChange={event => setInterestRateInputValue(event.target.value)}
              suffix={
                !interestRateInputValue.length && (
                  <div className={styles.inputsAddonsIcon} />
                )
              }
            />
          </div>
          <div className={styles.sectionsInput}>
            <HoneyInput
              allowClear
              bordered
              placeholder={'Total period'}
              value={periodInputValue}
              onChange={event => {
                setPeriodInputValue(event.target.value);
              }}
              suffix={
                !periodInputValue.length && (
                  <div className={styles.inputsAddonsTitle}>days</div>
                )
              }
            />
          </div>
        </div>
        <div className={styles.sectionsSeparator} />
        <div className={styles.contactsSection}>
          <div className={styles.sectionsTitle}>Contacts</div>
          <div className={styles.sectionsInput}>
            <HoneyInput allowClear bordered placeholder={'Telegram'} />
          </div>
          <div className={styles.sectionsInput}>
            <HoneyInput allowClear bordered placeholder={'Discord'} />
          </div>
        </div>
      </div>
      <BorrowP2PSidebarFooter
        firstButtonTitle={'Close'}
        secondButtonTitle={'Create borrow request'}
        isActionButtonDisabled={isDisableCreateButton}
        onClose={onClose}
      />
    </div>
  );
};
