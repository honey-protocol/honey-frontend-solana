// MOCK UI for claim rewards
import { useCallback, useMemo } from 'react';
import { BN } from '@project-serum/anchor';

import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { useLocker } from 'hooks/useVeHoney';
import { calculateNFTReceiptClaimableAmount } from 'helpers/sdk';
import { convert } from 'helpers/utils';

import * as styles from './ClaimRewards.css';

const ListItem = ({
  receipt,
  onClaim,
  onClose
}: {
  receipt: {
    id: BN;
    claimed: BN;
    claimable: BN;
  };
  onClaim: () => Promise<void>;
  onClose: () => Promise<void>;
}) => {
  const { id, claimed, claimable } = receipt;

  const claimableN = convert(claimable);

  return (
    <tr className={styles.receiptListItem}>
      <td>#{id.toString()}</td>
      <td>{convert(claimed)}</td>
      <td>{convert(claimable)}</td>
      <td>
        <HoneyButton
          size="small"
          onClick={() => (claimableN ? onClaim() : onClose())}
        >
          {claimableN ? 'Claim' : 'Close'}
        </HoneyButton>
      </td>
    </tr>
  );
};

const ClaimRewards = (props: { onCancel: Function }) => {
  const { escrow, locker, claim, closeReceipt } = useLocker();

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

  const handleClaim = useCallback(
    async (receiptId: BN) => {
      await claim(receiptId);
    },
    [claim]
  );

  const handleClose = useCallback(
    async (receiptId: BN) => {
      await closeReceipt(receiptId);
    },
    [closeReceipt]
  );

  return (
    <SidebarScroll>
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
              onClaim={() => handleClaim(r.id)}
              onClose={() => handleClose(r.id)}
            />
          ))}
        </table>
      </div>
    </SidebarScroll>
  );
};

export default ClaimRewards;
