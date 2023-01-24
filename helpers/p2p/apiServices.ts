// import { Nft } from '@metaplex-foundation/js';
import * as anchor from '@project-serum/anchor';
import { Program, web3 } from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import {
  Fraction,
  getATAAddressSync,
  createATAInstruction,
  TokenAccountLayout
} from '@saberhq/token-utils';
import {
  Connection,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction
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
import { ToastProps } from 'hooks/useToast';
import { HoneyP2p } from 'types/p2p_program';
import { ConnectedWallet } from '@saberhq/use-solana';
import { sendAllTransactions, TxnResponse } from '@honey-finance/sdk';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

const programID = HONEY_P2P_PROGRAM;

async function getProvider(connection: Connection, wallet: any) {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: 'processed'
  });
  return provider;
}

async function loadP2PProgram(connection: Connection, userWallet: any) {
  const provider = await getProvider(connection, userWallet);
  const idl = require('./idl/honey_p2p.json');
  return new anchor.Program(
    idl!,
    HONEY_P2P_PROGRAM,
    provider
  ) as Program<HoneyP2p>;
}

async function getOrCreateAssociatedTokenAddress(
  connection: anchor.web3.Connection,
  userWallet: any,
  associatedToken: anchor.web3.PublicKey,
  transaction: Transaction
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
    transaction.add(
      createATAInstruction({
        address: userWallet.publicKey,
        mint: associatedTokenAddress,
        owner: userWallet.publicKey,
        payer: associatedToken
      })
    );
  }

  return associatedTokenAddress;
}

export const fetchLoan = async (
  connection: anchor.web3.Connection,
  userWallet: any,
  loanPubKey: anchor.Address
) => {
  const program = await loadP2PProgram(connection, userWallet);

  let loanData = await program.account.loanMetadata.fetch(loanPubKey);

  return loanData;
};

export const fetchAllLoans = async (
  connection: anchor.web3.Connection,
  userWallet?: any
) => {
  const readOnlyKeypair = new Keypair();
  const program = await loadP2PProgram(
    connection,
    userWallet ?? new NodeWallet(readOnlyKeypair)
  );

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
    creator => creator.verified
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
    vaultAuthority: vaultAuthorityBump,
    loanMetadata: loanMetadataBump
  };

  const tx = new Transaction();
  const borrowerTokenAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    LOAN_CURRENCY_TOKEN,
    tx
  );

  const borrowerNftAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    nftMint,
    tx
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
    tx.add(
      await program.methods
        .borrowRequest(
          bumps,
          new anchor.BN(requestAmount),
          new anchor.BN(interest),
          new anchor.BN(period)
        )
        .accounts({
          loanMetadata: loanMetadata,
          vaultAuthority: vaultAuthority,
          nftMint: nftMint,
          nftMetadata: nft_metadata,
          nftVerifiedCreator: nftVerifiedCreator,
          nftVault: nftVault,
          borrower: userWallet.publicKey,
          tokenMint: LOAN_CURRENCY_TOKEN,
          borrowerNftAccount: borrowerNftAccount,
          borrowerTokenAccount: borrowerTokenAccount,
          associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY
        })
        .instruction()
    );

    const provider = await getProvider(connection, userWallet);

    console.log(tx.instructions);
    await sendAllTransactions(provider, [
      {
        ix: tx.instructions as TransactionInstruction[],
        signers: [].filter(signer => signer) as Signer[]
      }
    ]);

    toast.success('Loan order created successfully');
  } catch (error) {
    console.log('Promise rejected!', error);
    toast.error('Error');
  } finally {
    toast.clear();
  }

  const requestedLoan = fetchLoan(connection, userWallet, loanMetadata);

  return requestedLoan;
};

// const addWrapSolIx = async (
//   connection: Connection,
//   userWallet: any,
//   loanObj: { requestedAmount: any },
//   tokenAccount: anchor.web3.PublicKey,
//   transaction: Transaction
// ) => {
//   const { requestedAmount } = loanObj;

//   console.log(`tokenAccount: ${tokenAccount}`);
//   const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);

//   console.log(`tokenAccountInfo: ${tokenAccountInfo}`);

//   transaction.add(
//     // trasnfer SOL
//     SystemProgram.transfer({
//       fromPubkey: userWallet.publicKey,
//       toPubkey: tokenAccount,
//       lamports: requestedAmount
//     }),
//     // sync wrapped SOL balance
//     createSyncNativeInstruction(tokenAccount)
//   );
// };

const getWrapSolIxs = async (
  connection: Connection,
  userWallet: ConnectedWallet,
  amount: anchor.BN
) => {
  // When handling SOL, ignore existing wsol accounts and initialize a new wrapped sol account
  // The app will always wrap native sol, ignoring any existing wsol
  const depositSourceKeypair = Keypair.generate();
  const depositSourcePubkey = depositSourceKeypair.publicKey;

  const rent = await connection.getMinimumBalanceForRentExemption(
    TokenAccountLayout.span
  );
  const createTokenAccountIx = SystemProgram.createAccount({
    fromPubkey: userWallet.publicKey,
    newAccountPubkey: depositSourcePubkey,
    programId: TOKEN_PROGRAM_ID,
    space: TokenAccountLayout.span,
    lamports: Number(amount.addn(rent).toString())
  });

  const initTokenAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    NATIVE_MINT,
    depositSourcePubkey,
    userWallet.publicKey
  );

  const closeTokenAccountIx = Token.createCloseAccountInstruction(
    TOKEN_PROGRAM_ID,
    depositSourcePubkey,
    userWallet.publicKey,
    userWallet.publicKey,
    []
  );

  return {
    depositSourceKeypair,
    createTokenAccountIx,
    initTokenAccountIx,
    closeTokenAccountIx
  };
};

