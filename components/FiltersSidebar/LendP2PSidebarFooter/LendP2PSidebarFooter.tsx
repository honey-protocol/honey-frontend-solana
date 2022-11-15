import * as styles from './LendP2PSidebarFooter.css';
import HoneyButton from "../../HoneyButton/HoneyButton";
import React from "react";
import { LendP2PSidebarFooterProps } from "../types";

export const  LendP2PSidebarFooter = ({
  firstButtonTitle,
  secondButtonTitle,
  isDisableSecondButton,
  counter,
  onClose
}: LendP2PSidebarFooterProps) => {
  return (
  <div className={styles.lendP2PSidebarFooter}>
    <div className={styles.smallCol}>
      <HoneyButton variant="secondary" onClick={() => {onClose(false)}}>
        {firstButtonTitle}
      </HoneyButton>
    </div>
    <div className={styles.bigCol}>
      <HoneyButton variant="primary" textRight={counter !== 0 ? `${counter}` : ''} block disabled={isDisableSecondButton}>
        {secondButtonTitle}
      </HoneyButton>
    </div>
  </div>)
}