import {
  NotificationsButton,
  NotificationsSingleFeed
} from '@dialectlabs/react-ui';

const DIALECT_DAPP_ADDRESS = process.env.NEXT_PUBLIC_DIALECT_DAPP_ADDRESS;

export const DialectNotifications = () => {
  return DIALECT_DAPP_ADDRESS ? (
    <NotificationsButton
      dialectId="dialect-singlefeed-notifications"
      dappAddress={DIALECT_DAPP_ADDRESS}
      pollingInterval={15000}
      Component={NotificationsSingleFeed}
    />
  ) : null;
};