export const acceptRequest = async (
  connection: anchor.web3.Connection,
  userWallet: any,
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

    const tx = new Transaction();
    const lenderTokenAccount = await getOrCreateAssociatedTokenAddress(
      connection,
      userWallet,
      LOAN_CURRENCY_TOKEN,
      tx
    );

    let depositSrcKeypair: Keypair | undefined;
    let createTokenAccIx: anchor.web3.TransactionInstruction | undefined;
    let initTokenAccIx: anchor.web3.TransactionInstruction | undefined;
    let closeTokenAccIx: anchor.web3.TransactionInstruction | undefined;

    if (new PublicKey(tokenMint).toBase58() == SOL_TOKEN.toBase58()) {
      const {
        depositSourceKeypair,
        createTokenAccountIx,
        initTokenAccountIx,
        closeTokenAccountIx
      } = await getWrapSolIxs(
        connection,
        userWallet,
        new anchor.BN(requestedAmount)
      );

      depositSrcKeypair = depositSourceKeypair;
      createTokenAccIx = createTokenAccountIx;
      initTokenAccIx = initTokenAccountIx;
      closeTokenAccIx = closeTokenAccountIx;
    }

    // if (createTokenAccIx && initTokenAccIx) {
    //   tx.add(createTokenAccIx);
    //   tx.add(initTokenAccIx);
    // }

    const lenderNftAccount = await getOrCreateAssociatedTokenAddress(
      connection,
      userWallet,
      new PublicKey(nftMint),
      tx
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

    const acceptRequestIx = await program.methods
      .acceptRequest()
      .accounts({
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
          '8aiMHRciCXHoYrGE7sGQ8f3cN5bxY6neTQUzUAoSY2ye'
        ),
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY
      })
      .instruction();
    // if (closeTokenAccIx) {
    //   tx.add(closeTokenAccIx);
    // }

    let anotherKeypair = Keypair.generate();

    console.log({
      tx,
      createTokenAccIx,
      initTokenAccIx,
      heh: 'adsfß',
      anotherKeypair: anotherKeypair.publicKey.toString(),
      depositSrcKeypair: depositSrcKeypair?.publicKey.toString()
    });

    const ixs = [
      {
        ix: [
          createTokenAccIx,
          initTokenAccIx,
          acceptRequestIx,
          closeTokenAccIx
        ].filter(ix => ix) as TransactionInstruction[],
        signers: [depositSrcKeypair].filter(signer => signer) as Signer[]
      }
    ];

    // await (
    //   await getProvider(connection, userWallet)
    // ).sendAndConfirm(tx, [depositSrcKeypair as Signer]);

    const provider = await getProvider(connection, userWallet);
    await sendAllTransactions(provider, ixs);

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
  userWallet: any,
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
        tokenProgram: TOKEN_PROGRAM_ID
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
  userWallet: any,
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

  const tx = new Transaction();
  const borrowerTokenAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    LOAN_CURRENCY_TOKEN,
    tx
  );

  //fix and add back
  // if (new PublicKey(tokenMint).toBase58() == SOL_TOKEN.toBase58()) {
  //   await addWrapSolIx(
  //     connection,
  //     userWallet,
  //     loanObj,
  //     borrowerTokenAccount,
  //     tx
  //   );
  // }

  try {
    tx.add(
      await program.methods
        .paybackLoan()
        .accounts({
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
            '8aiMHRciCXHoYrGE7sGQ8f3cN5bxY6neTQUzUAoSY2ye'
          ),
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY
        })
        .instruction()
    );

    await (await getProvider(connection, userWallet)).sendAndConfirm(tx);
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
  loanObj: {
    vaultAuthority: any;
    nftVault: any;
    borrowerNftAccount: any;
    nftMint: any;
  }
) => {
  const { vaultAuthority, nftVault, borrowerNftAccount, nftMint } = loanObj;

  const program = await loadP2PProgram(connection, userWallet);

  console.log('cancel request...');
  toast.processing();
  console.log({
    loanMetadata: new PublicKey(loanPublicKey),
    vaultAuthority: vaultAuthority.toString(),
    borrower: userWallet.publicKey.toString(),
    nftMint: nftMint.toString(),
    borrowerNftAccount: new PublicKey(borrowerNftAccount).toBase58(),
    nftVault: nftVault.toString(),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY
  });
  try {
    const res = await program.rpc.cancelRequest({
      accounts: {
        loanMetadata: new PublicKey(loanPublicKey),
        vaultAuthority: vaultAuthority,
        borrower: userWallet.publicKey,
        nftMint: new PublicKey(nftMint),
        borrowerNftAccount: new PublicKey(borrowerNftAccount),
        nftVault: nftVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY
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
