import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Lock,
  Users,
  Mic,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/pinky/PageShell";
import { FloatingOrbs } from "@/components/pinky/FloatingOrbs";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const Route = createFileRoute("/try-demo")({
  head: () => ({
    meta: [
      { title: "Try Pinky-Pact — Judge Walkthrough" },
      {
        name: "description",
        content:
          "A guided walkthrough of Pinky-Pact for Dev3Pack Global Hackathon judges.",
      },
      { property: "og:title", content: "Try Pinky-Pact — Judge Walkthrough" },
      {
        property: "og:description",
        content:
          "Explore Pinky-Pact through three personas — habit accountability staked on Solana devnet.",
      },
    ],
  }),
  component: TryDemoPage,
});

const personas = [
  {
    initials: "AN",
    avatarBg: "bg-gradient-pink-lavender",
    name: "Anele",
    meta: "24 · Johannesburg",
    blurb:
      "Building her fitness accountability — a 14-day gym pact with 0.3 devnet SOL staked. Three witnesses are holding her accountable daily.",
    bullets: [
      "Active pact dashboard",
      "Daily ElevenLabs coaching",
      "Check-in timeline",
      "Witness tracking",
    ],
    cta: "Enter as Anele →",
    btnClass:
      "bg-gradient-pink-lavender text-white shadow-pink-glow hover:opacity-95",
    persona: "anele",
    to: "/dashboard",
  },
  {
    initials: "KH",
    avatarBg: "bg-lavender",
    name: "Khatisani",
    meta: "23 · Pretoria",
    blurb:
      "Studying for her AWS certification — a 30-day study pact with 0.5 devnet SOL locked. Her study group are her witnesses.",
    bullets: [
      "Multi-pact overview",
      "Progress rings",
      "On-chain proof explorer",
      "Penalty destination flow",
    ],
    cta: "Enter as Khatisani →",
    btnClass:
      "border-2 border-lavender text-[#5b21b6] bg-white hover:bg-lavender/10",
    persona: "khatisani",
    to: "/dashboard",
  },
  {
    initials: "JR",
    avatarBg: "bg-cyan-400",
    name: "Jared",
    meta: "26 · Cape Town",
    blurb:
      "Training for his first marathon — a 7-day running pact with 1 devnet SOL on the line. No excuses. No extensions.",
    bullets: [
      "Pact detail view",
      "Witness voting",
      "Settlement preview",
      "Solana Explorer receipt",
    ],
    cta: "Enter as Jared →",
    btnClass:
      "border-2 border-cyan-400 text-cyan-700 bg-white hover:bg-cyan-50",
    persona: "jared",
    to: "/pact/1",
  },
] as const;

const steps = [
  {
    icon: Lock,
    title: "Make a pact",
    text: "Choose a habit, deadline, stake, and what happens if you fail.",
  },
  {
    icon: Users,
    title: "Invite witnesses",
    text: "Friends accept their role and hold you accountable.",
  },
  {
    icon: Mic,
    title: "Hear your coach",
    text: "Pax delivers motivational voice coaching powered by ElevenLabs.",
  },
  {
    icon: Trophy,
    title: "Keep your word",
    text: "Complete it and get your stake back. Fail, and your chosen penalty triggers.",
  },
];

const infra = [
  {
    title: "Solana",
    text:
      "Anchor/Rust smart contract deployed to Solana devnet. Real Phantom wallet connection, real devnet SOL balance, real create_pact transaction, PDA-based pact accounts, and Explorer proof.",
    sub: "Program: 3UoZ5ixtrtHVPR...Z33xv",
    badge: "✅ Live on devnet",
  },
  {
    title: "ElevenLabs",
    text:
      "Pax is Pinky-Pact's AI voice coach. The app includes coaching message logic and a voice-coaching interface designed for Generate Speech.",
    sub: "Voice: Pax",
    badge: "🎙️ Generate Speech",
  },
  {
    title: "v0 by Vercel",
    text:
      "Pinky-Pact's polished interface was rapidly prototyped with AI-assisted UI generation and deployment-ready React components for the hackathon.",
    sub: "React + Tailwind",
    badge: "⚡ Rapid UI",
  },
];

const revenue = [
  {
    label: "B2C",
    text: "Premium accountability pacts with paid coaching features",
    value: "R450K Year 1",
  },
  {
    label: "Corporate",
    text:
      "Team habit challenges for companies, students, gyms, and wellness programmes",
    value: "R280K Year 1",
  },
  {
    label: "Creator / Community",
    text: "Group challenge pools and accountability communities",
    value: "R120K Year 1",
  },
];

