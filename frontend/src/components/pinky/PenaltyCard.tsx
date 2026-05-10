import { motion } from "framer-motion";

export function PenaltyCard({
  emoji,
  title,
  desc,
  selected,
  onClick,
}: {
  emoji: string;
  title: string;
  desc: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-primary bg-gradient-to-br from-primary/10 to-lavender/10 shadow-pink-glow"
          : "border-border bg-surface hover:border-primary/40"
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="font-semibold">{title}</span>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </motion.button>
  );
}
