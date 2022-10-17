import {
  buildStubbedTransaction,
  createMemoInstruction
} from '@saberhq/solana-contrib';
import { useSolana } from '@saberhq/use-solana';
import { useEffect, useState } from 'react';
import { serializeToBase64 } from 'helpers/utils';
import type { ActionFormProps } from './types';
import { HoneyTextArea } from 'components/HoneyTextArea/HoneyTextArea';

export const Memo: React.FC<ActionFormProps> = ({
  actor,
  setError,
  setTxRaw
}: ActionFormProps) => {
  const [memo, setMemo] = useState<string>('');
  const { network } = useSolana();

  useEffect(() => {
    if (memo === '') {
      setError('Memo cannot be empty');
    }
  }, [memo, setError]);

  return (
    <>
      <div>
        <HoneyTextArea
          title="Description"
          rows={4}
          placeholder="The memo for the DAO to send."
          onChange={e => {
            setMemo(e.target.value);
            try {
              const txStub = buildStubbedTransaction(
                network !== 'localnet' ? network : 'devnet',
                [createMemoInstruction(e.target.value, [actor])]
              );
              setTxRaw(serializeToBase64(txStub));
              setError(null);
            } catch (ex) {
              setTxRaw('');
              console.debug('Error creating memo', ex);
              setError('Memo is too long');
            }
          }}
          value={memo}
        />
      </div>
    </>
  );
};
