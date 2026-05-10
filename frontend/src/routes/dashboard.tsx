import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/pinky/PageShell";
import { PactCard } from "@/components/pinky/PactCard";
import { WitnessCard } from "@/components/pinky/WitnessCard";
import { PaxChat } from "@/components/pinky/PaxChat";
import { mockPacts, mockWitnessing } from "@/lib/mock";
import { truncateAddress } from "@/lib/pinkyProgram";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type PersonaId = "anele" | "khatisani" | "jared";

const personaData: Record<PersonaId, {
  name: string;
  wallet: string;
  balance: number;
  stats: { active: number; witnessing: number; broken: number };
  pacts: import("@/components/pinky/PactCard").Pact[];
  witnessing: { id: string; title: string; creator: string; status: string }[];
}> = {
  anele: {
    name: "Anele",
    wallet: "AN3l...e24J",
    balance: 3.2,
    stats: { active: 1, witnessing: 2, broken: 0 },
    pacts: [{
      id: "anele-1", emoji: "🏋️", title: "Hit the gym 4x a week", category: "Fitness",
      stake: 0.3, witnesses: 3, daysLeft: 8, progress: 57, status: "Active",
    }],
    witnessing: [
      { id: "aw1", title: "Khatisani's Study Pact", creator: "Khatisani", status: "Vote pending" },
      { id: "aw2", title: "Jared's Run Pact", creator: "Jared", status: "Vote pending" },
    ],
  },
  khatisani: {
    name: "Khatisani",
    wallet: "KH4t...s19A",
    balance: 5.8,
    stats: { active: 2, witnessing: 1, broken: 0 },
    pacts: [
      { id: "kha-1", emoji: "📚", title: "Study AWS for 2 hours daily", category: "Education",
        stake: 0.5, witnesses: 2, daysLeft: 22, progress: 27, status: "Active" },
      { id: "kha-2", emoji: "✨", title: "Build portfolio project", category: "Personal Growth",
        stake: 0.2, witnesses: 3, daysLeft: 10, progress: 48, status: "Active" },
    ],
    witnessing: [
      { id: "kw1", title: "Anele's Gym Pact", creator: "Anele", status: "Vote pending" },
    ],
  },
  jared: {
    name: "Jared",
    wallet: "JR7d...c26T",
    balance: 7.1,
    stats: { active: 1, witnessing: 1, broken: 0 },
    pacts: [{
      id: "jared-1", emoji: "🏃", title: "Run 5km daily", category: "Fitness",
      stake: 1.0, witnesses: 3, daysLeft: 4, progress: 42, status: "Active",
    }],
    witnessing: [
      { id: "jw1", title: "Anele's Gym Pact", creator: "Anele", status: "Vote pending" },
    ],
  },
};

