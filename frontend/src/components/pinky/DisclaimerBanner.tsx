import { useState } from "react";
import { X } from "lucide-react";

export function DisclaimerBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="bg-warning/80 text-warning-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs md:text-sm">
        <p className="flex-1">
          ⚠️ <strong>Educational Prototype</strong> — Pinky-Pact runs on Solana devnet. No real funds are used.
        </p>
        <button onClick={() => setShow(false)} className="rounded-full p-1 hover:bg-black/5">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
