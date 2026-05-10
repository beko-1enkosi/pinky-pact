import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/pinky/PageShell";
import { ProgressRing } from "@/components/pinky/ProgressRing";
import { VoiceCoachCard } from "@/components/pinky/VoiceCoachCard";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/pact/$id")({
  component: PactDetail,
});

const initialTimeline = [
  { day: "Day 1", done: true, note: "Locked in. 5km done." },
  { day: "Day 2", done: true, note: "Rainy. Still went." },
  { day: "Day 3", done: true, note: "Personal best!" },
  { day: "Day 4", done: false, note: "Today" },
  { day: "Day 5", done: false, note: "" },
  { day: "Day 6", done: false, note: "" },
  { day: "Day 7", done: false, note: "" },
];

const witnesses = [
  { name: "Mpho N.", initials: "MN", status: "Accepted" },
  { name: "Ayanda K.", initials: "AK", status: "Accepted" },
  { name: "Jordan P.", initials: "JP", status: "Pending" },
];

function PactDetail() {
  const [timeline, setTimeline] = useState(initialTimeline);
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCheckIn = () => {
    if (checkedIn) return;
    setCheckedIn(true);
    setTimeline((prev) =>
      prev.map((t, i) => (i === 3 ? { ...t, done: true, note: "Checked in today." } : t)),
    );
    toast.success("Check-in recorded 🤙");
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="rounded-3xl glass p-8 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">🏃</span>
                <div>
                  <p className="text-sm text-muted-foreground">Fitness</p>
                  <h1 className="text-3xl font-bold md:text-4xl">Run 5km daily</h1>
                </div>
                <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Active
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Time left</p>
              <p className="font-mono text-3xl font-bold text-gradient-pink">3d : 14h : 22m</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="text-xs text-muted-foreground">Stake</p>
              <p className="text-lg font-bold">0.5 devnet SOL</p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="text-xs text-muted-foreground">Witnesses</p>
              <p className="text-lg font-bold">3 invited</p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="text-xs text-muted-foreground">Penalty</p>
              <p className="text-lg font-bold">Split 🤝</p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="text-xs text-muted-foreground">Network</p>
              <p className="text-lg font-bold">Devnet</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Left: progress */}
          <div className="space-y-6">
            <div className="rounded-3xl glass p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">You're on track.</h2>
                  <p className="text-sm text-muted-foreground">3 of 7 days complete.</p>
                </div>
                <ProgressRing value={42} label="Progress" />
              </div>
              <Button
                onClick={handleCheckIn}
                disabled={checkedIn}
                className="mt-6 w-full rounded-full bg-gradient-pink-lavender py-6 text-base font-semibold text-white shadow-pink-glow disabled:opacity-80"
              >
                {checkedIn ? "Checked in for today 🤙" : "Check in for today ✓"}
              </Button>
            </div>

            <div className="rounded-3xl glass p-6 shadow-soft">
              <h3 className="mb-4 font-semibold">Check-in timeline</h3>
              <ol className="space-y-3">
                {timeline.map((t) => (
                  <li
                    key={t.day}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/60 p-3"
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/50" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{t.day}</p>
                      {t.note && <p className="text-xs text-muted-foreground">{t.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: voice + witnesses + explorer */}
          <div className="space-y-6">
            <VoiceCoachCard
              title="Today's Coaching"
              message="Day one. This is where champions are made. Your SOL is locked. Let's go."
            />

            <div className="rounded-3xl glass p-6 shadow-soft">
              <h3 className="mb-4 font-semibold">Witnesses</h3>
              <ul className="space-y-3">
                {witnesses.map((w) => (
                  <li key={w.name} className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-pink-lavender font-semibold text-white">
                      {w.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.status}</p>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        w.status === "Accepted" ? "bg-cyan" : "bg-warning-foreground/50"
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-dark-premium p-6 text-dark-fg">
              <p className="text-xs uppercase tracking-wider text-rose">On-chain proof</p>
              <h3 className="mt-1 font-semibold">Explorer</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-fg/60">Program</span>
                  <span className="font-mono">3UoZ...Z33xv</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-fg/60">Tx</span>
                  <span className="font-mono">5ZW9...LHssP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-fg/60">Network</span>
                  <span>Devnet</span>
                </div>
              </div>
              <a
                href="https://explorer.solana.com/address/3UoZ5ixtrtHVPRbsJfb5a9ZPPnXmYjCjcWqDmS3Z33xv?cluster=devnet"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
              >
                View on Explorer <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
