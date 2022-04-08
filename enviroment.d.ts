declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ===== Input type definition for new enviroment variables =====
      // ===== from .env here =====================
      NEXT_PUBLIC_RPC_NODE: string;
      NEXT_PUBLIC_STAKE_POOL_ADDRESS: string;
      NEXT_PUBLIC_LOCKER_ADDRESS: string;
      NEXT_PUBLIC_HONEY_MINT: string;
      NEXT_PUBLIC_PHONEY_MINT: string;
      NEXT_PUBLIC_WHITELIST_ENTRY: string;
      NEXT_PUBLIC_STAKE_PROGRAM_ID: string;
      NEXT_PUBLIC_VE_HONEY_PROGRAM_ID: string;
      // ==========================================
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}

export {};
