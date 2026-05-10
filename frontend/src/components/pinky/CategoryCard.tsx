import { motion } from "framer-motion";

export function CategoryCard({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition ${
        selected
          ? "border-primary bg-primary/5 shadow-pink-glow"
          : "border-border bg-surface hover:border-primary/40"
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}
