import { Buffer } from "buffer";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import idl from "../idl/pinky.json";

export const PROGRAM_ID = new PublicKey(
  "3UoZ5ixtrtHVPRbsJfb5a9ZPPnXmYjCjcWqDmS3Z33xv",
);

export const CONNECTION = new Connection(
  "https://api.devnet.solana.com",
  "confirmed",
);

export function getProgram(wallet: any) {
  if (!wallet?.publicKey || !wallet?.signTransaction) {
    throw new Error("Wallet not connected");
  }

  const provider = new AnchorProvider(CONNECTION, wallet, {
    commitment: "confirmed",
  });

  return new Program(idl as any, provider);
}

export async function createPact({
  wallet,
  habitName,
  category,
  deadlineTimestamp,
  penaltyDestination,
  stakeSol,
}: {
  wallet: any;
  habitName: string;
  category: string;
  deadlineTimestamp: number;
  penaltyDestination: string;
  stakeSol: number;
}) {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }
  if (!habitName || habitName.trim().length === 0) {
    throw new Error("Habit name is required");
  }
  if (!category || category.trim().length === 0) {
    throw new Error("Category is required");
  }
  if (!stakeSol || stakeSol < 0.01) {
    throw new Error("Minimum stake is 0.01 SOL");
  }

  const program = getProgram(wallet);
  const pactId = new BN(Date.now());
  const stakeLamports = new BN(Math.floor(stakeSol * LAMPORTS_PER_SOL));

  const [pactPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("pact"),
      wallet.publicKey.toBuffer(),
      pactId.toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID,
  );

  const penaltyMap: Record<string, object> = {
    splitWitnesses: { splitWitnesses: {} },
    donate: { donate: {} },
    burn: { burn: {} },
    prizePool: { prizePool: {} },
  };

  const tx = await (program.methods as any)
    .createPact(
      pactId,
      habitName,
      category,
      new BN(deadlineTimestamp),
      penaltyMap[penaltyDestination] ?? { splitWitnesses: {} },
      stakeLamports,
    )
    .accounts({
      pact: pactPda,
      creator: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return {
    tx,
    pactPda: pactPda.toBase58(),
    pactId: pactId.toString(),
  };
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function getExplorerTxUrl(tx: string) {
  return `https://explorer.solana.com/tx/${tx}?cluster=devnet`;
}

export function getExplorerAddressUrl(address: string) {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`;
}