import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import { HONEY_P2P_PROGRAM } from 'constants/p2p';

// export const getProgram = (): Program<any> => {
//   const connection = new Connection(
//     process.env.RPC_ENDPOINT ?? clusterApiUrl('mainnet-beta'),
//     'processed'
//   );
//   const readOnlyWallet = new Wallet(Keypair.generate());
//   const provider = new AnchorProvider(
//     connection,
//     readOnlyWallet,
//     AnchorProvider.defaultOptions()
//   );
//   const idl = require('helpers/p2p/idl/honey_p2p.json');
//   const program = new Program(idl!, HONEY_P2P_PROGRAM, provider);
//   return program;
// };

export const getProgram = (
  connection: Connection,
  wallet: Wallet
): Program<any> => {
  // const readOnlyWallet = new Wallet(Keypair.generate());
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  const idl = require('helpers/p2p/idl/honey_p2p.json');
  const program = new Program(idl!, HONEY_P2P_PROGRAM, provider);
  return program;
};
