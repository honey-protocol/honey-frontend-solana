export type honey_p2p = {
  version: '0.1.0';
  name: 'honey_p2p';
  instructions: [
    {
      name: 'borrowRequest';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMetadata';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftVerifiedCreator';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrower';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'tokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'borrowerNftAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrowerTokenAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'bump';
          type: {
            defined: 'BorrowRequestBumpSeeds';
          };
        },
        {
          name: 'requestedAmount';
          type: 'u64';
        },
        {
          name: 'interest';
          type: 'u64';
        },
        {
          name: 'period';
          type: 'u64';
        }
      ];
    },
    {
      name: 'updateRequestAmount';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrower';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'requestedAmount';
          type: 'u64';
        }
      ];
    },
    {
      name: 'updateInterest';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrower';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'interest';
          type: 'u64';
        }
      ];
    },
    {
      name: 'updatePeriod';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrower';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'period';
          type: 'u64';
        }
      ];
    },
    {
      name: 'cancelRequest';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrower';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'borrowerNftAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'acceptRequest';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftVerifiedCreator';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'borrower';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrowerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lender';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'lenderTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lenderNftAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'paybackLoan';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrower';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'borrowerNftAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrowerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lenderTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'liquidateLoan';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lender';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'nftVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lenderNftAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: 'LoanMetadata';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'borrower';
            type: 'publicKey';
          },
          {
            name: 'tokenMint';
            type: 'publicKey';
          },
          {
            name: 'borrowerTokenAccount';
            type: 'publicKey';
          },
          {
            name: 'nftMint';
            type: 'publicKey';
          },
          {
            name: 'nftVault';
            type: 'publicKey';
          },
          {
            name: 'requestedAmount';
            type: 'u64';
          },
          {
            name: 'interest';
            type: 'u64';
          },
          {
            name: 'period';
            type: 'u64';
          },
          {
            name: 'lender';
            type: 'publicKey';
          },
          {
            name: 'lenderTokenAccount';
            type: 'publicKey';
          },
          {
            name: 'createdAt';
            type: 'i64';
          },
          {
            name: 'loanStartTime';
            type: 'i64';
          },
          {
            name: 'paidBackAt';
            type: 'i64';
          },
          {
            name: 'withdrewAt';
            type: 'i64';
          },
          {
            name: 'status';
            type: 'bool';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'vaultAuthority';
            type: 'publicKey';
          },
          {
            name: 'nftVerifiedCreator';
            type: 'publicKey';
          },
          {
            name: 'nftMetadata';
            type: 'publicKey';
          },
          {
            name: 'vaultAuthorityBump';
            type: 'u8';
          },
          {
            name: 'lenderNftAccount';
            type: 'publicKey';
          },
          {
            name: 'borrowerNftAccount';
            type: 'publicKey';
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'BorrowRequestBumpSeeds';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'vaultAuthority';
            type: 'u8';
          },
          {
            name: 'loanMetadata';
            type: 'u8';
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'VerifiedCreatorMismatch';
      msg: 'mismatch in verified creator';
    },
    {
      code: 6001;
      name: 'LoanPeriodExceeded';
      msg: 'loan repayment payment has been exceeded';
    },
    {
      code: 6002;
      name: 'LoanPeriodNotExceeded';
      msg: "can't liquidate as loan repayment payment has not been exceeded";
    },
    {
      code: 6003;
      name: 'LoanAlreadyStarted';
      msg: "can't accept; loan has already started";
    },
    {
      code: 6004;
      name: 'LoanAlreadyCreated';
      msg: "can't create loan again; already started";
    },
    {
      code: 6005;
      name: 'Overflow';
      msg: 'overflow';
    },
    {
      code: 6006;
      name: 'AmountCantbeZero';
      msg: "amount can't be zero";
    },
    {
      code: 6007;
      name: 'InterestCantbeZero';
      msg: "interest can't be zero";
    },
    {
      code: 6008;
      name: 'PeriodCantbeZero';
      msg: "period can't be zero";
    }
  ];
  metadata: {
    address: 'GUaFHeHYLhD64NZzzKtoKwTJ8ePooBfpuE6hwhrW7vFH';
  };
};
