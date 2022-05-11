import { generateErrorMap } from '@saberhq/anchor-contrib';

export type VeHoney = {
  version: '0.1.0';
  name: 've_honey';
  instructions: [
    {
      name: 'initLocker';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'base';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMint';
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
          name: 'admin';
          type: 'publicKey';
        },
        {
          name: 'params';
          type: {
            defined: 'LockerParams';
          };
        }
      ];
    },
    {
      name: 'setLockerParams';
      accounts: [
        {
          name: 'admin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'LockerParams';
          };
        }
      ];
    },
    {
      name: 'initEscrow';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'approveProgramLockPrivilege';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'lockerAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'executableId';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'whitelistedOwner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'revokeProgramLockPrivilege';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'lockerAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'executableId';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'lock';
      accounts: [
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'sourceTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'sourceTokensAuthority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'duration';
          type: 'i64';
        }
      ];
    },
    {
      name: 'exit';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'lockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'destinationTokens';
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
      name: 'migrateLocker';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'base';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'newBase';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'newLocker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'governor';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'smartWallet';
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
          name: 'proposalActivationMinVotes';
          type: 'u64';
        }
      ];
    },
    {
      name: 'migrateEscrow';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'lockerAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'oldLocker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'newLocker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'oldEscrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'newEscrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'oldLockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'newLockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
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
      name: 'migrateWhitelist';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'oldLocker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'newLocker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'lockerAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'newWhitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'initLockerV2';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'base';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'governor';
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
          name: 'params';
          type: {
            defined: 'LockerParamsV2';
          };
        }
      ];
    },
    {
      name: 'initEscrowV2';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'setLockerParamsV2';
      accounts: [
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'governor';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'smartWallet';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'LockerParamsV2';
          };
        }
      ];
    },
    {
      name: 'approveProgramLockPrivilegeV2';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'governor';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'smartWallet';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'executableId';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'whitelistedOwner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'revokeProgramLockPrivilegeV2';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'governor';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'smartWallet';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: 'lockV2';
      accounts: [
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'sourceTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'sourceTokensAuthority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'duration';
          type: 'i64';
        }
      ];
    },
    {
      name: 'exitV2';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'lockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'destinationTokens';
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
      name: 'activateProposal';
      accounts: [
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'governor';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'proposal';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'governProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'castVote';
      accounts: [
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'voteDelegate';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'proposal';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vote';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'governor';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'governProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'side';
          type: 'u8';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'escrow';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'locker';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'tokens';
            type: 'publicKey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'escrowStartedAt';
            type: 'i64';
          },
          {
            name: 'escrowEndsAt';
            type: 'i64';
          }
        ];
      };
    },
    {
      name: 'escrowV2';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'locker';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'tokens';
            type: 'publicKey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'escrowStartedAt';
            type: 'i64';
          },
          {
            name: 'escrowEndsAt';
            type: 'i64';
          },
          {
            name: 'voteDelegate';
            type: 'publicKey';
          }
        ];
      };
    },
    {
      name: 'locker';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'base';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'tokenMint';
            type: 'publicKey';
          },
          {
            name: 'lockedSupply';
            type: 'u64';
          },
          {
            name: 'admin';
            type: 'publicKey';
          },
          {
            name: 'params';
            type: {
              defined: 'LockerParams';
            };
          }
        ];
      };
    },
    {
      name: 'lockerV2';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'base';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'tokenMint';
            type: 'publicKey';
          },
          {
            name: 'lockedSupply';
            type: 'u64';
          },
          {
            name: 'governor';
            type: 'publicKey';
          },
          {
            name: 'params';
            type: {
              defined: 'LockerParamsV2';
            };
          }
        ];
      };
    },
    {
      name: 'whitelistEntry';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'locker';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'programId';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'LockerParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'minStakeDuration';
            type: 'u64';
          },
          {
            name: 'maxStakeDuration';
            type: 'u64';
          },
          {
            name: 'whitelistEnabled';
            type: 'bool';
          },
          {
            name: 'multiplier';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'LockerParamsV2';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'minStakeDuration';
            type: 'u64';
          },
          {
            name: 'maxStakeDuration';
            type: 'u64';
          },
          {
            name: 'proposalActivationMinVotes';
            type: 'u64';
          },
          {
            name: 'whitelistEnabled';
            type: 'bool';
          },
          {
            name: 'multiplier';
            type: 'u8';
          }
        ];
      };
    }
  ];
  events: [
    {
      name: 'ExitEscrowEvent';
      fields: [
        {
          name: 'escrowOwner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        },
        {
          name: 'lockedSupply';
          type: 'u64';
          index: false;
        },
        {
          name: 'releasedAmount';
          type: 'u64';
          index: false;
        }
      ];
    },
    {
      name: 'InitEscrowEvent';
      fields: [
        {
          name: 'escrow';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'escrowOwner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        }
      ];
    },
    {
      name: 'InitLockerEvent';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'tokenMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'admin';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'params';
          type: {
            defined: 'LockerParams';
          };
          index: false;
        }
      ];
    },
    {
      name: 'InitLockerV2Event';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'tokenMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'governor';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'params';
          type: {
            defined: 'LockerParamsV2';
          };
          index: false;
        }
      ];
    },
    {
      name: 'LockEvent';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'escrowOwner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'tokenMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'amount';
          type: 'u64';
          index: false;
        },
        {
          name: 'lockerSupply';
          type: 'u64';
          index: false;
        },
        {
          name: 'duration';
          type: 'i64';
          index: false;
        },
        {
          name: 'prevEscrowEndsAt';
          type: 'i64';
          index: false;
        },
        {
          name: 'nextEscrowEndsAt';
          type: 'i64';
          index: false;
        },
        {
          name: 'nextEscrowStartedAt';
          type: 'i64';
          index: false;
        }
      ];
    },
    {
      name: 'ApproveLockPrivilegeEvent';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'programId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'owner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        }
      ];
    },
    {
      name: 'RevokeLockPrivilegeEvent';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'programId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'EscrowNotEnded';
      msg: 'Escrow has not ended.';
    },
    {
      code: 6001;
      name: 'InvalidLockerAdmin';
      msg: 'Invalid locker admin';
    },
    {
      code: 6002;
      name: 'LockupDurationTooShort';
      msg: 'Lockup duration must at least be the min stake duration.';
    },
    {
      code: 6003;
      name: 'LockupDurationTooLong';
      msg: 'Lockup duration must at most be the max stake duration.';
    },
    {
      code: 6004;
      name: 'RefreshCannotShorten';
      msg: 'A voting escrow refresh cannot shorten the escrow time remaining.';
    },
    {
      code: 6005;
      name: 'MustProvideWhitelist';
      msg: 'Program whitelist enabled; please provide whitelist entry and instructions sysvar';
    },
    {
      code: 6006;
      name: 'ProgramNotWhitelisted';
      msg: 'CPI caller not whitelisted to invoke lock instruction.';
    },
    {
      code: 6007;
      name: 'EscrowOwnerNotWhitelisted';
      msg: 'CPI caller not whitelisted for escrow owner to invoke lock instruction.';
    },
    {
      code: 6008;
      name: 'EscrowExpired';
      msg: 'Escrow was already expired.';
    },
    {
      code: 6009;
      name: 'LockedSupplyMismatch';
      msg: 'Token lock failed, locked supply mismatches the exact amount.';
    },
    {
      code: 6010;
      name: 'EscrowInUse';
      msg: 'The escrow has already locked.';
    },
    {
      code: 6011;
      name: 'EscrowNoBalance';
      msg: "The escrow doesn't have balance";
    },
    {
      code: 6012;
      name: 'ProposalMustBeActive';
      msg: 'The proposal must be active';
    },
    {
      code: 6013;
      name: 'GovernorMismatch';
      msg: 'Governor mismatch';
    },
    {
      code: 6014;
      name: 'ProgramIdMustBeExecutable';
      msg: 'Program id must be executable';
    },
    {
      code: 6015;
      name: 'InsufficientVotingPower';
      msg: 'Insufficient voting power to activate a proposal';
    }
  ];
};

