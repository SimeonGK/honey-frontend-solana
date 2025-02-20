import { generateErrorMap } from '@saberhq/anchor-contrib';

export type VeHoney = {
  version: '2.0.0';
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
          name: 'wlTokenMint';
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
      name: 'initTreasury';
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
          name: 'treasury';
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
          name: 'smartWallet';
          isMut: false;
          isSigner: true;
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
      name: 'setLockerParams';
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
            defined: 'LockerParams';
          };
        }
      ];
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
      name: 'addProof';
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
          name: 'proof';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'address';
          isMut: false;
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
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'proofType';
          type: 'u8';
        }
      ];
    },
    {
      name: 'removeProof';
      accounts: [
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'proof';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fundsReceiver';
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
      name: 'setWlMintAuthority';
      accounts: [
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wlTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'currentAuthority';
          isMut: false;
          isSigner: true;
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
      name: 'reclaimWlMintAuthority';
      accounts: [
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wlTokenMint';
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
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'mintAuthority';
          type: 'publicKey';
        }
      ];
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
      name: 'lockNft';
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
          name: 'receipt';
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
          name: 'lockerTreasury';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftSource';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftSourceAuthority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'wlTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wlDestination';
          isMut: true;
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
      args: [
        {
          name: 'duration';
          type: 'i64';
        }
      ];
    },
    {
      name: 'claim';
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
          name: 'nftReceipt';
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
      name: 'unlock';
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
      name: 'closeReceipt';
      accounts: [
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
          name: 'nftReceipt';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'fundsReceiver';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'closeEscrow';
      accounts: [
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
          isSigner: true;
        },
        {
          name: 'lockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fundsReceiver';
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
    },
    {
      name: 'setVoteDelegate';
      accounts: [
        {
          name: 'escrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'newDelegate';
          type: 'publicKey';
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
          },
          {
            name: 'receiptCount';
            type: 'u64';
          },
          {
            name: 'amountToReceipt';
            type: 'u64';
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
            name: 'wlTokenMint';
            type: 'publicKey';
          },
          {
            name: 'governor';
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
      name: 'nftReceipt';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'receiptId';
            type: 'u64';
          },
          {
            name: 'locker';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'vestStartedAt';
            type: 'i64';
          },
          {
            name: 'vestEndsAt';
            type: 'i64';
          },
          {
            name: 'claimedAmount';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'proof';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'locker';
            type: 'publicKey';
          },
          {
            name: 'proofType';
            type: 'u8';
          },
          {
            name: 'proofAddress';
            type: 'publicKey';
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
          },
          {
            name: 'proposalActivationMinVotes';
            type: 'u64';
          },
          {
            name: 'nftStakeDurationUnit';
            type: 'i64';
          },
          {
            name: 'nftStakeBaseReward';
            type: 'u64';
          },
          {
            name: 'nftStakeDurationCount';
            type: 'u8';
          },
          {
            name: 'nftRewardHalvingStartsAt';
            type: 'u8';
          }
        ];
      };
    }
  ];
  events: [
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
          name: 'governor';
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
      name: 'SetVoteDelegateEvent';
      fields: [
        {
          name: 'escrowOwner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'oldDelegate';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'newDelegate';
          type: 'publicKey';
          index: false;
        }
      ];
    },
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
      code: 7000;
      name: 'InvalidLocker';
    },
    {
      code: 7001;
      name: 'InvalidLockerMint';
    },
    {
      code: 7002;
      name: 'InvalidLockerWLMint';
    },
    {
      code: 7003;
      name: 'InvalidAccountOwner';
    },
    {
      code: 7004;
      name: 'InvalidTokenOwner';
    },
    {
      code: 7005;
      name: 'InvalidToken';
    },
    {
      code: 7006;
      name: 'InvalidAssociatedTokenAccount';
    },
    {
      code: 7007;
      name: 'InvalidRemainingAccounts';
    },
    {
      code: 7008;
      name: 'InvalidProofType';
    },
    {
      code: 7009;
      name: 'InvalidProof';
    },
    {
      code: 7010;
      name: 'InvalidGovernorParams';
    },
    {
      code: 7011;
      name: 'InvalidVoteDelegate';
    },
    {
      code: 7012;
      name: 'InvalidProgramId';
    },
    {
      code: 7100;
      name: 'EscrowNotEnded';
    },
    {
      code: 7101;
      name: 'EscrowExpired';
    },
    {
      code: 7102;
      name: 'EscrowInUse';
    },
    {
      code: 7103;
      name: 'EscrowNoBalance';
    },
    {
      code: 7104;
      name: 'LockupDurationTooShort';
    },
    {
      code: 7105;
      name: 'LockupDurationTooLong';
    },
    {
      code: 7106;
      name: 'RefreshCannotShorten';
    },
    {
      code: 7107;
      name: 'ClaimError';
    },
    {
      code: 7108;
      name: 'CloseNonZeroReceipt';
    },
    {
      code: 7109;
      name: 'ReceiptCountError';
    },
    {
      code: 7110;
      name: 'ReceiptNotEnded';
    },
    {
      code: 7200;
      name: 'MustProvideWhitelist';
    },
    {
      code: 7201;
      name: 'ProgramNotWhitelisted';
    },
    {
      code: 7202;
      name: 'EscrowOwnerNotWhitelisted';
    },
    {
      code: 7203;
      name: 'ProgramIdMustBeExecutable';
    },
    {
      code: 7204;
      name: 'NoProofProvided';
    },
    {
      code: 7300;
      name: 'GovernorMismatch';
    },
    {
      code: 7301;
      name: 'SmartWalletMismatch';
    },
    {
      code: 7302;
      name: 'ProposalMismatch';
    },
    {
      code: 7303;
      name: 'VoterMismatch';
    },
    {
      code: 7304;
      name: 'MetadataMismatch';
    },
    {
      code: 7305;
      name: 'ProposalMustBeActive';
    },
    {
      code: 7306;
      name: 'InsufficientVotingPower';
    },
    {
      code: 7307;
      name: 'LockedSupplyMismatch';
    },
    {
      code: 7400;
      name: 'InvariantViolated';
    }
  ];
};

