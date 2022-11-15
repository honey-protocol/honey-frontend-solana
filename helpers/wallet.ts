// 👇️ ts-nocheck disables type checking for entire file
// @ts-nocheck
import { DialectSolanaWalletAdapter } from '@dialectlabs/react-sdk-blockchain-solana';
import { WalletAdapter } from '@saberhq/use-solana';

export const solanaWalletToDialectWallet = (
  wallet?: WalletAdapter
): DialectSolanaWalletAdapter => {
  return {
    publicKey: wallet?.publicKey ?? undefined,
    connected: (wallet?.connected && Boolean(wallet?.publicKey)) || false,
    signMessage: (wallet as any)?.adapter?.adapter?.signMessage
      ? async msg => {
          const signed = await (wallet as any).adapter.adapter.signMessage(msg);
          if (signed.signature) {
            return signed.signature;
          }
          return signed;
        }
      : undefined,
    signTransaction: wallet?.signTransaction
      ? tx => wallet.signTransaction(tx)
      : undefined,
    signAllTransactions: wallet?.signAllTransactions
      ? tx => wallet.signAllTransactions(tx)
      : undefined
  };
};