const roadmap = [
  {
    emoji: "💳",
    title: "Dual Wallet System",
    text:
      "Separate wallets for staking and savings. In a future mainnet version, users could stake USDC, withdraw rewards, and cash out through regulated payment partners.",
  },
  {
    emoji: "📱",
    title: "Mobile App",
    text:
      "Native iOS and Android with Solana Mobile Stack, daily coaching notifications, and photo check-ins.",
  },
  {
    emoji: "👥",
    title: "Group Pacts",
    text:
      "Friend groups commit together. Complete the challenge and share the reward pool.",
  },
  {
    emoji: "⭐",
    title: "Witness Reputation",
    text:
      "Witnesses build a reputation score based on reliability, voting history, and accountability behaviour.",
  },
  {
    emoji: "🌍",
    title: "Multi-language Coaching",
    text:
      "ElevenLabs voice coaching in South African languages such as isiZulu, Sesotho, Afrikaans, and isiXhosa.",
  },
  {
    emoji: "⚖️",
    title: "Bigger Commitment Layer",
    text:
      "The same on-chain commitment pattern could later support legal documents, medical consent, education goals, and community accountability.",
  },
];

function TryDemoPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const setPersona = (p: string, to: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("persona", p);
    }
    navigate({ to });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageShell>
      {/* SECTION 1 — WELCOME, JUDGE */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-gradient-dark-premium text-dark-fg">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/40 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-400/20 blur-[140px]" />
        <FloatingOrbs />

        <div className="relative mx-auto w-full max-w-5xl px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-rose" />
            🤙 Pinky-Pact · Dev3Pack Global Hackathon · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl"
          >
            Welcome, <span className="text-gradient-pink">Judge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg text-dark-fg/75 md:text-xl"
          >
            We built Pinky-Pact from 8 to 10 May 2026 — a Solana-powered habit
            accountability app where your word lives on-chain, your devnet SOL
            is at stake, and Pax, your AI voice coach, keeps you accountable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-dark-fg/70"
          >
            <span>✅ Smart contract deployed to Solana devnet</span>
            <span className="text-dark-fg/30">·</span>
            <span>🎙️ Powered by ElevenLabs</span>
            <span className="text-dark-fg/30">·</span>
            <span>🇿🇦 Built in South Africa</span>
          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => scrollTo("experience")}
              className="rounded-full bg-gradient-pink-lavender px-8 py-6 text-base font-semibold text-white shadow-pink-glow"
            >
              Experience the App →
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("pitch")}
              className="rounded-full border-white/30 bg-white/5 px-8 py-6 text-base font-semibold text-white hover:bg-white/10"
            >
              See the Pitch First
            </Button>
          </div>

          <motion.button
            onClick={() => scrollTo("experience")}
            className="mt-16 inline-flex flex-col items-center text-dark-fg/60"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-label="Scroll down"
          >
            <ChevronDown className="h-6 w-6" />
          </motion.button>
        </div>
      </section>

      {/* SECTION 2 — EXPERIENCE THE APP */}
      <section id="experience" className="relative overflow-hidden">
        <FloatingOrbs />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Experience the App
            </p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              How would you like to <span className="text-gradient-pink">explore?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Pick a perspective. Each shows a different side of Pinky-Pact.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {personas.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="flex flex-col rounded-3xl border border-border/60 bg-white p-7 shadow-soft"
              >
                <div
                  className={`grid h-14 w-14 place-items-center rounded-full ${p.avatarBg} text-lg font-bold text-white`}
                >
                  {p.initials}
                </div>
                <h3 className="mt-5 text-2xl font-bold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.meta}</p>
                <p className="mt-4 text-sm text-foreground/80">{p.blurb}</p>

                <div className="mt-5 rounded-2xl bg-secondary/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    You'll see
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-primary">✅</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => setPersona(p.persona, p.to)}
                  className={`mt-6 w-full rounded-full py-6 text-base font-semibold ${p.btnClass}`}
                >
                  {p.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center">
            <div className="h-px w-full max-w-md bg-border" />
            <p className="mt-6 text-sm font-medium text-foreground">
              Or connect your own wallet →
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Connect Phantom on Solana devnet to create a real pact with devnet SOL.
            </p>
            <div className="mt-4">{mounted && <WalletMultiButton />}</div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE PITCH */}
      <section id="pitch" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            The Pitch
          </p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            What is <span className="text-gradient-pink">Pinky-Pact?</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border/60 bg-white p-8 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose/15 text-rose">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">The Problem</h3>
            </div>
            <p className="mt-5 text-foreground/80">
              People fail at habits alone. Existing habit apps send reminders, but
              reminders are easy to ignore. There is no meaningful consequence, no
              trusted witness layer, and no proof that a commitment was ever made.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Low accountability", "Easy to abandon", "No proof layer"].map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-rose/10 px-3 py-1 text-xs font-medium text-rose"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-white p-8 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">The Solution</h3>
            </div>
            <p className="mt-5 text-foreground/80">
              Pinky-Pact turns a personal habit into an on-chain commitment. You stake
              devnet SOL, invite witnesses, receive AI voice coaching from Pax, and
              create a verifiable Solana record of your pact.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Social witnesses", "AI voice coaching", "Solana devnet proof"].map(
                (c) => (
                  <span
                    key={c}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {c}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS (DARK) */}
      <section className="relative overflow-hidden bg-gradient-dark-premium text-dark-fg">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-primary/40 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              Three steps. One promise.{" "}
              <span className="text-gradient-pink">Zero excuses.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl glass-dark p-6"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-pink-lavender">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-rose">
                  Step {i + 1}
                </div>
                <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-dark-fg/70">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — INFRASTRUCTURE (LIGHT) */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Infrastructure
          </p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Built on <span className="text-gradient-pink">real infrastructure.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {infra.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded-3xl border border-border/60 bg-white p-7 shadow-soft"
            >
              <h3 className="text-2xl font-bold">{f.title}</h3>
              <p className="mt-3 flex-1 text-sm text-foreground/80">{f.text}</p>
              <p className="mt-4 break-all font-mono text-xs text-muted-foreground">
                {f.sub}
              </p>
              <span className="mt-4 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {f.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — REVENUE (LIGHT) */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Business
          </p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            How Pinky-Pact <span className="text-gradient-pink">makes money.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Starting as a devnet prototype. Scaling into real accountability products.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-white shadow-soft">
          {revenue.map((r) => (
            <div
              key={r.label}
              className="flex flex-col gap-2 border-b border-border/60 px-6 py-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {r.label}
                </p>
                <p className="mt-1 text-foreground/85">{r.text}</p>
              </div>
              <div className="font-mono text-sm font-semibold text-foreground">
                {r.value}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between bg-gradient-pink-lavender px-6 py-5 text-white">
            <span className="text-lg font-bold">Projected Year 1</span>
            <span className="text-2xl font-extrabold">R850K</span>
          </div>
        </div>
      </section>

      {/* SECTION 7 — WHAT'S COMING NEXT (DARK) */}
      <section className="relative overflow-hidden bg-gradient-dark-premium text-dark-fg">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-lavender/30 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              🔥 What's <span className="text-gradient-pink">coming next</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl glass-dark p-6"
              >
                <div className="text-3xl">{r.emoji}</div>
                <h3 className="mt-3 text-lg font-bold">{r.title}</h3>
                <p className="mt-2 text-sm text-dark-fg/70">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — READY TO KEEP YOUR WORD (DARK) */}
      <section className="relative overflow-hidden bg-gradient-dark-premium text-dark-fg">
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/40 blur-[160px]" />
        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center">
          <span className="text-7xl">🤙</span>
          <h2 className="mt-6 text-4xl font-bold md:text-6xl">
            Ready to <span className="text-gradient-pink">keep your word?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-dark-fg/75">
            Explore Pinky-Pact through a demo persona, or connect Phantom on Solana
            devnet and create your first real devnet pact.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => setPersona("anele", "/dashboard")}
              className="rounded-full bg-gradient-pink-lavender px-8 py-6 text-base font-semibold text-white shadow-pink-glow"
            >
              Be Anele →
            </Button>
            <Button
              size="lg"
              onClick={() => setPersona("khatisani", "/dashboard")}
              variant="outline"
              className="rounded-full border-white/30 bg-white/5 px-8 py-6 text-base font-semibold text-white hover:bg-white/10"
            >
              Be Khatisani →
            </Button>
            <Button
              size="lg"
              onClick={() => setPersona("jared", "/pact/1")}
              variant="outline"
              className="rounded-full border-white/30 bg-white/5 px-8 py-6 text-base font-semibold text-white hover:bg-white/10"
            >
              Be Jared →
            </Button>
          </div>
          <div className="mt-10 flex flex-col items-center">
            <p className="text-sm text-dark-fg/70">Or connect your wallet</p>
            <div className="mt-4">{mounted && <WalletMultiButton />}</div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}