export const IDL: VeHoney = {
  version: '2.0.0',
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
          name: 'wlTokenMint',
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
      name: 'initTreasury',
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
          name: 'treasury',
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
          name: 'smartWallet',
          isMut: false,
          isSigner: true
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
      name: 'setLockerParams',
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
            defined: 'LockerParams'
          }
        }
      ]
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
      name: 'addProof',
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
          name: 'proof',
          isMut: true,
          isSigner: false
        },
        {
          name: 'address',
          isMut: false,
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
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'proofType',
          type: 'u8'
        }
      ]
    },
    {
      name: 'removeProof',
      accounts: [
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'proof',
          isMut: true,
          isSigner: false
        },
        {
          name: 'fundsReceiver',
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
      name: 'setWlMintAuthority',
      accounts: [
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'wlTokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'currentAuthority',
          isMut: false,
          isSigner: true
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
      name: 'reclaimWlMintAuthority',
      accounts: [
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'wlTokenMint',
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
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'mintAuthority',
          type: 'publicKey'
        }
      ]
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
      name: 'lockNft',
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
          name: 'receipt',
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
          name: 'lockerTreasury',
          isMut: true,
          isSigner: false
        },
        {
          name: 'nftSource',
          isMut: true,
          isSigner: false
        },
        {
          name: 'nftSourceAuthority',
          isMut: false,
          isSigner: true
        },
        {
          name: 'wlTokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'wlDestination',
          isMut: true,
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
      args: [
        {
          name: 'duration',
          type: 'i64'
        }
      ]
    },
    {
      name: 'claim',
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
          name: 'nftReceipt',
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
      name: 'unlock',
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
      name: 'closeReceipt',
      accounts: [
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
          name: 'nftReceipt',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'fundsReceiver',
          isMut: true,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'closeEscrow',
      accounts: [
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
          isSigner: true
        },
        {
          name: 'lockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'fundsReceiver',
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
    },
    {
      name: 'setVoteDelegate',
      accounts: [
        {
          name: 'escrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: 'newDelegate',
          type: 'publicKey'
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
          },
          {
            name: 'receiptCount',
            type: 'u64'
          },
          {
            name: 'amountToReceipt',
            type: 'u64'
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
            name: 'wlTokenMint',
            type: 'publicKey'
          },
          {
            name: 'governor',
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
      name: 'nftReceipt',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'receiptId',
            type: 'u64'
          },
          {
            name: 'locker',
            type: 'publicKey'
          },
          {
            name: 'owner',
            type: 'publicKey'
          },
          {
            name: 'vestStartedAt',
            type: 'i64'
          },
          {
            name: 'vestEndsAt',
            type: 'i64'
          },
          {
            name: 'claimedAmount',
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'proof',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'locker',
            type: 'publicKey'
          },
          {
            name: 'proofType',
            type: 'u8'
          },
          {
            name: 'proofAddress',
            type: 'publicKey'
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
          },
          {
            name: 'proposalActivationMinVotes',
            type: 'u64'
          },
          {
            name: 'nftStakeDurationUnit',
            type: 'i64'
          },
          {
            name: 'nftStakeBaseReward',
            type: 'u64'
          },
          {
            name: 'nftStakeDurationCount',
            type: 'u8'
          },
          {
            name: 'nftRewardHalvingStartsAt',
            type: 'u8'
          }
        ]
      }
    }
  ],
  events: [
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
          name: 'governor',
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
      name: 'SetVoteDelegateEvent',
      fields: [
        {
          name: 'escrowOwner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'oldDelegate',
          type: 'publicKey',
          index: false
        },
        {
          name: 'newDelegate',
          type: 'publicKey',
          index: false
        }
      ]
    },
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
      code: 7000,
      name: 'InvalidLocker'
    },
    {
      code: 7001,
      name: 'InvalidLockerMint'
    },
    {
      code: 7002,
      name: 'InvalidLockerWLMint'
    },
    {
      code: 7003,
      name: 'InvalidAccountOwner'
    },
    {
      code: 7004,
      name: 'InvalidTokenOwner'
    },
    {
      code: 7005,
      name: 'InvalidToken'
    },
    {
      code: 7006,
      name: 'InvalidAssociatedTokenAccount'
    },
    {
      code: 7007,
      name: 'InvalidRemainingAccounts'
    },
    {
      code: 7008,
      name: 'InvalidProofType'
    },
    {
      code: 7009,
      name: 'InvalidProof'
    },
    {
      code: 7010,
      name: 'InvalidGovernorParams'
    },
    {
      code: 7011,
      name: 'InvalidVoteDelegate'
    },
    {
      code: 7012,
      name: 'InvalidProgramId'
    },
    {
      code: 7100,
      name: 'EscrowNotEnded'
    },
    {
      code: 7101,
      name: 'EscrowExpired'
    },
    {
      code: 7102,
      name: 'EscrowInUse'
    },
    {
      code: 7103,
      name: 'EscrowNoBalance'
    },
    {
      code: 7104,
      name: 'LockupDurationTooShort'
    },
    {
      code: 7105,
      name: 'LockupDurationTooLong'
    },
    {
      code: 7106,
      name: 'RefreshCannotShorten'
    },
    {
      code: 7107,
      name: 'ClaimError'
    },
    {
      code: 7108,
      name: 'CloseNonZeroReceipt'
    },
    {
      code: 7109,
      name: 'ReceiptCountError'
    },
    {
      code: 7110,
      name: 'ReceiptNotEnded'
    },
    {
      code: 7200,
      name: 'MustProvideWhitelist'
    },
    {
      code: 7201,
      name: 'ProgramNotWhitelisted'
    },
    {
      code: 7202,
      name: 'EscrowOwnerNotWhitelisted'
    },
    {
      code: 7203,
      name: 'ProgramIdMustBeExecutable'
    },
    {
      code: 7204,
      name: 'NoProofProvided'
    },
    {
      code: 7300,
      name: 'GovernorMismatch'
    },
    {
      code: 7301,
      name: 'SmartWalletMismatch'
    },
    {
      code: 7302,
      name: 'ProposalMismatch'
    },
    {
      code: 7303,
      name: 'VoterMismatch'
    },
    {
      code: 7304,
      name: 'MetadataMismatch'
    },
    {
      code: 7305,
      name: 'ProposalMustBeActive'
    },
    {
      code: 7306,
      name: 'InsufficientVotingPower'
    },
    {
      code: 7307,
      name: 'LockedSupplyMismatch'
    },
    {
      code: 7400,
      name: 'InvariantViolated'
    }
  ]
};

export const LockedVoterErrors = generateErrorMap(IDL);
