// import { Nft } from '@metaplex-foundation/js';
import * as anchor from '@project-serum/anchor';
import { web3 } from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import {
  Fraction,
  getATAAddressSync,
  createATAInstruction
} from '@saberhq/token-utils';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';
import { SetStateAction } from 'react';
import { toast } from 'react-toastify';
import {
  HONEY_P2P_PROGRAM,
  LOAN_CURRENCY_LAMPORTS,
  LOAN_CURRENCY_TOKEN,
  METADATA_PROGRAM_ID,
  SOL_TOKEN,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
} from 'constants/p2p';
import { ConnectedWallet } from '@saberhq/use-solana';
import { ToastProps } from 'hooks/useToast';

const programID = HONEY_P2P_PROGRAM;

async function getProvider(connection: Connection, wallet: ConnectedWallet) {
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  return provider;
}

async function loadP2PProgram(
  connection: Connection,
  userWallet: ConnectedWallet
) {
  const provider = await getProvider(connection, userWallet);
  const idl = require('./idl/honey_p2p.json');
  return new anchor.Program(idl!, HONEY_P2P_PROGRAM, provider);
}

async function getOrCreateAssociatedTokenAddress(
  connection: anchor.web3.Connection,
  userWallet: ConnectedWallet,
  associatedToken: anchor.web3.PublicKey
) {
  let associatedTokenAddress = await getATAAddressSync({
    mint: associatedToken,
    owner: userWallet.publicKey
  });

  console.log(
    ASSOCIATED_TOKEN_PROGRAM_ID.toBase58(),
    TOKEN_PROGRAM_ID.toBase58(),
    associatedToken.toBase58(),
    userWallet.publicKey.toBase58()
  );
  console.log(associatedTokenAddress.toBase58());

  let associatedTokenAccountInfo;

  try {
    associatedTokenAccountInfo = await connection.getAccountInfo(
      associatedTokenAddress
    );
  } catch {
    console.log('associatedTokenAccountInfo not present');
  }

  if (!associatedTokenAccountInfo) {
    const instructions = [];

    instructions.push(
      createATAInstruction({
        address: userWallet.publicKey,
        mint: associatedTokenAddress,
        owner: userWallet.publicKey,
        payer: associatedToken
      })
    );

    const transaction = new web3.Transaction().add(...instructions);
    transaction.feePayer = userWallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    const signed = await userWallet.signTransaction(transaction);

    const transactionSignature = await connection.sendRawTransaction(
      signed.serialize()
    );

    await connection.confirmTransaction(transactionSignature);
  }

  return associatedTokenAddress;
}

export const fetchLoan = async (
  connection: anchor.web3.Connection,
  userWallet: ConnectedWallet,
  loanPubKey: anchor.Address
) => {
  const program = await loadP2PProgram(connection, userWallet);

  let loanData = await program.account.loanMetadata.fetch(loanPubKey);

  return loanData;
};

export const fetchAllLoans = async (
  connection: anchor.web3.Connection,
  userWallet: ConnectedWallet
) => {
  const program = await loadP2PProgram(connection, userWallet);

  let loansData = await program.account.loanMetadata.all();

  const loans: { [key: string]: any } = {};
  loansData.map(loan => {
    loans[loan.publicKey.toString()] = loan.account;
  });

  return loans;
};

