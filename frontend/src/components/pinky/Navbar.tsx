import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const links = [
  { to: "/", label: "Home" },
  { to: "/#how-it-works", label: "How it works" },
  { to: "/try-demo", label: "Try Demo" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-gradient-pink-lavender text-sm font-black text-white shadow-pink-glow"
          >
            P
          </span>
          <span className="text-xl">Pinky-Pact</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          {mounted ? (
            <WalletMultiButton />
          ) : (
            <Button className="rounded-full bg-gradient-pink-lavender px-5 text-white shadow-pink-glow hover:opacity-95">
              Launch App
            </Button>
          )}
        </div>
        <button
          className="rounded-full p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            {mounted ? (
              <WalletMultiButton />
            ) : (
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                <Button className="w-full rounded-full bg-gradient-pink-lavender text-white">
                  Launch App
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
