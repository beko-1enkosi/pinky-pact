import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LockKeyhole, Users, Trophy, Sparkles, Mic, ShieldCheck, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/pinky/PageShell";
import { FloatingOrbs } from "@/components/pinky/FloatingOrbs";
import { ProgressRing } from "@/components/pinky/ProgressRing";
import { StatCard } from "@/components/pinky/StatCard";
import { CategoryCard } from "@/components/pinky/CategoryCard";
import { VoiceCoachCard } from "@/components/pinky/VoiceCoachCard";
import { categories } from "@/lib/mock";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <FloatingOrbs />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pt-16 pb-24 md:grid-cols-2 md:pt-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Solana Devnet · AI Voice Coach · Habit Accountability
            </motion.div>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Stake your <span className="text-gradient-pink">habits</span>.{" "}
              <br className="hidden md:block" />
              Keep your <span className="text-gradient-pink">word</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Pinky-Pact turns personal goals into on-chain commitments. Stake devnet SOL,
              invite witnesses, and let an AI voice coach keep you accountable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/create">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-pink-lavender px-7 py-6 text-base font-semibold text-white shadow-pink-glow hover:opacity-95"
                >
                  Create Your First Pact 🤙
                </Button>
              </Link>
              <a href="#how">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary/30 px-7 py-6 text-base font-semibold hover:bg-primary/5"
                >
                  Watch How It Works
                </Button>
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
              <StatCard value="248" label="Devnet SOL staked" />
              <StatCard value="1.2k" label="Witness-backed pacts" accent="lavender" />
              <StatCard value="9.4k" label="AI coaching moments" accent="cyan" />
            </div>
          </div>

          {/* 3D Pact Card */}
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30, rotateY: -25 }}
              animate={{ opacity: 1, y: 0, rotateY: -12 }}
              transition={{ duration: 0.8 }}
              style={{ perspective: 1200, transformStyle: "preserve-3d" }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[340px] rounded-3xl glass p-7 shadow-pink-glow"
                style={{ transform: "rotateY(-12deg) rotateX(6deg)" }}
              >
                <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-pink-lavender opacity-30 blur-2xl" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏃</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Devnet</span>
                </div>
                <h3 className="mt-4 text-xl font-bold">7-Day Running Pact</h3>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-secondary/70 p-2">
                    <div className="font-bold">0.5</div>
                    <div className="text-muted-foreground">SOL</div>
                  </div>
                  <div className="rounded-xl bg-secondary/70 p-2">
                    <div className="font-bold">3</div>
                    <div className="text-muted-foreground">Witnesses</div>
                  </div>
                  <div className="rounded-xl bg-secondary/70 p-2">
                    <div className="font-bold">6d</div>
                    <div className="text-muted-foreground">Left</div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative">
                    <motion.div
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-gradient-pink-lavender blur-2xl"
                      animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.9, 1.05, 0.9] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative">
                      <ProgressRing value={42} size={140} label="On track" />
                    </div>
                  </div>
                </div>
                <Button className="mt-6 w-full rounded-full bg-gradient-pink-lavender text-white">
                  Pact Locked 🔒
                </Button>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-10 rounded-2xl glass px-4 py-3 text-sm shadow-soft"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎙️</span>
                  <div>
                    <div className="font-semibold">Pax · coaching</div>
                    <div className="text-xs text-muted-foreground">"Day one. Let's go."</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 rounded-2xl bg-gradient-rose-cyan px-4 py-3 text-sm font-semibold text-white shadow-pink-glow"
              >
                +0.5 SOL staked
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
          <h2 className="mt-2 text-4xl font-bold md:text-5xl">Three steps to your word.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: LockKeyhole, title: "Make a pact", text: "Choose a habit, deadline, stake amount, and penalty destination." },
            { icon: Users, title: "Invite witnesses", text: "Friends accept their role and hold you accountable." },
            { icon: Trophy, title: "Keep your word", text: "Complete your habit and get your stake back." },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl glass p-8 shadow-soft"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-pink-lavender text-white shadow-pink-glow">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
              <div className="mt-6 bg-gradient-to-br from-primary/40 to-lavender/40 bg-clip-text text-6xl font-black text-transparent">
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Pacts for every part of you.</h2>
          <p className="mt-2 text-muted-foreground">Pick a category and start your commitment.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.label} emoji={c.emoji} label={c.label} />
          ))}
        </div>
      </section>

      {/* DARK SECTION */}
      <section id="demo" className="relative overflow-hidden bg-gradient-dark-premium text-dark-fg">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-primary/40 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan/30 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-rose">Premium accountability</p>
              <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
                Accountability that feels{" "}
                <span className="text-gradient-pink">personal</span>.
              </h2>
              <p className="mt-5 text-lg text-dark-fg/70">
                A soft but serious accountability partner. Voice coaching, witness voting, and
                on-chain proof — all in one place.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Mic, label: "AI voice coaching" },
                  { icon: Users, label: "Witness voting" },
                  { icon: ShieldCheck, label: "On-chain proof" },
                  { icon: Receipt, label: "Explorer receipts" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3 rounded-2xl glass-dark p-4">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-pink-lavender">
                      <f.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div id="voice">
              <VoiceCoachCard dark />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-6xl">🤙</span>
          <h2 className="mt-6 text-4xl font-bold md:text-6xl">Ready to make a pinky promise?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Devnet only. No real funds. Real accountability.
          </p>
          <div className="mt-8">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="rounded-full bg-gradient-pink-lavender px-10 py-7 text-lg font-semibold text-white shadow-pink-glow"
              >
                Launch Pinky-Pact
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