export const IDL: VeHoney = {
  version: '0.1.0',
  name: 've_honey',
  instructions: [
    {
      name: 'initLocker',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'base',
          isMut: false,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenMint',
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
          name: 'admin',
          type: 'publicKey'
        },
        {
          name: 'params',
          type: {
            defined: 'LockerParams'
          }
        }
      ]
    },
    {
      name: 'setLockerParams',
      accounts: [
        {
          name: 'admin',
          isMut: false,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'LockerParams'
          }
        }
      ]
    },
    {
      name: 'initEscrow',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'approveProgramLockPrivilege',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'lockerAdmin',
          isMut: false,
          isSigner: true
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'executableId',
          isMut: false,
          isSigner: false
        },
        {
          name: 'whitelistedOwner',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'revokeProgramLockPrivilege',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'lockerAdmin',
          isMut: false,
          isSigner: true
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'executableId',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'lock',
      accounts: [
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'sourceTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'sourceTokensAuthority',
          isMut: false,
          isSigner: true
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'amount',
          type: 'u64'
        },
        {
          name: 'duration',
          type: 'i64'
        }
      ]
    },
    {
      name: 'exit',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'lockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'destinationTokens',
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
      name: 'migrateLocker',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'base',
          isMut: false,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'newBase',
          isMut: false,
          isSigner: true
        },
        {
          name: 'newLocker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'governor',
          isMut: false,
          isSigner: false
        },
        {
          name: 'smartWallet',
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
          name: 'proposalActivationMinVotes',
          type: 'u64'
        }
      ]
    },
    {
      name: 'migrateEscrow',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'lockerAdmin',
          isMut: false,
          isSigner: true
        },
        {
          name: 'oldLocker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'newLocker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'oldEscrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'newEscrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'oldLockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'newLockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
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
      name: 'migrateWhitelist',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'oldLocker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'newLocker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'lockerAdmin',
          isMut: false,
          isSigner: true
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'newWhitelistEntry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'initLockerV2',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'base',
          isMut: false,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'governor',
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
          name: 'params',
          type: {
            defined: 'LockerParamsV2'
          }
        }
      ]
    },
    {
      name: 'initEscrowV2',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'setLockerParamsV2',
      accounts: [
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'governor',
          isMut: false,
          isSigner: false
        },
        {
          name: 'smartWallet',
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'LockerParamsV2'
          }
        }
      ]
    },
    {
      name: 'approveProgramLockPrivilegeV2',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'governor',
          isMut: false,
          isSigner: false
        },
        {
          name: 'smartWallet',
          isMut: false,
          isSigner: true
        },
        {
          name: 'executableId',
          isMut: false,
          isSigner: false
        },
        {
          name: 'whitelistedOwner',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'revokeProgramLockPrivilegeV2',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'governor',
          isMut: false,
          isSigner: false
        },
        {
          name: 'smartWallet',
          isMut: false,
          isSigner: true
        }
      ],
      args: []
    },
    {
      name: 'lockV2',
      accounts: [
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'sourceTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'sourceTokensAuthority',
          isMut: false,
          isSigner: true
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'amount',
          type: 'u64'
        },
        {
          name: 'duration',
          type: 'i64'
        }
      ]
    },
    {
      name: 'exitV2',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'lockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'destinationTokens',
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
      name: 'activateProposal',
      accounts: [
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'governor',
          isMut: false,
          isSigner: false
        },
        {
          name: 'proposal',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: false,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'governProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'castVote',
      accounts: [
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: false,
          isSigner: false
        },
        {
          name: 'voteDelegate',
          isMut: false,
          isSigner: true
        },
        {
          name: 'proposal',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vote',
          isMut: true,
          isSigner: false
        },
        {
          name: 'governor',
          isMut: false,
          isSigner: false
        },
        {
          name: 'governProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'side',
          type: 'u8'
        }
      ]
    }
  ],
  accounts: [
    {
      name: 'escrow',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'locker',
            type: 'publicKey'
          },
          {
            name: 'owner',
            type: 'publicKey'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'tokens',
            type: 'publicKey'
          },
          {
            name: 'amount',
            type: 'u64'
          },
          {
            name: 'escrowStartedAt',
            type: 'i64'
          },
          {
            name: 'escrowEndsAt',
            type: 'i64'
          }
        ]
      }
    },
    {
      name: 'escrowV2',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'locker',
            type: 'publicKey'
          },
          {
            name: 'owner',
            type: 'publicKey'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'tokens',
            type: 'publicKey'
          },
          {
            name: 'amount',
            type: 'u64'
          },
          {
            name: 'escrowStartedAt',
            type: 'i64'
          },
          {
            name: 'escrowEndsAt',
            type: 'i64'
          },
          {
            name: 'voteDelegate',
            type: 'publicKey'
          }
        ]
      }
    },
    {
      name: 'locker',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'base',
            type: 'publicKey'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'tokenMint',
            type: 'publicKey'
          },
          {
            name: 'lockedSupply',
            type: 'u64'
          },
          {
            name: 'admin',
            type: 'publicKey'
          },
          {
            name: 'params',
            type: {
              defined: 'LockerParams'
            }
          }
        ]
      }
    },
    {
      name: 'lockerV2',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'base',
            type: 'publicKey'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'tokenMint',
            type: 'publicKey'
          },
          {
            name: 'lockedSupply',
            type: 'u64'
          },
          {
            name: 'governor',
            type: 'publicKey'
          },
          {
            name: 'params',
            type: {
              defined: 'LockerParamsV2'
            }
          }
        ]
      }
    },
    {
      name: 'whitelistEntry',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'locker',
            type: 'publicKey'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'programId',
            type: 'publicKey'
          },
          {
            name: 'owner',
            type: 'publicKey'
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'LockerParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'minStakeDuration',
            type: 'u64'
          },
          {
            name: 'maxStakeDuration',
            type: 'u64'
          },
          {
            name: 'whitelistEnabled',
            type: 'bool'
          },
          {
            name: 'multiplier',
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'LockerParamsV2',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'minStakeDuration',
            type: 'u64'
          },
          {
            name: 'maxStakeDuration',
            type: 'u64'
          },
          {
            name: 'proposalActivationMinVotes',
            type: 'u64'
          },
          {
            name: 'whitelistEnabled',
            type: 'bool'
          },
          {
            name: 'multiplier',
            type: 'u8'
          }
        ]
      }
    }
  ],
  events: [
    {
      name: 'ExitEscrowEvent',
      fields: [
        {
          name: 'escrowOwner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false
        },
        {
          name: 'lockedSupply',
          type: 'u64',
          index: false
        },
        {
          name: 'releasedAmount',
          type: 'u64',
          index: false
        }
      ]
    },
    {
      name: 'InitEscrowEvent',
      fields: [
        {
          name: 'escrow',
          type: 'publicKey',
          index: false
        },
        {
          name: 'escrowOwner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false
        }
      ]
    },
    {
      name: 'InitLockerEvent',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'tokenMint',
          type: 'publicKey',
          index: false
        },
        {
          name: 'admin',
          type: 'publicKey',
          index: false
        },
        {
          name: 'params',
          type: {
            defined: 'LockerParams'
          },
          index: false
        }
      ]
    },
    {
      name: 'InitLockerV2Event',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'tokenMint',
          type: 'publicKey',
          index: false
        },
        {
          name: 'governor',
          type: 'publicKey',
          index: false
        },
        {
          name: 'params',
          type: {
            defined: 'LockerParamsV2'
          },
          index: false
        }
      ]
    },
    {
      name: 'LockEvent',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'escrowOwner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'tokenMint',
          type: 'publicKey',
          index: false
        },
        {
          name: 'amount',
          type: 'u64',
          index: false
        },
        {
          name: 'lockerSupply',
          type: 'u64',
          index: false
        },
        {
          name: 'duration',
          type: 'i64',
          index: false
        },
        {
          name: 'prevEscrowEndsAt',
          type: 'i64',
          index: false
        },
        {
          name: 'nextEscrowEndsAt',
          type: 'i64',
          index: false
        },
        {
          name: 'nextEscrowStartedAt',
          type: 'i64',
          index: false
        }
      ]
    },
    {
      name: 'ApproveLockPrivilegeEvent',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'programId',
          type: 'publicKey',
          index: false
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false
        }
      ]
    },
    {
      name: 'RevokeLockPrivilegeEvent',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'programId',
          type: 'publicKey',
          index: false
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false
        }
      ]
    }
  ],
  errors: [
    {
      code: 6000,
      name: 'EscrowNotEnded',
      msg: 'Escrow has not ended.'
    },
    {
      code: 6001,
      name: 'InvalidLockerAdmin',
      msg: 'Invalid locker admin'
    },
    {
      code: 6002,
      name: 'LockupDurationTooShort',
      msg: 'Lockup duration must at least be the min stake duration.'
    },
    {
      code: 6003,
      name: 'LockupDurationTooLong',
      msg: 'Lockup duration must at most be the max stake duration.'
    },
    {
      code: 6004,
      name: 'RefreshCannotShorten',
      msg: 'A voting escrow refresh cannot shorten the escrow time remaining.'
    },
    {
      code: 6005,
      name: 'MustProvideWhitelist',
      msg: 'Program whitelist enabled; please provide whitelist entry and instructions sysvar'
    },
    {
      code: 6006,
      name: 'ProgramNotWhitelisted',
      msg: 'CPI caller not whitelisted to invoke lock instruction.'
    },
    {
      code: 6007,
      name: 'EscrowOwnerNotWhitelisted',
      msg: 'CPI caller not whitelisted for escrow owner to invoke lock instruction.'
    },
    {
      code: 6008,
      name: 'EscrowExpired',
      msg: 'Escrow was already expired.'
    },
    {
      code: 6009,
      name: 'LockedSupplyMismatch',
      msg: 'Token lock failed, locked supply mismatches the exact amount.'
    },
    {
      code: 6010,
      name: 'EscrowInUse',
      msg: 'The escrow has already locked.'
    },
    {
      code: 6011,
      name: 'EscrowNoBalance',
      msg: "The escrow doesn't have balance"
    },
    {
      code: 6012,
      name: 'ProposalMustBeActive',
      msg: 'The proposal must be active'
    },
    {
      code: 6013,
      name: 'GovernorMismatch',
      msg: 'Governor mismatch'
    },
    {
      code: 6014,
      name: 'ProgramIdMustBeExecutable',
      msg: 'Program id must be executable'
    },
    {
      code: 6015,
      name: 'InsufficientVotingPower',
      msg: 'Insufficient voting power to activate a proposal'
    }
  ]
};

export const LockedVoterErrors = generateErrorMap(IDL);
