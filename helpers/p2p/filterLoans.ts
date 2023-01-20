import BN from 'bn.js';
import {
  LOAN_CURRENCY_LAMPORTS,
  ONE_DAY_IN_SECONDS,
  ORDER_STATUS
} from 'constants/p2p';
import { P2PLoans, P2PLoan } from 'types/p2p';

export const convertLoanResultToLoanObj = (loan: any): P2PLoan => {
  return {
    id: loan.publicKey.toString(),
    borrower: loan.account.borrower,
    borrowerNftAccount: loan.account.borrowerNftAccount,
    borrowerTokenAccount: loan.account.borrowerTokenAccount,
    bump: loan.account.bump,
    createdAt: new BN(loan.account.createdAt),
    interest: new BN(loan.account.interest),
    lender: loan.account.lender,
    lenderNftAccount: loan.account.lenderNftAccount,
    lenderTokenAccount: loan.account.lenderTokenAccount,
    loanStartTime: new BN(loan.account.loanStartTime),
    nftMetadata: loan.account.nftMetadata,
    nftMint: loan.account.nftMint,
    nftVault: loan.account.nftVault,
    nftVerifiedCreator: loan.account.nftVerifiedCreator,
    paidBackAt: new BN(loan.account.paidBackAt),
    period: new BN(loan.account.period),
    requestedAmount: new BN(loan.account.requestedAmount),
    status: loan.account.status,
    tokenMint: loan.account.tokenMint,
    vaultAuthority: loan.account.vaultAuthority,
    vaultAuthorityBump: loan.account.vaultAuthorityBump,
    withdrewAt: new BN(loan.account.withdrewAt)
  };
};

// get loans(discoverScreen)only if lender is empty
export const getDiscoverScreenLoanOrders = (loans: P2PLoans) => {
  if (!loans) return null;

  const filteredOrders = loans.filter(loan => !hasLender(loan));

  return filteredOrders;
};

// get loans(applied) if current user is borrower
export const getAppliedLoanOrders = (
  loans: P2PLoans,
  currentLoggedInUser: string
) => {
  let filteredOrders: P2PLoans = loans.filter(
    loan => loan.borrower.toString() === currentLoggedInUser
  );

  return filteredOrders;
};

// get loans(lent) if currentUser is lender
export const getLentLoans = (loans: P2PLoans, currentLoggedInUser: string) => {
  let filteredOrders: P2PLoans = loans.filter(loan => {
    loan.lender.toString() === currentLoggedInUser;
  });

  return filteredOrders;
};

export const getOrderStatus = (
  lender: any,
  withdrewAt: any,
  paidBackAt: any,
  isDefaulted = false
) => {
  let orderStatus = '';

  if (!lender || lender == '11111111111111111111111111111111')
    orderStatus = ORDER_STATUS.OPEN;
  else if (isDefaulted) orderStatus = ORDER_STATUS.DEFAULTED;
  else if (lender?.toString().length > 0 && !(paidBackAt || withdrewAt))
    orderStatus = ORDER_STATUS.PROCESSED;
  else if (lender?.toString().length > 0 && (paidBackAt || withdrewAt))
    orderStatus = ORDER_STATUS.CLOSED;

  return orderStatus;
};

// export const filterLoansByCollection = (
//   loans: P2PLoans,
//   collectionVerifiedCreator: string
// ) => {
//   const filteredLoans: P2PLoans = {};
//   for (let i = 0; i < Object.keys(loans).length; i++) {
//     const loanId = Object.keys(loans)[i];
//     const loan = loans[loanId];
//     if (loan.nftVerifiedCreator === collectionVerifiedCreator) {
//       filteredLoans[loanId] = loan;
//     }
//   }
//   return filteredLoans;
// };

// export const filterLoansByAmount = (
//   loans: P2PLoans,
//   min: number,
//   max: number
// ) => {
//   const results: P2PLoans = {};
//   for (let i = 0; i < Object.keys(loans).length; i++) {
//     const loanId = Object.keys(loans)[i];
//     const amount = loans[loanId].requestedAmount;
//     if (
//       amount / LOAN_CURRENCY_LAMPORTS >= min &&
//       amount / LOAN_CURRENCY_LAMPORTS <= max
//     ) {
//       results[loanId] = loans[loanId];
//     }
//   }
//   return results;
// };

// export const filterLoansByTotalInterest = (
//   loans: P2PLoans,
//   min: number,
//   max: number
// ) => {
//   const results: P2PLoans = {};
//   for (let i = 0; i < Object.keys(loans).length; i++) {
//     const loanId = Object.keys(loans)[i];
//     const totalInterest =
//       ((loans[loanId].interest / 100) * loans[loanId].period) /
//       ONE_DAY_IN_SECONDS; // confirm formula
//     if (totalInterest >= min && totalInterest <= max) {
//       results[loanId] = loans[loanId];
//     }
//   }
//   return results;
// };

const hasLender = (loan: P2PLoan) => {
  return (
    loan.lender && loan.lender.toString() !== '11111111111111111111111111111111'
  );
};
