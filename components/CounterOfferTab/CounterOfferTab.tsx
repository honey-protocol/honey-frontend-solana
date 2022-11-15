import * as styles from './CounterOfferTab.css';
import { formatNumber } from "../../helpers/format";
import { InputsBlock } from "../InputsBlock/InputsBlock";
import { useState } from "react";
import HoneyButton from "../HoneyButton/HoneyButton";
import c from "classnames";
import { CounterOfferTabProps, OfferItem } from "./types";

const mockData = {
  feesToken: 'USDC',
  fee: 3.04,
}

const { formatUsd: fu, formatPercent: fp, } = formatNumber;

export const CounterOfferTab = ({ token, price, offers }: CounterOfferTabProps) => {
  const [firstInputValue, setFirstInputValue] = useState<number>();
  const [secondInputValue, setSecondInputValue] = useState<number>();
  const [isMakeOfferButtonDisabled, setIsMakeOfferButtonDisabled] = useState<boolean>(false);

  const firstInputAddon = () => {
    return (
      <div className={styles.inputsAddon}>
        Period (days)
      </div>
    )
  }

  const secondInputAddon = () => {
    return (
      <div className={styles.inputsAddon}>
        Interest rate (%)
      </div>
    )
  }

  const getPeriodDays = (item: OfferItem) => {
    try {
      const endDate = new Date(item.endDate).valueOf() - new Date(item.date).valueOf()
      return endDate / 86400000
    } catch (e) {
      console.log(`Date parse error ${e}`)
      return ''
    }
  }

  return (
    <div className={styles.counterOfferTab}>
      <div className={styles.title}>
        Make your counter offer
      </div>
      <div className={styles.inputs}>
        <div className={styles.inputsTitle}>
          {`Your ${token} balance`}
        </div>
        <div className={styles.inputsSubtitle}>
          {fu(price)}
        </div>
          <InputsBlock
            firstInputValue={firstInputValue}
            onChangeFirstInput={setFirstInputValue}
            secondInputValue={secondInputValue}
            onChangeSecondInput={setSecondInputValue}
            firstInputAddon={firstInputAddon()}
            secondInputAddon={secondInputAddon()}
          />
      </div>
      <HoneyButton
        disabled={isMakeOfferButtonDisabled}
      >
        <div className={c(styles.buttonContainer.enable, {[styles.buttonContainer.disable]: isMakeOfferButtonDisabled} )}>
          <div className={styles.buttonTitle}>
            Make an offer
          </div>
          <div className={c(styles.buttonFeesWrapper.enable, {[styles.buttonFeesWrapper.disable]: isMakeOfferButtonDisabled})}>
            <div className={styles.buttonFeeTitle}>
              {`${mockData.feesToken} ${mockData.fee}`}
            </div>
            <div className={styles.buttonFeeDescription}>
              {'Borrow fees '}
            </div>
          </div>
        </div>
      </HoneyButton>
      <div className={styles.separator} />
      <div className={styles.otherOffersSection}>
        <div className={styles.otherOffersSectionTitle}>
          Other offers
        </div>
        <div className={styles.otherOffersSectionOffers}>
          {offers.map((item: OfferItem) => {
            return (
              <div className={styles.offerItem} key={item.hash} >
                <div className={styles.offerItemDescriptionBlock}>
                  <div className={styles.offerItemTitleWrapper}>
                    <div className={styles.offerItemTitle}>
                      {item.hash}
                    </div>
                    <div className={styles.offerItemTitleAddon} />
                  </div>
                  <div className={styles.offerItemDate}>
                    {new Date(item.date).toLocaleString('en-GB',{
                      day: "2-digit", month: 'short', year: '2-digit'
                    })}
                  </div>
                </div>
                <div className={styles.offerItemRateBlock}>
                  <div className={styles.offerItemRate}>
                    {fp(item.rate)}
                  </div>
                  <div className={styles.offerItemPeriod}>
                    {`${getPeriodDays(item)} days`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
