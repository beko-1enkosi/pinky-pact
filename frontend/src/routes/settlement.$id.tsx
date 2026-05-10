import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/pinky/PageShell";
import { FloatingOrbs } from "@/components/pinky/FloatingOrbs";

export const Route = createFileRoute("/settlement/$id")({
  component: Settlement,
});

function Settlement() {
  return (
    <PageShell>
      <div className="relative overflow-hidden">
        <FloatingOrbs />
        <div className="relative mx-auto max-w-3xl px-6 py-16 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-pink-lavender shadow-pink-glow"
          >
            <CheckCircle2 className="h-14 w-14 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-5xl font-bold md:text-6xl"
          >
            Pact Completed!
          </motion.h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your stake has been returned. You kept your word.
          </p>

          <div className="mt-10 rounded-3xl glass p-6 md:p-8 text-left shadow-soft">
            <h2 className="text-xl font-bold">Run 5km daily</h2>
            <p className="text-sm text-muted-foreground">7-day commitment</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Row label="Duration" value="7 days" />
              <Row label="Stake returned" value="0.5 devnet SOL" />
              <Row label="Witness votes" value="3 / 3 completed" />
              <Row label="Network" value="Devnet" />
            </div>
            <div className="mt-6 rounded-2xl bg-secondary/60 p-4">
              <p className="text-xs text-muted-foreground">Settlement transaction</p>
              <p className="mt-1 font-mono text-sm">8nQ4...vR2k</p>
            </div>
            <a
              href="https://explorer.solana.com/?cluster=devnet"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View on Solana Explorer <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-8 rounded-3xl bg-gradient-pink-lavender p-6 text-left text-white shadow-pink-glow">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
              <Share2 className="h-4 w-4" /> Share your win
            </div>
            <p className="mt-3 text-2xl font-bold leading-snug">
              "I kept my word. 7-day running pact ✓ Built on Pinky-Pact 🤙"
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard">
              <Button className="rounded-full bg-gradient-pink-lavender px-6 text-white">
                Back to Dashboard
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="outline" className="rounded-full border-primary/30 px-6">
                Make Another Pact
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
