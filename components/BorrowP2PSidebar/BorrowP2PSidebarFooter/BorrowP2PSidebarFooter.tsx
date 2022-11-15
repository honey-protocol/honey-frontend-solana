import * as styles from './BorrowP2PSidebarFooter.css';
import HoneyButton from '../../HoneyButton/HoneyButton';
import React from 'react';
import { BorrowP2PSidebarFooterProps } from '../types';

export const BorrowP2PSidebarFooter = ({
  actionButtonProps = {},
  firstButtonTitle,
  secondButtonTitle,
  isActionButtonDisabled,
  onClose
}: BorrowP2PSidebarFooterProps) => {
  return (
    <div className={styles.borrowP2PSidebarFooter.footerContainer}>
      <div className={styles.borrowP2PSidebarFooter.smallCol}>
        <HoneyButton variant="secondary" onClick={onClose}>
          {firstButtonTitle}
        </HoneyButton>
      </div>
      <div className={styles.borrowP2PSidebarFooter.bigCol}>
        <HoneyButton
          variant="primary"
          {...actionButtonProps}
          block
          disabled={isActionButtonDisabled}
        >
          {secondButtonTitle}
        </HoneyButton>
      </div>
    </div>
  );
};