function Dashboard() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [savedPacts, setSavedPacts] = useState<any[]>([]);
  const [persona, setPersona] = useState<PersonaId | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = sessionStorage.getItem("persona") as PersonaId | null;
    if (p && personaData[p]) setPersona(p);
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("pinky_pacts") || "[]");
      setSavedPacts(stored);
    } catch {
      setSavedPacts([]);
    }
  }, []);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey);
        if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (e) {
        console.error("Balance fetch failed", e);
      }
    };
    fetchBalance();
    const id = setInterval(fetchBalance, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [publicKey, connection]);

  const demo = persona ? personaData[persona] : null;

  const greetingName = demo ? demo.name : "Thobeka";
  const addressDisplay = demo
    ? demo.wallet
    : publicKey
    ? truncateAddress(publicKey.toBase58())
    : "Not connected";
  const balanceDisplay = demo
    ? demo.balance.toFixed(2)
    : balance !== null
    ? balance.toFixed(2)
    : "—";

  const activePact = demo
    ? {
        habitName: demo.pacts[0].title,
        category: demo.pacts[0].category,
        stakeAmount: demo.pacts[0].stake,
        daysLeft: demo.pacts[0].daysLeft,
        witnesses: demo.pacts[0].witnesses,
        progress: demo.pacts[0].progress,
      }
    : savedPacts[0]
    ? {
        habitName: savedPacts[0].habitName,
        category: savedPacts[0].category,
        stakeAmount: savedPacts[0].stakeAmount,
        daysLeft: Math.max(
          0,
          Math.ceil(
            (savedPacts[0].deadline * 1000 - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        ),
        witnesses: 0,
        progress: 0,
      }
    : {
        habitName: mockPacts[0].title,
        category: mockPacts[0].category,
        stakeAmount: mockPacts[0].stake,
        daysLeft: mockPacts[0].daysLeft,
        witnesses: mockPacts[0].witnesses,
        progress: mockPacts[0].progress,
      };

  const exitPersona = () => {
    sessionStorage.removeItem("persona");
    if (typeof window !== "undefined") window.location.reload();
  };

  const stats = demo ? demo.stats : { active: 2, witnessing: 1, broken: 0 };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-4xl font-bold md:text-5xl">{greetingName} 👋</h1>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-muted-foreground">Your word. On-chain.</p>
              {demo && (
                <button
                  onClick={exitPersona}
                  className="text-xs text-primary underline-offset-2 hover:underline"
                >
                  Exit demo persona
                </button>
              )}
            </div>
          </div>
          <Link to="/create">
            <Button
              size="lg"
              className="rounded-full bg-gradient-pink-lavender px-6 py-6 text-white shadow-pink-glow"
            >
              <Plus className="mr-2 h-5 w-5" /> New Pact
            </Button>
          </Link>
        </div>

        {/* Wallet card */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl glass p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-pink-lavender text-white">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wallet</p>
                  <p className="font-mono font-semibold">{addressDisplay}</p>
                </div>
              </div>
              <span className="rounded-full bg-cyan/15 px-3 py-1 text-xs font-medium text-cyan">
                {demo ? "Demo Persona · Devnet" : "Devnet"}
              </span>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-3xl font-bold">
                  {balanceDisplay}{" "}
                  <span className="text-base text-muted-foreground">devnet SOL</span>
                </p>
              </div>
              {!demo && !connected && (
                <div className="ml-4">
                  <WalletMultiButton />
                </div>
              )}
            </div>
            {!demo && !connected && (
              <p className="mt-3 text-xs text-muted-foreground">
                Connect your Phantom wallet to view your pacts
              </p>
            )}
          </div>
          <div className="rounded-3xl bg-gradient-dark-premium p-6 text-dark-fg">
            <p className="text-xs uppercase tracking-wider text-rose">Your stats</p>
            <h3 className="mt-2 text-xl font-bold">Your word has weight.</h3>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold text-gradient-pink">{stats.active}</div>
                <div className="text-xs text-dark-fg/70">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gradient-pink">{stats.witnessing}</div>
                <div className="text-xs text-dark-fg/70">Witnessing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gradient-pink">{stats.broken}</div>
                <div className="text-xs text-dark-fg/70">Broken</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active pacts */}
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold">My Active Pacts</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {demo
              ? demo.pacts.map((p) => <PactCard key={p.id} pact={p} />)
              : (<>
            {savedPacts.map((p) => (
              <PactCard
                key={p.pactId}
                pact={{
                  id: p.pactId,
                  emoji: "🤙",
                  title: p.habitName,
                  category: p.category,
                  stake: p.stakeAmount,
                  witnesses: 0,
                  daysLeft: Math.max(
                    0,
                    Math.ceil((p.deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
                  ),
                  progress: 0,
                  status: "Active",
                }}
              />
            ))}
            {mockPacts.map((p) => (
              <PactCard key={p.id} pact={p} />
            ))}
              </>)}
          </div>
        </section>

        {/* Witnessing */}
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold">I Am Witnessing</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {(demo ? demo.witnessing : mockWitnessing).map((w) => (
              <WitnessCard key={w.id} {...w} />
            ))}
          </div>
        </section>
      </div>
      <PaxChat pactContext={activePact} />
    </PageShell>
  );
}
