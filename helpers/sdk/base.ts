import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

export class ClientBase<T extends anchor.Idl> {
  provider!: anchor.Provider;
  program!: anchor.Program<T>;

  constructor(
    private connection: Connection,
    public wallet: anchor.Wallet,
    idl: any,
    programId: PublicKey
  ) {
    this.connection = connection;
    this.wallet = wallet;
    this.setProvider();
    this.setProgram(idl, programId);
  }

  setProvider() {
    this.provider = new anchor.AnchorProvider(
      this.connection,
      this.wallet,
      anchor.AnchorProvider.defaultOptions()
    );
    anchor.setProvider(this.provider);
  }

  setProgram(idl: any, programId: PublicKey) {
    if (!idl || !programId) {
      throw new Error("Program can't be constructed.");
    }
    this.program = new anchor.Program<T>(
      idl,
      new PublicKey(programId),
      this.provider
    );
  }

  async getAccountInfo(address: PublicKey) {
    return this.connection.getAccountInfo(address);
  }

  async sendAndConfirm(tx: Transaction, signers?: []) {
    const sig = await this.provider.sendAndConfirm?.(tx, signers);
    if (sig === undefined) {
      throw new Error('provider error!');
    }
    return sig;
  }

  async getOrCreateATA(mint: PublicKey) {
    const ata = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      this.wallet.publicKey
    );
    const ataAcc = await this.getAccountInfo(ata);
    if (ataAcc) {
      return { ata, instruction: null };
    } else {
      return {
        ata,
        instruction: Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          ata,
          this.wallet.publicKey,
          this.wallet.publicKey
        )
      };
    }
  }
}
