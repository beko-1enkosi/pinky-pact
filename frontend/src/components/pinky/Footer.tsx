export function Footer() {
  return (
    <footer
      className="mt-24"
      style={{
        background: "#0A0A14",
        borderTop: "1px solid rgba(236, 72, 153, 0.2)",
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-8 text-center text-xs text-white/70">
        <p className="text-sm font-semibold text-white">
          <span className="text-gradient-pink">Pinky-Pact</span>
          <span className="text-white/60"> · Your word. On-chain.</span>
        </p>
        <p className="mt-3 text-white/60">
          Built on Solana · Powered by ElevenLabs · Scaffolded with v0 by Vercel
        </p>
        <p className="mt-3 text-white/70">
          Made with <span className="text-pink-400">❤️</span> for{" "}
          <span className="text-gradient-pink font-semibold">
            Dev3Pack Global Hackathon 2026
          </span>
        </p>
        <p className="mt-1 text-white/60">
          By Thobeka • Khatisani • Jared • Anele
        </p>
        <p className="mt-1 text-white/60">From South Africa 🇿🇦</p>
        <p className="mt-4 font-mono text-[11px] text-white/50">
          <a
            href="https://explorer.solana.com/address/3UoZ5ixtrtHVPRbsJfb5a9ZPPnXmYjCjcWqDmS3Z33xv?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-pink-300"
          >
            Program: 3UoZ5ixtrtHVPRbsJfb5a9Z...Z33xv · Solana Devnet
          </a>
        </p>
      </div>
    </footer>
  );
}
