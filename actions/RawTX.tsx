import { extractErrorMessage } from '@saberhq/sail';
import { Transaction } from '@solana/web3.js';

import type { ActionFormProps } from './types';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import { HoneyTextArea } from 'components/HoneyTextArea/HoneyTextArea';
import * as styles from '../components/NewProposalSidebar/CreateProposalTab/CreateProposalTab.css';

export const RawTX: React.FC<ActionFormProps> = ({
  setError,
  txRaw,
  setTxRaw
}: ActionFormProps) => {
  return (
    <>
      <div className={styles.mb12}>
        <HoneyWarning
          danger
          message="Warning: this page is for advanced users only. Invalid transaction data may cause this page to freeze. Documentation will be coming soon."
        />
      </div>
      <div className={styles.mb12}>
        <HoneyWarning
          message="This page allows proposing any arbitrary transaction for execution
            by the DAO. The fee payer and recent blockhash will not be used."
        />
      </div>

      <div className={styles.singleLineInput}>
        <HoneyTextArea
          title="Paste encoded transactions"
          id="instructionsRaw"
          rows={1}
          placeholder="Paste encoded transactions"
          value={txRaw}
          onChange={e => {
            setTxRaw(e.target.value);
            try {
              const buffer = Buffer.from(e.target.value, 'base64');
              const tx = Transaction.from(buffer);
              if (tx.instructions.length === 0) {
                throw new Error('no instruction data');
              }
              setError(null);
            } catch (err) {
              setError(
                `Invalid transaction data: ${
                  extractErrorMessage(err) ?? '(unknown)'
                }`
              );
            }
          }}
        />
      </div>
    </>
  );
};
