import { motion } from "framer-motion";

export function FloatingOrbs({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-pink-lavender opacity-30 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-rose-cyan opacity-25 blur-3xl"
        animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lavender opacity-25 blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
