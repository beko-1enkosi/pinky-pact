const PALETTE = ["#EC4899", "#A78BFA", "#22D3EE"];

export function Waveform({
  bars = 28,
  color,
  playing = true,
}: {
  bars?: number;
  color?: string;
  playing?: boolean;
}) {
  return (
    <div className="flex h-10 items-center gap-1">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="block w-1 rounded-full"
          style={{
            background: color ?? PALETTE[i % PALETTE.length],
            height: `${20 + ((i * 13) % 70)}%`,
            animation: `wave 1.2s ease-in-out ${i * 0.06}s infinite`,
            animationPlayState: playing ? "running" : "paused",
            boxShadow: color ? undefined : `0 0 6px ${PALETTE[i % PALETTE.length]}55`,
          }}
        />
      ))}
    </div>
  );
}
