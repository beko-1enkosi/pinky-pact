import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/pinky/PageShell";
import { CheckCircle2, X } from "lucide-react";

export const Route = createFileRoute("/witness/$id")({
  component: WitnessPage,
});

function WitnessPage() {
  const [voted, setVoted] = useState<null | "yes" | "no">(null);
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Witness</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">You are witnessing a pact</h1>
        <p className="mt-3 text-muted-foreground">
          Mpho asked you to hold them accountable. Here's the truth they staked.
        </p>

        <div className="mt-8 rounded-3xl glass p-6 md:p-8 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <Detail label="Creator" value="Mpho N." />
            <Detail label="Habit" value="Hit the gym 4x / week" />
            <Detail label="Deadline" value="In 3 days" />
            <Detail label="Stake" value="0.4 devnet SOL" />
          </div>

          <h3 className="mt-8 font-semibold">Check-in history</h3>
          <ul className="mt-3 space-y-2">
            {["Mon ✓", "Wed ✓", "Fri ✓", "Sat — missed"].map((t) => (
              <li key={t} className="rounded-xl bg-secondary/60 p-3 text-sm">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="text-lg font-semibold">Did they keep their word?</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button
                onClick={() => setVoted("yes")}
                className="rounded-full bg-gradient-pink-lavender py-6 text-base text-white shadow-pink-glow"
              >
                Yes, completed ✓
              </Button>
              <Button
                onClick={() => setVoted("no")}
                variant="outline"
                className="rounded-full border-destructive/40 py-6 text-base text-destructive hover:bg-destructive/10"
              >
                No, they failed ✕
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {voted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur p-4"
            onClick={() => setVoted(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl bg-surface p-8 text-center shadow-pink-glow"
            >
              <button
                className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-secondary"
                onClick={() => setVoted(null)}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-pink-lavender">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">Vote recorded</h2>
              <p className="mt-2 text-muted-foreground">
                Your witness vote has been submitted.
              </p>
              <Button
                onClick={() => setVoted(null)}
                className="mt-6 w-full rounded-full bg-gradient-pink-lavender text-white"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}