export const requestLoan = async (
  connection: anchor.web3.Connection,
  userWallet: ConnectedWallet,
  toast: ToastProps['toast'],
  requestAmount: string | number | anchor.BN | Buffer | Uint8Array | number[],
  interest: string | number | anchor.BN | Buffer | Uint8Array | number[],
  period: string | number | anchor.BN | Buffer | Uint8Array | number[],
  nftData: NFT
) => {
  console.log({
    connection,
    userWallet,
    requestAmount,
    interest,
    period,
    nftData
  });
  toast.processing();
  const program = await loadP2PProgram(connection, userWallet);

  console.log('requesting loan...');
  console.log('nft data mint', nftData.mint);
  console.log('nft data creator', nftData.creators);
  const nftMint = new PublicKey(nftData.mint);

  const nftVerifiedCreatorAddress = (nftData.creators ?? []).filter(
    (creator: any) => creator.verified
  )[0].address;
  if (!nftVerifiedCreatorAddress) {
    console.log('no verified creator found');
    return;
  }
  const nftVerifiedCreator = new PublicKey(nftVerifiedCreatorAddress);

  //@ts-ignore
  const [vaultAuthority, vaultAuthorityBump] =
    await web3.PublicKey.findProgramAddress(
      [Buffer.from('nft'), nftVerifiedCreator.toBuffer()],
      programID
    );

  //@ts-ignore
  const [loanMetadata, loanMetadataBump] =
    await web3.PublicKey.findProgramAddress(
      [vaultAuthority.toBuffer(), nftMint.toBuffer()],
      programID
    );

  const [nft_metadata, metadataBump] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer()
    ],
    METADATA_PROGRAM_ID
  );

  const [nftVault] = await PublicKey.findProgramAddress(
    [
      vaultAuthority.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer()
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );

  //@ts-ignore
  let bumps = {
    vaultAuthority: new anchor.BN(vaultAuthorityBump),
    loanMetadata: new anchor.BN(loanMetadataBump)
  };

  const borrowerTokenAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    LOAN_CURRENCY_TOKEN
  );

  const borrowerNftAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    nftMint
  );

  requestAmount = new anchor.BN(requestAmount).mul(
    new anchor.BN(LOAN_CURRENCY_LAMPORTS)
  );

  console.log('loanMetadata', loanMetadata.toString());
  console.log('vaultAuthority', vaultAuthority.toString());
  console.log('nftMint', nftMint.toString());
  console.log('nft_metadata', nft_metadata.toString());
  console.log('nftVerifiedCreator', nftVerifiedCreator.toString());
  console.log('nftVault', nftVault.toString());
  console.log('tokenMint', LOAN_CURRENCY_TOKEN);
  console.log('borrowerNftAccount', borrowerNftAccount.toString());
  console.log('borrowerTokenAccount', borrowerTokenAccount.toString());
  console.log('borrower', userWallet.publicKey.toString());

  try {
    await program.rpc.borrowRequest(
      bumps,
      new anchor.BN(requestAmount),
      new anchor.BN(interest),
      new anchor.BN(period),
      {
        accounts: {
          loanMetadata: loanMetadata,
          vaultAuthority: vaultAuthority,
          nftMint: new PublicKey(nftMint),
          nftMetadata: nft_metadata,
          nftVerifiedCreator: nftVerifiedCreator,
          nftVault: nftVault,
          borrower: userWallet.publicKey,
          tokenMint: new PublicKey(LOAN_CURRENCY_TOKEN),
          borrowerNftAccount: borrowerNftAccount,
          borrowerTokenAccount: borrowerTokenAccount,
          associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY
        }
      }
    );
    toast.success('Loan order created successfully ');
  } catch (error) {
    console.log('Promise rejected!', error);
    toast.error('Error');
  } finally {
    toast.clear();
  }

  const requestedLoan = fetchLoan(connection, userWallet, loanMetadata);

  return requestedLoan;
};

const wrapSol = async (
  connection: Connection,
  userWallet: ConnectedWallet,
  loanObj: { requestedAmount: any },
  tokenAccount: anchor.web3.PublicKey
) => {
  const { requestedAmount } = loanObj;

  console.log(`tokenAccount: ${tokenAccount}`);
  const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);

  console.log(`tokenAccountInfo: ${tokenAccountInfo}`);

  let solTransferTransaction = new Transaction().add(
    // trasnfer SOL
    SystemProgram.transfer({
      fromPubkey: userWallet.publicKey,
      toPubkey: tokenAccount,
      lamports: requestedAmount
    }),
    // sync wrapped SOL balance
    createSyncNativeInstruction(tokenAccount)
  );

  solTransferTransaction.feePayer = userWallet.publicKey;
  solTransferTransaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;

  const signed = await userWallet.signTransaction(solTransferTransaction);

  const transactionSignature = await connection.sendRawTransaction(
    signed.serialize()
  );

  await connection.confirmTransaction(transactionSignature);
};

