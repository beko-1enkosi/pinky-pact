import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Volume2 } from "lucide-react";
import { askPaxAdvisor, type PactContext } from "@/lib/paxAdvisor";
import { readPaxMessage } from "@/lib/paxVoice";

interface Msg {
  role: "user" | "pax";
  content: string;
}

const SUGGESTIONS = [
  "Motivate me for today",
  "What if I miss a day?",
  "Help me stay consistent",
  "Give me a check-in strategy",
];

const INITIAL: Msg = {
  role: "pax",
  content:
    "Hey, I'm Pax. Ask me for advice, motivation, or a strategy for keeping your pact.",
};

export function PaxChat({ pactContext }: { pactContext?: PactContext }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await askPaxAdvisor({ question: q, pactContext });
      setMessages((m) => [...m, { role: "pax", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "pax", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="mb-3 w-[calc(100vw-3rem)] max-w-[360px] overflow-hidden rounded-3xl glass shadow-soft border border-primary/20"
            style={{
              backdropFilter: "blur(14px)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 bg-gradient-pink-lavender/20 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Ask Pax 🤙
                </h3>
                <p className="text-xs text-muted-foreground">
                  Your pact accountability coach
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Pax chat"
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="max-h-[320px] min-h-[200px] space-y-3 overflow-y-auto px-4 py-3"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-pink-lavender text-white"
                        : "bg-secondary/70 text-foreground"
                    }`}
                  >
                    <div>{m.content}</div>
                    {m.role === "pax" && (
                      <button
                        onClick={() => readPaxMessage(m.content)}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        <Volume2 className="h-3 w-3" /> Read aloud
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-secondary/70 px-3 py-2 text-sm text-muted-foreground">
                    Pax is thinking…
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-primary/30 bg-background/40 px-2.5 py-1 text-xs text-foreground hover:bg-primary/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border/40 px-3 py-2.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Pax about your pact..."
                className="flex-1 rounded-full bg-secondary/60 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-pink-lavender text-white shadow-pink-glow disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Ask Pax"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-gradient-pink-lavender text-white shadow-pink-glow"
      >
        <Bot className="h-6 w-6" />
        <span className="pointer-events-none absolute left-16 whitespace-nowrap rounded-full bg-foreground px-3 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
          Ask Pax
        </span>
      </motion.button>
    </div>
  );
}