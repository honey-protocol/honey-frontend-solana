// MOCK UI for claim rewards
import { useCallback, useMemo, useState } from 'react';
import { BN } from '@project-serum/anchor';

import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { useLocker } from 'hooks/useVeHoney';
import { calculateNFTReceiptClaimableAmount } from 'helpers/sdk';
import { convert } from 'helpers/utils';

import * as styles from './ClaimRewards.css';
import useToast from 'hooks/useToast';
import { HoneyCheckbox } from 'components/HoneyCheckbox/HoneyCheckbox';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const ListItem = ({
  receipt,
  onChange,
  isSelected
}: {
  receipt: {
    id: BN;
    claimed: BN;
    claimable: BN;
  };
  onChange: Function;
  isSelected: boolean;
}) => {
  const { id, claimed, claimable } = receipt;

  return (
    <tr className={styles.receiptListItem}>
      <td>#{id.toString()}</td>
      <td>{convert(claimed)}</td>
      <td>{convert(claimable)}</td>
      <td>
        <HoneyCheckbox checked={isSelected} onChange={e => onChange(e, id)} />
      </td>
    </tr>
  );
};

const ClaimRewards = (props: { onClose: Function }) => {
  const [selected, setSelected] = useState<BN>();
  const { toast, ToastComponent } = useToast();
  const { escrow, locker, claim, closeReceipt } = useLocker();

  const onItemSelect = (e: CheckboxChangeEvent, id: BN) => {
    if (e.target.checked) {
      setSelected(id);
    } else {
      setSelected(undefined);
    }
  };

  const receipts = useMemo(() => {
    if (escrow && locker) {
      return escrow.receipts.map(r => {
        return {
          id: r.receiptId,
          claimed: r.claimedAmount,
          claimable: calculateNFTReceiptClaimableAmount(r, locker.params)
        };
      });
    }
    return [];
  }, [escrow, locker]);

  const selectedReceipt = receipts.find(
    r => r.id.toString() === selected?.toString()
  );
  const claimableN = selectedReceipt ? convert(selectedReceipt?.claimable) : 0;

  const handleClaim = useCallback(
    async (receiptId: BN) => {
      try {
        toast.processing();
        await claim(receiptId);
        toast.success('Claim successful');
      } catch (error) {
        toast.error('Claim failed');
      }
    },
    [claim, toast]
  );

  const handleClose = useCallback(
    async (receiptId: BN) => {
      try {
        toast.processing();
        await closeReceipt(receiptId);
        toast.success('Close successful');
      } catch (error) {
        toast.error('Close failed');
      }
    },
    [closeReceipt, toast]
  );

  return (
    <SidebarScroll
      footer={
        toast.state ? (
          <ToastComponent />
        ) : (
          <div className={styles.buttons}>
            <div className={styles.smallCol}>
              <HoneyButton
                // onClick={() => (selected ? handleClose(selected) : {})}
                onClick={() => props.onClose()}
                variant="secondary"
              >
                Close
              </HoneyButton>
            </div>
            <div className={styles.bigCol}>
              <HoneyButton
                variant="primary"
                disabled={!selected}
                block
                onClick={() =>
                  selected
                    ? claimableN
                      ? handleClaim(selected)
                      : handleClose(selected)
                    : {}
                }
              >
                {claimableN ? 'Claim' : 'Close receipt'}
              </HoneyButton>
            </div>
          </div>
        )
      }
    >
      <div className={styles.burnNftsForm}>
        <div className={styles.articleWrapper}>
          <div className={styles.articleTitle}>Proof for burned NFTs</div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning
              message="Honey rewards for burned Genesis NFTs are locked/vested upfront for 10 years.
            Rewards unlock in real time in the form of a claimable balance.
            NOTE: claiming rewards decreases your governance voting power as the veHONEY amount is reduced. 
              Learn more about this in our docs."
            />
          </div>
        </div>

        <table>
          <tr>
            <th>Receipt#</th>
            <th>Claimed</th>
            <th>Claimable</th>
            <th>Action</th>
          </tr>
          {receipts.map(r => (
            <ListItem
              key={r.id.toString()}
              receipt={r}
              isSelected={selected === r.id}
              onChange={onItemSelect}
            />
          ))}
        </table>
      </div>
    </SidebarScroll>
  );
};

export default ClaimRewards;