export const acceptRequest = async (
  connection: anchor.web3.Connection,
  userWallet: ConnectedWallet,
  toast: ToastProps['toast'],
  loanPublicKey: anchor.web3.PublicKeyData,
  loanObj: {
    requestedAmount: any;
    vaultAuthority?: any;
    nftMint?: any;
    nftVerifiedCreator?: any;
    borrower?: any;
    borrowerTokenAccount?: any;
    tokenMint?: any;
  }
) => {
  try {
    toast.processing();
    const program = await loadP2PProgram(connection, userWallet);

    const {
      requestedAmount,
      vaultAuthority,
      nftMint,
      nftVerifiedCreator,
      borrower,
      borrowerTokenAccount,
      tokenMint
    } = loanObj;

    const lenderTokenAccount = await getOrCreateAssociatedTokenAddress(
      connection,
      userWallet,
      LOAN_CURRENCY_TOKEN
    );

    if (new PublicKey(tokenMint).toBase58() == SOL_TOKEN.toBase58()) {
      await wrapSol(connection, userWallet, loanObj, lenderTokenAccount);
    }

    const lenderNftAccount = await getOrCreateAssociatedTokenAddress(
      connection,
      userWallet,
      new PublicKey(nftMint)
    );

    // console.log({ lenderNftAccount });

    console.log('loanMetadata', loanPublicKey);
    console.log('vaultAuthority', vaultAuthority.toString());
    console.log('nftMint', nftMint.toString());
    console.log('nftVerifiedCreator', nftVerifiedCreator.toString());
    console.log('borrower', borrower.toString());
    console.log('borrowerTokenAccount', borrowerTokenAccount.toString());
    console.log('tokenMint', tokenMint.toString());
    console.log('lender', userWallet.publicKey.toString());
    console.log('lenderTokenAccount', lenderTokenAccount.toString());
    console.log('lenderNftAccount', lenderNftAccount.toString());
    console.log('tokenProgram', TOKEN_PROGRAM_ID);

    const res = await program.rpc.acceptRequest({
      accounts: {
        loanMetadata: new PublicKey(loanPublicKey),
        vaultAuthority: new PublicKey(vaultAuthority),
        nftMint: new PublicKey(nftMint),
        nftVerifiedCreator: new PublicKey(nftVerifiedCreator),
        borrower: new PublicKey(borrower),
        borrowerTokenAccount: new PublicKey(borrowerTokenAccount),
        tokenMint: new PublicKey(tokenMint),
        lender: userWallet.publicKey,
        lenderTokenAccount: new PublicKey(lenderTokenAccount),
        lenderNftAccount: new PublicKey(lenderNftAccount),
        feeTokenAccount: new PublicKey(
          'CtuqTd8V78QPAxcdDwFpFZ2EfeZZuwTVNUQStq2KSnJU'
        ),
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY
      }
    });

    toast.success('Lend successful');
  } catch (error) {
    console.log('Promise rejected!', error);
    toast.error('Error');
  }

  const updatedLoan = await fetchLoan(
    connection,
    userWallet,
    new PublicKey(loanPublicKey)
  );
  return updatedLoan;
};

export const liquidate = async (
  connection: anchor.web3.Connection,
  userWallet: ConnectedWallet,
  toast: ToastProps['toast'],
  loanPubKey: anchor.Address,
  loanObj: {
    vaultAuthority: any;
    nftVault: any;
    lenderNftAccount: any;
    nftMint: any;
  }
) => {
  toast.processing();
  const program = await loadP2PProgram(connection, userWallet);

  console.log('liquidating loan...');

  const { vaultAuthority, nftVault, lenderNftAccount, nftMint } = loanObj;

  // console.log("loanPubKey", loanPubKey.toString());
  // console.log("vaultvaultAuthority", vaultAuthority.toString());
  // console.log("userWallet", userWallet.publicKey.toString());
  // console.log("nftVault", nftVault.toString());
  // console.log("lenderNftAccount", lenderNftAccount.toString());
  // console.log("TOKEN_PROGRAM_IDT", TOKEN_PROGRAM_ID.toString());

  try {
    await program.rpc.liquidateLoan({
      accounts: {
        loanMetadata: loanPubKey,
        vaultAuthority: vaultAuthority,
        lender: userWallet.publicKey,
        nftVault: nftVault,
        lenderNftAccount: lenderNftAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        nftMint: nftMint
      }
    });
    toast.success('Liquidate successful');
  } catch (error) {
    console.log('Promise rejected!', error);
    toast.error('Error');
  }

  const updatedLoan = fetchLoan(connection, userWallet, loanPubKey);

  return updatedLoan;
};

