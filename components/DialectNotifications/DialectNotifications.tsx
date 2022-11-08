import {
  NotificationsButton,
  NotificationsSingleFeed
} from '@dialectlabs/react-ui';
import * as styles from './DialectNotifications.css';

const DIALECT_DAPP_ADDRESS = process.env.NEXT_PUBLIC_DIALECT_DAPP_ADDRESS;

export const DialectNotifications = () => {
  return DIALECT_DAPP_ADDRESS ? (
    <div className={styles.dialectNotification}>
      <NotificationsButton
        dialectId="dialect-singlefeed-notifications"
        dappAddress={DIALECT_DAPP_ADDRESS}
        pollingInterval={15000}
        Component={NotificationsSingleFeed}
      />
    </div>
  ) : null;
};
