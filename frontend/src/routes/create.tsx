import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/pinky/PageShell";
import { CategoryCard } from "@/components/pinky/CategoryCard";
import { PenaltyCard } from "@/components/pinky/PenaltyCard";
import { VoiceCoachCard } from "@/components/pinky/VoiceCoachCard";
import { SuccessModal } from "@/components/pinky/SuccessModal";
import { categories } from "@/lib/mock";
import { X } from "lucide-react";
import { createPact as createPactTx } from "@/lib/pinkyProgram";

export const Route = createFileRoute("/create")({
  component: CreatePact,
});

const durations = ["7 days", "14 days", "30 days", "Custom"];
const penalties = [
  { emoji: "🤝", title: "Split between witnesses", desc: "Reward those who held you accountable.", key: "splitWitnesses" },
  { emoji: "💝", title: "Donate to public goods", desc: "Turn your slip into someone's win.", key: "donate" },
  { emoji: "🔥", title: "Burn it", desc: "Send it to the void. No mercy.", key: "burn" },
  { emoji: "🏆", title: "Prize pool", desc: "Add to the community winners pot.", key: "prizePool" },
];

const durationDays: Record<string, number> = {
  "7 days": 7,
  "14 days": 14,
  "30 days": 30,
  Custom: 7,
};

function CreatePact() {
  const wallet = useWallet();
  const [category, setCategory] = useState("Fitness");
  const [duration, setDuration] = useState("7 days");
  const [penalty, setPenalty] = useState(0);
  const [witnesses, setWitnesses] = useState<string[]>(["7Yg8...Qp29"]);
  const [witnessInput, setWitnessInput] = useState("");
  const [open, setOpen] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [stake, setStake] = useState("0.5");
  const [loading, setLoading] = useState(false);
  const [txSig, setTxSig] = useState<string | undefined>(undefined);
  const [demoMode, setDemoMode] = useState(false);

  const addWitness = () => {
    if (witnessInput.trim()) {
      setWitnesses([...witnesses, witnessInput.trim()]);
      setWitnessInput("");
    }
  };

  const handleLockIn = async () => {
    const persona =
      typeof window !== "undefined" ? sessionStorage.getItem("persona") : null;
    const isDemo = persona === "anele" || persona === "khatisani" || persona === "jared";

    if (!habitName.trim()) {
      toast.error("Habit name is required");
      return;
    }
    const stakeSolEarly = parseFloat(stake);
    if (!stakeSolEarly || stakeSolEarly < 0.01) {
      toast.error("Minimum stake is 0.01 SOL");
      return;
    }
    const daysEarly = durationDays[duration] ?? 7;
    const deadlineEarly = Math.floor(Date.now() / 1000) + daysEarly * 24 * 60 * 60;
    const penaltyKeyEarly = penalties[penalty].key;

    if (isDemo) {
      const demoTx = "demo...pact";
      const storageKey = `pinky_pacts_${persona}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      existing.push({
        pactId: String(Date.now()),
        pactPda: "demoPda",
        tx: demoTx,
        habitName: habitName.trim(),
        category,
        deadline: deadlineEarly,
        stakeAmount: stakeSolEarly,
        penaltyDestination: penaltyKeyEarly,
        status: "Active",
        createdAt: Date.now(),
        demo: true,
      });
      localStorage.setItem(storageKey, JSON.stringify(existing));
      setTxSig(demoTx);
      setDemoMode(true);
      setOpen(true);
      toast.success("Demo pact created 🤙");
      return;
    }

    if (!wallet.connected || !wallet.publicKey) {
      toast.error("Connect your Phantom wallet first");
      return;
    }
    const stakeSol = stakeSolEarly;
    const deadlineTimestamp = deadlineEarly;
    const penaltyKey = penaltyKeyEarly;

    setLoading(true);
    try {
      const result = await createPactTx({
        wallet,
        habitName: habitName.trim(),
        category,
        deadlineTimestamp,
        penaltyDestination: penaltyKey,
        stakeSol,
      });

      const existing = JSON.parse(localStorage.getItem("pinky_pacts") || "[]");
      existing.push({
        pactId: result.pactId,
        pactPda: result.pactPda,
        tx: result.tx,
        habitName: habitName.trim(),
        category,
        deadline: deadlineTimestamp,
        stakeAmount: stakeSol,
        penaltyDestination: penaltyKey,
        status: "Active",
        createdAt: Date.now(),
      });
      localStorage.setItem("pinky_pacts", JSON.stringify(existing));

      setTxSig(result.tx);
      setDemoMode(false);
      setOpen(true);
      toast.success("Pact locked on-chain 🤙");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create pact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Create a Pact 🤙</h1>
          <p className="mt-3 text-muted-foreground">
            Lock in your commitment. Your word, on-chain.
          </p>
        </div>

        <div className="mt-10 space-y-8 rounded-3xl glass p-6 md:p-10 shadow-soft">
          <div>
            <Label className="text-base font-semibold">Habit name</Label>
            <Input
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g. Run 5km every day"
              className="mt-2 h-12 rounded-xl border-border bg-surface"
            />
          </div>

          <div>
            <Label className="text-base font-semibold">Category</Label>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map((c) => (
                <CategoryCard
                  key={c.label}
                  emoji={c.emoji}
                  label={c.label}
                  selected={category === c.label}
                  onClick={() => setCategory(c.label)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Duration</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                    duration === d
                      ? "border-primary bg-primary text-white shadow-pink-glow"
                      : "border-border bg-surface hover:border-primary/40"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Stake amount</Label>
            <div className="relative mt-2">
              <Input
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="0.5"
                className="h-12 rounded-xl border-border bg-surface pr-16"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-primary">
                SOL
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">Minimum 0.01 devnet SOL</p>
          </div>

          <div>
            <Label className="text-base font-semibold">If you break your word…</Label>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {penalties.map((p, i) => (
                <PenaltyCard
                  key={p.title}
                  emoji={p.emoji}
                  title={p.title}
                  desc={p.desc}
                  selected={penalty === i}
                  onClick={() => setPenalty(i)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Witnesses</Label>
            <div className="mt-2 flex gap-2">
              <Input
                value={witnessInput}
                onChange={(e) => setWitnessInput(e.target.value)}
                placeholder="Paste witness wallet address"
                className="h-12 rounded-xl border-border bg-surface"
              />
              <Button onClick={addWitness} className="h-12 rounded-xl bg-gradient-pink-lavender text-white">
                Add Witness
              </Button>
            </div>
            {witnesses.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {witnesses.map((w, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs"
                  >
                    {w}
                    <button onClick={() => setWitnesses(witnesses.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-base font-semibold">Voice coach</Label>
            <div className="mt-3">
              <VoiceCoachCard
                title="Pax will coach you daily."
                message="I'll be in your ear every day. Let's keep this word."
              />
            </div>
          </div>

          <Button
            onClick={handleLockIn}
            disabled={loading}
            className="w-full rounded-full bg-gradient-pink-lavender py-7 text-lg font-semibold text-white shadow-pink-glow disabled:opacity-80"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Locking pact on Solana...
              </span>
            ) : (
              "Lock In Pact 🤙"
            )}
          </Button>
        </div>
      </div>
      <SuccessModal
        open={open}
        onClose={() => setOpen(false)}
        tx={txSig}
        title={demoMode ? "Demo Pact Created 🤙" : undefined}
        message={
          demoMode
            ? "This persona pact was created in demo mode. Connect Phantom to create a real devnet pact."
            : undefined
        }
        hideExplorer={demoMode}
      />
    </PageShell>
  );
}
