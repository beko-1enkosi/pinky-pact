import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export function StatCard({
  value,
  label,
  accent = "pink",
}: {
  value: string;
  label: string;
  accent?: "pink" | "cyan" | "lavender";
}) {
  const map = {
    pink: "from-primary to-rose",
    cyan: "from-cyan to-lavender",
    lavender: "from-lavender to-primary",
  } as const;

  const match = value.match(/^([\d.]+)([a-zA-Z%+]*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(
    "0" + (decimals ? "." + "0".repeat(decimals) : "") + suffix,
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals) + suffix),
    });
    return () => controls.stop();
  }, [inView, target, decimals, suffix]);

  return (
    <div ref={ref} className="rounded-2xl glass p-5">
      <div
        className={`bg-gradient-to-br ${map[accent]} bg-clip-text text-3xl font-bold text-transparent tabular-nums`}
      >
        {display}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
