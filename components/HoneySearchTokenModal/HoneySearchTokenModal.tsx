import { HoneyModalRedesign } from '../HoneyModalRedesign/HoneyModalRedesign';
import { FixedSizeList } from 'react-window';
import * as styles from './HoneySearchTokenModal.css';
import { HoneyInput } from '../HoneyInput/HoneyInput';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { HoneySearchTokenModalProps } from './types';
import { TokenInfo } from '@saberhq/token-utils';
import debounce from 'lodash/debounce';
import { lamportsToNumber } from '../../helpers/math/math';
import { formatNumber } from '../../helpers/format';
import { sortBy } from 'lodash';

const TOKEN_ITEM_SIZE = 60;
const MODAL_WIDTH = 394;

const { formatTokenAllDecimals: ftad } = formatNumber;

export const HoneySearchTokenModal = (props: HoneySearchTokenModalProps) => {
  const { tokens, tokensBalancesMap, onTokenSelected, ...rest } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState(tokens);

  const onSearch = (searchTerm: string): TokenInfo[] => {
    if (!searchTerm) {
      return [...tokens];
    }
    const r = new RegExp(searchTerm, 'mi');
    const f = [...tokens].filter(token => {
      return r.test(token.symbol);
    });
    return f;
  };

  /**
   * Sort tokens to show the ones with the bigest value on top of the list
   * price oracles are not connected so mock price of any token = 1
   */
  const sortByValue = (tokens: TokenInfo[]): TokenInfo[] => {
    return sortBy(tokens, token => {
      const price = 1;
      const balance = getTokenBalance(token);
      return balance ? -1 * balance * price : 0;
    });
  };

  const debouncedSearch = useCallback(
    debounce(searchQuery => {
      setFilteredTokens(sortByValue(onSearch(searchQuery)));
    }, 300),
    [tokens, tokensBalancesMap]
  );

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [tokens]
  );

  // Apply search if initial markets list changed
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [tokens]);

  const getTokenBalance = useCallback(
    (token: TokenInfo) => {
      const tokenBalanceInfo = tokensBalancesMap[token.address];
      if (!tokenBalanceInfo) {
        return 0;
      }
      const { amount, decimals } = tokenBalanceInfo;
      return lamportsToNumber(amount.toString(), decimals);
    },
    [tokensBalancesMap]
  );

  const Row = useCallback(
    ({ index, style }: any) => {
      const token = filteredTokens[index];

      return (
        <div
          style={style}
          onClick={() => onTokenSelected(token.address)}
          key={`${token.symbol}-${token.name}`}
        >
          <div className={styles.tokenInfoWrapper}>
            <img src={token.logoURI} className={styles.tokenLogo} />
            <div className={styles.tokenInfo}>
              <div className={styles.tokenTitle}>{token.symbol}</div>
              <div className={styles.tokenDescription}>
                Available: {token.symbol}{' '}
                {ftad(getTokenBalance(token), token.decimals)}
                <div className={styles.middot}></div>
                {/*{`$ ${token.balance || 0}`}*/}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [filteredTokens]
  );

  return (
    <HoneyModalRedesign
      {...rest}
      maskClosable
      width={MODAL_WIDTH}
      destroyOnClose={true}
      footer={null}
    >
      <div className={styles.honeySearchTokenModal}>
        <div className={styles.title}>Select a Token</div>
        <div className={styles.inputWrapper}>
          <HoneyInput
            allowClear
            onChange={handleSearchInputChange}
            placeholder={'Enter your token...'}
          />
        </div>
        <FixedSizeList
          height={TOKEN_ITEM_SIZE * 6}
          itemData={filteredTokens}
          width={'auto'}
          itemSize={TOKEN_ITEM_SIZE}
          itemCount={filteredTokens.length}
          className={styles.tokensList}
        >
          {Row}
        </FixedSizeList>
      </div>
    </HoneyModalRedesign>
  );
};
