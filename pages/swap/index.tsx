import { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import React, { useEffect, useMemo, useState } from 'react';
import * as styles from '../../styles/swap.css';
import HoneyCardYellowShadow from '../../components/HoneyCardYellowShadow/HoneyCardYellowShadow';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import TabsAndManualForm from '../../components/TabsAndManualForm/TabsAndManualForm';
import HoneyTooltip from '../../components/HoneyTooltip/HoneyTooltip';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
import HoneyFormattedNumericInput from '../../components/HoneyFormattedNumericInput/HoneyFormattedInput';
import {
  InfoBlockData,
  SwapInfoBlock
} from '../../components/SwapInfoBlock/SwapInfoBlock';
import { TOKEN_LIST_URL, useJupiter } from '@jup-ag/react-hook';
import { TokenInfo } from '@saberhq/token-utils';
import { SwapFooter } from '../../components/SwapFooter/SwapFooter';
import { HoneySearchTokenModal } from '../../components/HoneySearchTokenModal/HoneySearchTokenModal';
import { lamportsToNumber, numberToLamports } from '../../helpers/math/math';
import { useWalletTokensBalances } from '../../hooks/useBalances';
import { formatNumber } from '../../helpers/format';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import BN from 'bn.js';
import { useWalletKit } from '@gokiprotocol/walletkit';
const { formatTokenAllDecimals: ftad } = formatNumber;

const MAX_SLIPPAGE = 1;
const DEFAULT_SLIPPAGE = 0.5;

const Swap: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const connection = useConnection();
  const { balances: tokenBalancesMap, refreshBalances } =
    useWalletTokensBalances();

  const [tokensDetails, setTokensDetails] = useState<TokenInfo[]>([]);
  const [haveTokensDetailsLoaded, setHaveTokensDetailsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [swapAmount, setSwapAmount] = useState(0);
  const [estimatedOutAmount, setEstimatedOutAmount] = useState(0);
  const [isInputTokenModalVisible, setIsInputTokenModalVisible] =
    useState(false);

  const [inputMint, setInputMint] = useState(
    new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
  );
  const [inputToken, setInputToken] = useState<TokenInfo | undefined>(
    undefined
  );
  const [outputMint, setOutputMint] = useState(
    new PublicKey('HonyeYAaTPgKUgQpayL914P6VAqbQZPrbkGMETZvW4iN')
  );
  const [outputToken, setOutputToken] = useState<TokenInfo | undefined>(
    undefined
  );
  const [isOutputTokenModalVisible, setIsOutputTokenModalVisible] =
    useState(false);

  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [debounceTime] = useState(1000);

  const jupiter = useJupiter({
    amount: JSBI.BigInt(
      numberToLamports(swapAmount, inputToken?.decimals || 1).toString()
    ),
    inputMint,
    outputMint,
    slippage,
    debounceTime // debounce time before refresh
  });

  const {
    allTokenMints, // all the token mints that is possible to be input
    exchange, // exchange
    refresh: refreshJupiter, // function to refresh rates
    loading: jupLoading, // loading states
    routes, // all the routes from inputMint to outputMint
    error
  } = jupiter;

  const bestRoute = useMemo(() => {
    if (routes) {
      return routes[0];
    }

    return null;
  }, [routes]);

  const exchangeRate = useMemo(() => {
    if (!bestRoute || !outputToken || !inputToken) {
      return;
    }
    const { inAmount: inAmountLamports, outAmount: outAmountLamports } =
      bestRoute;

    const payDecimal = inputToken.decimals || 1;
    const receiveDecimal = outputToken.decimals || 1;
    const inAmount = lamportsToNumber(inAmountLamports.toString(), payDecimal);
    const outAmount = lamportsToNumber(
      outAmountLamports.toString(),
      receiveDecimal
    );
    return outAmount / inAmount;
  }, [bestRoute]);

  const swapFee = useMemo(async () => {
    if (!bestRoute) {
      return;
    }

    const depositAndFee = await bestRoute.getDepositAndFee();
    console.log('depositAndFee', depositAndFee);
  }, [bestRoute]);

  const swapStats: InfoBlockData[] = useMemo(() => {
    // if (!bestRoute) {
    //   return [];
    // }

    const outDecimals = outputToken?.decimals || 1;
    const priceImpact = bestRoute ? bestRoute.priceImpactPct * 100 : 0;
    console.log('bestRoute', bestRoute);
    const minReceived = bestRoute
      ? lamportsToNumber(bestRoute.otherAmountThreshold.toString(), outDecimals)
      : 0;
    const transactionFee = 0;

    console.log('exchangeRate', exchangeRate);
    const exchangeRateFormatted = ftad(exchangeRate || 0, outDecimals);
    console.log('exchangeRateFormatted', exchangeRateFormatted);

    return [
      {
        title: 'Rate',
        value: `1 ${inputToken?.symbol} =  ${exchangeRateFormatted} ${outputToken?.symbol}`,
        titleAddon: (
          <div
            onClick={refreshJupiter}
            role={'button'}
            className={styles.reloadIcon}
          />
        )
      },
      {
        title: 'Price Impact',
        value:
          priceImpact > 0.1 ? `${ftad(priceImpact, outDecimals)}` : '< 0.1%'
      },
      {
        title: 'Minimum Received',
        value: `${ftad(minReceived, outDecimals)} ${outputToken?.symbol}`
      },
      {
        title: 'Transaction Fee',
        value: `${ftad(transactionFee, outDecimals)}`
        // titleAddon: (
        //   <HoneyTooltip placement={'top'} tooltipIcon label={'Mock'} />
        // )
      }
    ];
  }, [bestRoute, inputToken, outputToken, exchangeRate]);

  const inputTokenBalanceFormatted: string = useMemo(() => {
    const balanceInfo = tokenBalancesMap[inputMint.toString()];
    if (!balanceInfo) {
      return '0';
    }
    const balanceNumber = lamportsToNumber(
      balanceInfo.amount.toString(),
      balanceInfo.decimals
    );
    return ftad(balanceNumber, balanceInfo.decimals);
  }, [tokenBalancesMap, inputMint]);

  // Fetch token list from Jupiter API
  useEffect(() => {
    fetch(TOKEN_LIST_URL['mainnet-beta'])
      .then(response => response.json())
      .then((tokensResult: TokenInfo[]) => {
        setTokensDetails(tokensResult);
        setHaveTokensDetailsLoaded(true);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    setIsLoading(jupLoading || !haveTokensDetailsLoaded);
  }, [jupLoading, haveTokensDetailsLoaded]);

  useEffect(() => {
    setInputToken(getTokenByMint(inputMint));
  }, [inputMint, tokensDetails]);

  useEffect(() => {
    setOutputToken(getTokenByMint(outputMint));
  }, [outputMint, tokensDetails]);

  // refresh user balances after all mints are loaded
  useEffect(() => {
    refreshBalances();
  }, [allTokenMints]);

  useEffect(() => {
    if (!bestRoute || !outputToken) {
      setEstimatedOutAmount(0);
    } else {
      setEstimatedOutAmount(
        lamportsToNumber(
          bestRoute.outAmount.toString(),
          outputToken?.decimals || 1
        )
      );
    }
  }, [bestRoute, outputToken]);

  const getSlippageTabs = () => {
    const tabs = [0.1, 0.5, 1.0].map(v => {
      return {
        value: v,
        title: `${v}%`
      };
    });

    return tabs;
  };

  const swap = async () => {
    if (!bestRoute || !wallet?.publicKey) {
      return;
    }
    setIsLoading(true);
    try {
      const txns = await exchange({
        // disable ts complain about VersionedTransaction
        // useConnectedWallet package update is required
        wallet: {
          // @ts-ignore
          signAllTransactions: wallet.signAllTransactions.bind(wallet),
          // @ts-ignore
          signTransaction: wallet.signTransaction.bind(wallet),
          // @ts-ignore
          sendTransaction: connection.sendTransaction.bind(connection)
        },
        routeInfo: bestRoute,
        userPublicKey: wallet.publicKey,
        wrapUnwrapSOL: true
      });

      refreshBalances();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenByMint = (mint: string | PublicKey): TokenInfo | undefined => {
    const mintString = mint.toString();
    return tokensDetails.find(token => token.address === mintString);
  };

  const handleMax = () => {
    const tokenBalanceInfo = tokenBalancesMap[inputMint.toString()];
    if (!tokenBalanceInfo) {
      setSwapAmount(0);
      return;
    }

    setSwapAmount(
      lamportsToNumber(
        tokenBalanceInfo.amount.toString(),
        tokenBalanceInfo.decimals
      )
    );
  };

  const handleHalf = () => {
    const tokenBalanceInfo = tokenBalancesMap[inputMint.toString()];
    const { amount, decimals } = tokenBalanceInfo;
    setSwapAmount(lamportsToNumber(amount.div(new BN(2)).toString(), decimals));
  };

  const reverseInputs = () => {
    const newInputMint = outputMint;
    const newOutputMint = inputMint;
    setInputMint(newInputMint);
    setOutputMint(newOutputMint);
  };

  const tokenInputFormatter = (
    value: ValueType | undefined,
    decimals: number = 1
  ) => {
    return value ? formatNumber.formatTokenInput(String(value), decimals) : '';
  };

  const getSwapErrors = () => {
    const errors = [];

    if (!swapAmount) {
      errors.push('Set swap amount first');
    }

    if (!bestRoute && swapAmount) {
      errors.push('Route is not found for selected pair');
    }

    const inputTokenBalanceLamports =
      tokenBalancesMap[inputMint.toString()]?.amount || 0;
    const inputTokenBalance = lamportsToNumber(
      inputTokenBalanceLamports.toString(),
      inputToken?.decimals || 1
    );
    if (swapAmount > inputTokenBalance) {
      errors.push('Insufficient token amount');
    }

    return errors;
  };

  const formatSwapLabelsForTooltip = (errors: string[]) => {
    if (!errors || !errors.length) {
      return undefined;
    }

    return errors.map(error => <div key={error}>{error}</div>);
  };

  return (
    <LayoutRedesign>
      <HoneyContent>
        <div className={styles.pageContent}>
          <div className={styles.pageTitle}>Swap</div>

          <HoneyCardYellowShadow>
            <div className={styles.swapFormContainer}>
              <div className={styles.inputs}>
                <div className={styles.sectionTitle}>
                  <SectionTitle title={'You pay'} />
                </div>
                <div className={styles.tokenInputWrapper}>
                  <HoneyFormattedNumericInput
                    value={swapAmount}
                    decimalSeparator="."
                    formatter={value =>
                      tokenInputFormatter(value, inputToken?.decimals)
                    }
                    onChange={value => setSwapAmount(Number(value))}
                  />
                  <div
                    className={styles.tokenSelector}
                    onClick={() => setIsInputTokenModalVisible(true)}
                  >
                    {inputToken ? (
                      <img
                        src={inputToken?.logoURI}
                        className={styles.tokenLogo}
                        alt={inputToken?.symbol}
                      />
                    ) : null}
                    <div className={styles.tokenName}>{inputToken?.symbol}</div>
                  </div>
                </div>
                <div className={styles.inputStats}>
                  <div className={styles.balance}>
                    Available: {inputTokenBalanceFormatted} {inputToken?.symbol}
                  </div>
                  <div className={styles.halfMaxButtons}>
                    <HoneyButton
                      style={{ marginRight: 4 }}
                      variant="secondary"
                      size="small"
                      onClick={handleHalf}
                      className={styles.tinyButton}
                    >
                      half
                    </HoneyButton>
                    <HoneyButton
                      variant="secondary"
                      size="small"
                      onClick={handleMax}
                      className={styles.tinyButton}
                    >
                      max
                    </HoneyButton>
                  </div>
                </div>

                <div className={styles.swapArrow}>
                  <HoneyButton variant="text" onClick={reverseInputs}>
                    <div className={styles.swapArrowIcon} />
                  </HoneyButton>
                </div>

                <div className={styles.sectionTitle}>
                  <SectionTitle title={'You receive'} />
                </div>
                <div className={styles.tokenInputWrapper}>
                  <HoneyFormattedNumericInput
                    decimalSeparator="."
                    formatter={value =>
                      tokenInputFormatter(value, outputToken?.decimals)
                    }
                    value={estimatedOutAmount}
                    readOnly
                  />
                  <div
                    className={styles.tokenSelector}
                    onClick={() => setIsOutputTokenModalVisible(true)}
                  >
                    {outputToken ? (
                      <img
                        src={outputToken?.logoURI}
                        className={styles.tokenLogo}
                        alt={outputToken?.symbol}
                      />
                    ) : null}
                    <div className={styles.tokenName}>
                      {outputToken?.symbol}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.slippageSettings}>
                <div className={styles.sectionTitle}>
                  <SectionTitle
                    title="Slippage settings"
                    tooltip={
                      <HoneyTooltip
                        tooltipIcon
                        placement="top"
                        title={'Mock'}
                      />
                    }
                  />
                </div>

                <TabsAndManualForm
                  maxValue={MAX_SLIPPAGE}
                  value={slippage}
                  onChange={v => setSlippage(v)}
                  tabs={getSlippageTabs()}
                  manualTabText="Manually"
                />
              </div>

              <div className={styles.swapStats}>
                <SwapInfoBlock data={swapStats} />
              </div>

              <div className={styles.buttons}>
                {!wallet || !wallet.connected ? (
                  <HoneyButton variant="primary" block onClick={connect}>
                    Connect wallet
                  </HoneyButton>
                ) : (
                  <HoneyTooltip
                    placement="top"
                    title={formatSwapLabelsForTooltip(getSwapErrors())}
                  >
                    {/* DIV wrapper is required to propagate events to tooltip correctly; Otherwise it might stuck in some cases */}
                    <div>
                      <HoneyButton
                        variant="primary"
                        block
                        onClick={swap}
                        loading={isLoading}
                        disabled={getSwapErrors().length > 0}
                      >
                        Swap
                      </HoneyButton>
                    </div>
                  </HoneyTooltip>
                )}
              </div>
            </div>
          </HoneyCardYellowShadow>
          <SwapFooter />

          {isInputTokenModalVisible && (
            <HoneySearchTokenModal
              tokensBalancesMap={tokenBalancesMap}
              onTokenSelected={(mint: string) => {
                setInputMint(new PublicKey(mint));
                setIsInputTokenModalVisible(false);
              }}
              tokens={tokensDetails}
              visible={isInputTokenModalVisible}
              onCancel={() => setIsInputTokenModalVisible(false)}
              destroyOnClose
            />
          )}

          {isOutputTokenModalVisible && (
            <HoneySearchTokenModal
              tokensBalancesMap={tokenBalancesMap}
              onTokenSelected={(mint: string) => {
                setOutputMint(new PublicKey(mint));
                setIsOutputTokenModalVisible(false);
              }}
              tokens={tokensDetails}
              visible={isOutputTokenModalVisible}
              onCancel={() => setIsOutputTokenModalVisible(false)}
              destroyOnClose
            />
          )}
        </div>
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Swap;
