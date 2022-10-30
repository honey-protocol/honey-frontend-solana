import { TokenInfo } from '@saberhq/token-utils';
import { HoneyModalProps } from '../HoneyModalRedesign/types';
import { TokenBalances } from '../../hooks/useBalances';

export type HoneySearchTokenModalProps = HoneyModalProps & {
  tokens: TokenInfo[];
  tokensBalancesMap: TokenBalances;
  onTokenSelected: (mint: string) => void;
};
