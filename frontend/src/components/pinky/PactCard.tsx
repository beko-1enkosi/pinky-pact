import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Users, Clock, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Pact {
  id: string;
  emoji: string;
  title: string;
  category: string;
  stake: number;
  witnesses: number;
  daysLeft: number;
  progress: number;
  status: "Active" | "Completed" | "Failed";
}

const statusStyles: Record<Pact["status"], string> = {
  Active: "bg-primary/10 text-primary",
  Completed: "bg-cyan/15 text-cyan",
  Failed: "bg-destructive/10 text-destructive",
};

export function PactCard({ pact }: { pact: Pact }) {
  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="group relative overflow-hidden rounded-3xl glass p-6 shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-2xl">
            {pact.emoji}
          </div>
          <div>
            <h3 className="font-semibold leading-tight text-foreground">{pact.title}</h3>
            <p className="text-xs text-muted-foreground">{pact.category}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[pact.status]}`}>
          {pact.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl bg-secondary/60 p-3">
          <Coins className="mb-1 h-3.5 w-3.5 text-primary" />
          <div className="font-semibold text-foreground">{pact.stake} SOL</div>
          <div className="text-muted-foreground">Stake</div>
        </div>
        <div className="rounded-xl bg-secondary/60 p-3">
          <Users className="mb-1 h-3.5 w-3.5 text-lavender" />
          <div className="font-semibold text-foreground">{pact.witnesses}</div>
          <div className="text-muted-foreground">Witnesses</div>
        </div>
        <div className="rounded-xl bg-secondary/60 p-3">
          <Clock className="mb-1 h-3.5 w-3.5 text-cyan" />
          <div className="font-semibold text-foreground">{pact.daysLeft}d</div>
          <div className="text-muted-foreground">Left</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-semibold text-foreground">{pact.progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-pink-lavender transition-all"
            style={{ width: `${pact.progress}%` }}
          />
        </div>
      </div>

      <Link to="/pact/$id" params={{ id: pact.id }} className="mt-5 block">
        <Button variant="outline" className="w-full rounded-full border-primary/30 hover:bg-primary/5">
          View Pact
        </Button>
      </Link>
    </motion.div>
  );
}