export const payback = async (
  connection: anchor.web3.Connection,
  userWallet: ConnectedWallet,
  toast: ToastProps['toast'],
  loanPublicKey: anchor.web3.PublicKeyData,
  loanObj: {
    vaultAuthority?: any;
    nftMint?: any;
    nftVault?: any;
    tokenMint?: any;
    borrowerTokenAccount?: any;
    borrowerNftAccount?: any;
    lenderTokenAccount?: any;
    requestedAmount: any;
    lender?: any;
  }
) => {
  const {
    vaultAuthority,
    nftMint,
    nftVault,
    tokenMint,
    borrowerNftAccount,
    lenderTokenAccount,
    lender
  } = loanObj;
  toast.processing();
  const program = await loadP2PProgram(connection, userWallet);

  console.log('payback loan...');

  // console.log(TOKEN_PROGRAM_ID);

  const borrowerTokenAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    LOAN_CURRENCY_TOKEN
  );

  if (new PublicKey(tokenMint).toBase58() == SOL_TOKEN.toBase58()) {
    await wrapSol(connection, userWallet, loanObj, borrowerTokenAccount);
  }

  try {
    const res = await program.rpc.paybackLoan({
      accounts: {
        loanMetadata: new PublicKey(loanPublicKey),
        vaultAuthority: vaultAuthority,
        borrower: userWallet.publicKey,
        borrowerNftAccount: new PublicKey(borrowerNftAccount),
        tokenMint: new PublicKey(tokenMint),
        lender: new PublicKey(lender),
        nftVault: nftVault,
        borrowerTokenAccount: borrowerTokenAccount,
        lenderTokenAccount: new PublicKey(lenderTokenAccount),
        feeTokenAccount: new PublicKey(
          'CtuqTd8V78QPAxcdDwFpFZ2EfeZZuwTVNUQStq2KSnJU'
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY
      }
    });
    toast.success('payback successful');
  } catch (error) {
    console.log('Promise rejected!', error);
    toast.error('Error');
  }

  // console.log("res", res);

  const updatedLoan = fetchLoan(
    connection,
    userWallet,
    new PublicKey(loanPublicKey)
  );

  return updatedLoan;
};

export const cancelRequest = async (
  connection: anchor.web3.Connection,
  userWallet: ConnectedWallet,
  toast: ToastProps['toast'],
  loanPublicKey: anchor.web3.PublicKeyInitData,
  loanObj: { vaultAuthority: any; nftVault: any; borrowerNftAccount: any }
) => {
  const { vaultAuthority, nftVault, borrowerNftAccount } = loanObj;

  const program = await loadP2PProgram(connection, userWallet);

  toast.processing();
  console.log('cancel request...');
  try {
    const res = await program.rpc.cancelRequest({
      accounts: {
        loanMetadata: new PublicKey(loanPublicKey),
        vaultAuthority: vaultAuthority,
        borrower: userWallet.publicKey,
        borrowerNftAccount: new PublicKey(borrowerNftAccount),
        nftVault: nftVault,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    });
    toast.success('Loan request successfully deleted ');
  } catch (error) {
    console.log('Promise rejected!', error);
    toast.error('Error');
  }

  // commenting out to avoid calling a cancelled pda which causes error
  // TODO : send the user back to the lend page once the cancel borrow request operation  is done
  //const updatedLoan = fetchLoan(connection, userWallet, loanPublicKey);

  //return updatedLoan;
};
