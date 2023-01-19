export type HoneyP2p = {
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
      name: 'extendPeriod';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lender';
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
          name: 'nftMint';
          isMut: false;
          isSigner: false;
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
          name: 'feeTokenAccount';
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
          name: 'tokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'lender';
          isMut: false;
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
          name: 'feeTokenAccount';
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
      name: 'liquidateLoan';
      accounts: [
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultAuthority';
          isMut: false;
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
        }
      ];
      args: [];
    },
    {
      name: 'createCounterOffer';
      accounts: [
        {
          name: 'creator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'loanMetadata';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'offerMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'offerEscrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'creatorTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
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
            defined: 'CounterOfferBumpSeeds';
          };
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
      name: 'cancelCounterOffer';
      accounts: [
        {
          name: 'creator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'loanMetadata';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'offerMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'offerEscrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'creatorTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'bump';
          type: {
            defined: 'CounterOfferBumpSeeds';
          };
        }
      ];
    },
    {
      name: 'acceptCounterOffer';
      accounts: [
        {
          name: 'borrower';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'creator';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'loanMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'offerMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'borrowerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lenderNftAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'offerEscrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'creatorTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'feeTokenAccount';
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
      args: [
        {
          name: 'bump';
          type: {
            defined: 'CounterOfferBumpSeeds';
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'loanMetadata';
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
    },
    {
      name: 'offerMetadata';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'creator';
            type: 'publicKey';
          },
          {
            name: 'creatorTokenAccount';
            type: 'publicKey';
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
    },
    {
      name: 'CounterOfferBumpSeeds';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'offerMetadata';
            type: 'u8';
          },
          {
            name: 'escrowAuthority';
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
      name: 'LoanNotStarted';
      msg: "can't accept; loan has already started";
    },
    {
      code: 6004;
      name: 'LoanAlreadyStarted';
      msg: "can't extend loan; not started";
    },
    {
      code: 6005;
      name: 'LoanAlreadyCreated';
      msg: "can't create loan again; already started";
    },
    {
      code: 6006;
      name: 'Overflow';
      msg: 'overflow';
    },
    {
      code: 6007;
      name: 'AmountCantbeZero';
      msg: "amount can't be zero";
    },
    {
      code: 6008;
      name: 'InterestCantbeZero';
      msg: "interest can't be zero";
    },
    {
      code: 6009;
      name: 'PeriodCantbeZero';
      msg: "period can't be zero";
    },
    {
      code: 6010;
      name: 'PeriodCantbeShorter';
      msg: 'period should be longer than previous one';
    },
    {
      code: 6011;
      name: 'InvalidFeeTokenAccount';
      msg: 'invalid fee token account';
    }
  ];
};

export const IDL: HoneyP2p = {
  version: '0.1.0',
  name: 'honey_p2p',
  instructions: [
    {
      name: 'borrowRequest',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultAuthority',
          isMut: true,
          isSigner: false
        },
        {
          name: 'nftMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'nftMetadata',
          isMut: false,
          isSigner: false
        },
        {
          name: 'nftVerifiedCreator',
          isMut: false,
          isSigner: false
        },
        {
          name: 'nftVault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrower',
          isMut: false,
          isSigner: true
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'borrowerNftAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrowerTokenAccount',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'bump',
          type: {
            defined: 'BorrowRequestBumpSeeds'
          }
        },
        {
          name: 'requestedAmount',
          type: 'u64'
        },
        {
          name: 'interest',
          type: 'u64'
        },
        {
          name: 'period',
          type: 'u64'
        }
      ]
    },
    {
      name: 'updateRequestAmount',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrower',
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: 'requestedAmount',
          type: 'u64'
        }
      ]
    },
    {
      name: 'updateInterest',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrower',
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: 'interest',
          type: 'u64'
        }
      ]
    },
    {
      name: 'updatePeriod',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrower',
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: 'period',
          type: 'u64'
        }
      ]
    },
    {
      name: 'extendPeriod',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lender',
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: 'period',
          type: 'u64'
        }
      ]
    },
    {
      name: 'cancelRequest',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultAuthority',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrower',
          isMut: false,
          isSigner: true
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'borrowerNftAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'nftVault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'acceptRequest',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultAuthority',
          isMut: true,
          isSigner: false
        },
        {
          name: 'nftMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'nftVerifiedCreator',
          isMut: false,
          isSigner: false
        },
        {
          name: 'borrower',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrowerTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lender',
          isMut: false,
          isSigner: true
        },
        {
          name: 'lenderTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lenderNftAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'feeTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'paybackLoan',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultAuthority',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrower',
          isMut: false,
          isSigner: true
        },
        {
          name: 'borrowerNftAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'lender',
          isMut: false,
          isSigner: false
        },
        {
          name: 'nftVault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrowerTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lenderTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'feeTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'liquidateLoan',
      accounts: [
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultAuthority',
          isMut: false,
          isSigner: false
        },
        {
          name: 'lender',
          isMut: false,
          isSigner: true
        },
        {
          name: 'nftVault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lenderNftAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'createCounterOffer',
      accounts: [
        {
          name: 'creator',
          isMut: true,
          isSigner: true
        },
        {
          name: 'loanMetadata',
          isMut: false,
          isSigner: false
        },
        {
          name: 'offerMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'offerEscrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'creatorTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'bump',
          type: {
            defined: 'CounterOfferBumpSeeds'
          }
        },
        {
          name: 'interest',
          type: 'u64'
        },
        {
          name: 'period',
          type: 'u64'
        }
      ]
    },
    {
      name: 'cancelCounterOffer',
      accounts: [
        {
          name: 'creator',
          isMut: true,
          isSigner: true
        },
        {
          name: 'loanMetadata',
          isMut: false,
          isSigner: false
        },
        {
          name: 'offerMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'offerEscrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'creatorTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'bump',
          type: {
            defined: 'CounterOfferBumpSeeds'
          }
        }
      ]
    },
    {
      name: 'acceptCounterOffer',
      accounts: [
        {
          name: 'borrower',
          isMut: true,
          isSigner: true
        },
        {
          name: 'creator',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'nftMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'loanMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'offerMetadata',
          isMut: true,
          isSigner: false
        },
        {
          name: 'borrowerTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lenderNftAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'offerEscrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'creatorTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'feeTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'bump',
          type: {
            defined: 'CounterOfferBumpSeeds'
          }
        }
      ]
    }
  ],
  accounts: [
    {
      name: 'loanMetadata',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'borrower',
            type: 'publicKey'
          },
          {
            name: 'tokenMint',
            type: 'publicKey'
          },
          {
            name: 'borrowerTokenAccount',
            type: 'publicKey'
          },
          {
            name: 'nftMint',
            type: 'publicKey'
          },
          {
            name: 'nftVault',
            type: 'publicKey'
          },
          {
            name: 'requestedAmount',
            type: 'u64'
          },
          {
            name: 'interest',
            type: 'u64'
          },
          {
            name: 'period',
            type: 'u64'
          },
          {
            name: 'lender',
            type: 'publicKey'
          },
          {
            name: 'lenderTokenAccount',
            type: 'publicKey'
          },
          {
            name: 'createdAt',
            type: 'i64'
          },
          {
            name: 'loanStartTime',
            type: 'i64'
          },
          {
            name: 'paidBackAt',
            type: 'i64'
          },
          {
            name: 'withdrewAt',
            type: 'i64'
          },
          {
            name: 'status',
            type: 'bool'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'vaultAuthority',
            type: 'publicKey'
          },
          {
            name: 'nftVerifiedCreator',
            type: 'publicKey'
          },
          {
            name: 'nftMetadata',
            type: 'publicKey'
          },
          {
            name: 'vaultAuthorityBump',
            type: 'u8'
          },
          {
            name: 'lenderNftAccount',
            type: 'publicKey'
          },
          {
            name: 'borrowerNftAccount',
            type: 'publicKey'
          }
        ]
      }
    },
    {
      name: 'offerMetadata',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'creator',
            type: 'publicKey'
          },
          {
            name: 'creatorTokenAccount',
            type: 'publicKey'
          },
          {
            name: 'interest',
            type: 'u64'
          },
          {
            name: 'period',
            type: 'u64'
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'BorrowRequestBumpSeeds',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'vaultAuthority',
            type: 'u8'
          },
          {
            name: 'loanMetadata',
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'CounterOfferBumpSeeds',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'offerMetadata',
            type: 'u8'
          },
          {
            name: 'escrowAuthority',
            type: 'u8'
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 6000,
      name: 'VerifiedCreatorMismatch',
      msg: 'mismatch in verified creator'
    },
    {
      code: 6001,
      name: 'LoanPeriodExceeded',
      msg: 'loan repayment payment has been exceeded'
    },
    {
      code: 6002,
      name: 'LoanPeriodNotExceeded',
      msg: "can't liquidate as loan repayment payment has not been exceeded"
    },
    {
      code: 6003,
      name: 'LoanNotStarted',
      msg: "can't accept; loan has already started"
    },
    {
      code: 6004,
      name: 'LoanAlreadyStarted',
      msg: "can't extend loan; not started"
    },
    {
      code: 6005,
      name: 'LoanAlreadyCreated',
      msg: "can't create loan again; already started"
    },
    {
      code: 6006,
      name: 'Overflow',
      msg: 'overflow'
    },
    {
      code: 6007,
      name: 'AmountCantbeZero',
      msg: "amount can't be zero"
    },
    {
      code: 6008,
      name: 'InterestCantbeZero',
      msg: "interest can't be zero"
    },
    {
      code: 6009,
      name: 'PeriodCantbeZero',
      msg: "period can't be zero"
    },
    {
      code: 6010,
      name: 'PeriodCantbeShorter',
      msg: 'period should be longer than previous one'
    },
    {
      code: 6011,
      name: 'InvalidFeeTokenAccount',
      msg: 'invalid fee token account'
    }
  ]
};
