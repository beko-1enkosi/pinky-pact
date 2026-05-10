import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function WitnessCard({
  id,
  title,
  creator,
  status = "Vote pending",
}: {
  id: string;
  title: string;
  creator: string;
  status?: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-3xl glass p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">From {creator}</p>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <span className="rounded-full bg-warning/70 px-3 py-1 text-xs text-warning-foreground">
          {status}
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/witness/$id" params={{ id }} className="flex-1">
          <Button className="w-full rounded-full bg-gradient-pink-lavender text-white">Review</Button>
        </Link>
      </div>
    </motion.div>
  );
}
