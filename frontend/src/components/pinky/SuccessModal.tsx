import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function SuccessModal({
  open,
  onClose,
  tx,
  title,
  message,
  hideExplorer,
}: {
  open: boolean;
  onClose: () => void;
  tx?: string;
  title?: string;
  message?: string;
  hideExplorer?: boolean;
}) {
  const txDisplay = tx ? `${tx.slice(0, 4)}...${tx.slice(-4)}` : "3xK9...mQ7p";
  const explorerUrl = tx
    ? `https://explorer.solana.com/tx/${tx}?cluster=devnet`
    : "https://explorer.solana.com/?cluster=devnet";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface p-8 text-center shadow-pink-glow"
          >
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-pink-lavender opacity-30 blur-3xl" />
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl"
            >
              🤙
            </motion.div>
            <h2 className="mt-4 text-2xl font-bold">{title ?? "Pact Locked On-Chain"}</h2>
            <p className="mt-2 text-muted-foreground">
              {message ?? "Your devnet SOL is staked. Your word is given."}
            </p>
            <div className="mt-5 rounded-2xl bg-secondary/60 p-3 font-mono text-sm">
              tx: {txDisplay}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              {!hideExplorer && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
                >
                  View on Solana Explorer <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <Link to="/dashboard">
                <Button className="w-full rounded-full bg-gradient-pink-lavender text-white">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
