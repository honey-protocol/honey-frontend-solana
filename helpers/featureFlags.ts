// This module intentionally does not use any imports to avoid circular dependencies
// Try to keep amount of imports as less as possible here
import { isPreview } from './isVerselPreview';

function isTrue(value: string | boolean | undefined): boolean {
  return (
    (typeof value === 'string' && value?.toLowerCase() === 'true') ||
    (typeof value === 'boolean' && value)
  );
}

function isFeatureFlagEnabled(featureFlagName: string): boolean {
  const featureFlag = featureFlagName
    ? process.env[featureFlagName]
    : undefined;
  return (
    // Boolean(featureFlag) checks for null and undefined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    isTrue(featureFlag) ||
    (globalThis?.window &&
      isPreview() &&
      globalThis.window.document.location.href.includes(featureFlagName))
  );
}

export const featureFlags = {
  isSwapPageEnabled: isFeatureFlagEnabled('NEXT_PUBLIC_IS_SWAP_PAGE_ENABLED'),
  isP2PPageEnabled: isFeatureFlagEnabled('NEXT_PUBLIC_IS_P2P_PAGE_ENABLED'),
  isDialectNotificationsEnabled: isFeatureFlagEnabled(
    'NEXT_PUBLIC_IS_DIALECT_NOTIFICATIONS_ENABLED'
  ),
  isMarketCreationEnabled: isFeatureFlagEnabled(
    `NEXT_PUBLIC_IS_MARKET_CREATION_ENABLED`
  )
} as const;
