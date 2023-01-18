import { P2PLoans } from 'types/p2p';

export const sortLoansByParam = (
  loans: P2PLoans,
  param: string,
  direction: 'asc' | 'desc'
) => {
  const sortedLoansIds = Object.keys(loans).sort((a, b) =>
    direction === 'asc'
      ? loans[a][param] - loans[b][param]
      : loans[b][param] - loans[a][param]
  );
  return sortedLoansIds;
};
