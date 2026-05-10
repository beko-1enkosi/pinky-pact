import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Pinky } from "../target/types/pinky";

describe("pinky", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = anchor.workspace.pinky as Program<Pinky>;

  it("creates a pact and locks SOL into escrow", async () => {
    const creator = provider.wallet;

    // Unique pact id so we do not reuse the same PDA twice.
    const pactId = new anchor.BN(Date.now());

    // Same seeds used in the Rust contract:
    // b"pact", creator wallet, pact_id as little-endian bytes.
    const [pactPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pact"),
        creator.publicKey.toBuffer(),
        pactId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const deadline = new anchor.BN(nowInSeconds + 60 * 60); // 1 hour from now

    const stakeLamports = new anchor.BN(10_000_000); // 0.01 SOL

    const tx = await program.methods
      .createPact(
        pactId,
        "Run 5km every day",
        "Fitness",
        deadline,
        { splitWitnesses: {} },
        stakeLamports
      )
      .accounts({
        pact: pactPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Create pact transaction:", tx);
    console.log("Pact PDA:", pactPda.toBase58());

    const pactAccount = await program.account.pact.fetch(pactPda);

    console.log("Habit:", pactAccount.habitName);
    console.log("Category:", pactAccount.category);
    console.log("Stake:", pactAccount.stakeAmount.toString());

    if (pactAccount.habitName !== "Run 5km every day") {
      throw new Error("Habit name was not saved correctly");
    }

    if (pactAccount.category !== "Fitness") {
      throw new Error("Category was not saved correctly");
    }

    if (!pactAccount.stakeAmount.eq(stakeLamports)) {
      throw new Error("Stake amount was not saved correctly");
    }
  });
});