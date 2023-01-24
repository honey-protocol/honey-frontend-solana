import * as styles from './BorrowP2PRequestFormTab.css';
import { InputsBlock } from '../../InputsBlock/InputsBlock';
import { useState } from 'react';
import { HoneyInput } from '../../HoneyInput/HoneyInput';
import { BorrowP2PSidebarHeader } from '../BorrowP2PSidebarHeader/BorrowP2PSidebarHeader';
import { BorrowP2PSidebarFooter } from '../BorrowP2PSidebarFooter/BorrowP2PSidebarFooter';
import { BorrowP2PRequestFormTabProps } from '../types';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { requestLoan } from 'helpers/p2p/apiServices';
import { ONE_DAY_IN_SECONDS } from 'constants/p2p';
import { saveBorrowerContactDetails } from 'helpers/p2p/firebase';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import { useSolPrice } from 'hooks/useSolPrice';

export const BorrowP2PRequestFormTab = ({
  collectionName,
  isVerifiedCollection,
  NFT,
  onClose
}: BorrowP2PRequestFormTabProps) => {
  const wallet = useConnectedWallet();
  const router = useRouter();
  const connection = useConnection();
  const { toast, ToastComponent } = useToast();
  const solPrice = useSolPrice() ?? 25; //remove 25 when solPrice works

  const [solInputValue, setSolInputValue] = useState<number | undefined>();
  const [usdcInputValue, setUsdcInputValue] = useState<number | undefined>();
  const [periodInputValue, setPeriodInputValue] = useState<string>('');
  const [interestRateInputValue, setInterestRateInputValue] =
    useState<string>('');
  const [telegramInputValue, setTelegramInputValue] = useState('');

  const [discordInputValue, setDiscordInputValue] = useState('');
  const [isDisableCreateButton, setIsDisableCreateButton] =
    useState<boolean>(false);

  const mockToken = { token: 'USDC', icon: '/images/USDC.svg' };

  const handleBorrowRequest = async () => {
    if (!wallet || !NFT) return;
    await requestLoan(
      connection,
      wallet,
      toast,
      solInputValue ?? 0,
      interestRateInputValue,
      Number(periodInputValue) * ONE_DAY_IN_SECONDS,
      NFT
    );
    await saveBorrowerContactDetails(
      NFT?.mint.toString(),
      discordInputValue,
      telegramInputValue
    );
  };

  const handleSOLInputChange = (solValue: number | undefined) => {
    if (!solValue) {
      setUsdcInputValue(0);
      setSolInputValue(0);
      return;
    }

    setUsdcInputValue(solValue * solPrice);
    setSolInputValue(solValue);
  };

  const handleUSDCInputChange = (usdcValue: number | undefined) => {
    if (!usdcValue) {
      setUsdcInputValue(0);
      setSolInputValue(0);
      return;
    }

    setUsdcInputValue(usdcInputValue);
    setSolInputValue(usdcValue / solPrice);
  };

  const renderFooter = () => {
    return toast?.state ? (
      <ToastComponent />
    ) : (
      <div className={styles.buttons}>
        <div className={styles.smallCol}>
          <HoneyButton variant="secondary" onClick={onClose}>
            Cancel
          </HoneyButton>
        </div>
        <div className={styles.bigCol}>
          <HoneyButton
            disabled={isDisableCreateButton}
            variant="primary"
            block
            onClick={handleBorrowRequest}
          >
            Create borrow request
          </HoneyButton>
        </div>
      </div>
    );
  };

  return (
    <SidebarScroll footer={renderFooter()}>
      <div className={styles.borrowP2PRequestTab}>
        <div className={styles.infoSection}>
          <BorrowP2PSidebarHeader
            NFTName={NFT.name}
            collectionName={collectionName}
            isVerifiedCollection={isVerifiedCollection}
            NFTLogo={NFT.image}
          />
          <div className={styles.amountSection}>
            <div className={styles.sectionsTitle}>Amount</div>
            <InputsBlock
              firstInputValue={solInputValue}
              onChangeFirstInput={handleSOLInputChange}
              onChangeSecondInput={handleUSDCInputChange}
              secondInputValue={usdcInputValue}
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
                onChange={event =>
                  setInterestRateInputValue(event.target.value)
                }
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
              <HoneyInput
                value={telegramInputValue}
                onChange={event => {
                  setTelegramInputValue(event.target.value);
                }}
                allowClear
                bordered
                placeholder={'Telegram'}
              />
            </div>
            <div className={styles.sectionsInput}>
              <HoneyInput
                value={discordInputValue}
                onChange={event => {
                  setDiscordInputValue(event.target.value);
                }}
                allowClear
                bordered
                placeholder={'Discord'}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarScroll>
  );
};
