// Pax Advisor — hackathon demo only.
// VITE_OPENROUTER_API_KEY in the browser is acceptable for demos.
// In production, proxy this through a serverless route (e.g. Vercel API)
// so the key is never exposed to the client.

export interface PactContext {
  habitName?: string;
  category?: string;
  stakeAmount?: number;
  daysLeft?: number;
  witnesses?: number;
  progress?: number;
}

export interface AskPaxArgs {
  question: string;
  pactContext?: PactContext;
}

const SYSTEM_PROMPT =
  "You are Pax, a warm but firm accountability coach inside Pinky, a Solana habit-pact app. Give short, practical, motivational advice. Do not give medical, legal, or financial advice. Keep replies under 120 words.";

function mockResponse(question: string, ctx?: PactContext): string {
  const q = question.toLowerCase();
  const habit = ctx?.habitName || "your pact";
  if (q.includes("miss") || q.includes("fail")) {
    return `Missing a day doesn't end ${habit} — but it does cost you. Your stake is on the line, and momentum is harder to rebuild than to keep. If today is shaky, do the smallest possible version of the habit and check in. Showing up small beats not showing up at all.`;
  }
  if (q.includes("consistent") || q.includes("strategy")) {
    return `Consistency on ${habit} comes from making it boring and obvious. Same time, same place, same trigger. Stack it onto something you already do daily. And remember: your witnesses see every check-in — let that be your nudge.`;
  }
  if (q.includes("check-in") || q.includes("checkin")) {
    return `Best check-in strategy: do the habit first, check in immediately after, same time window every day. Don't let the check-in float — anchor it to the action. Your future self (and your SOL) will thank you.`;
  }
  return `You've already made the hard decision by locking the pact for ${habit}. Today's job is simple: complete the smallest version of the habit, check in, and keep your promise alive. One day at a time. 🤙`;
}

function contextLine(ctx?: PactContext): string {
  if (!ctx) return "";
  const parts: string[] = [];
  if (ctx.habitName) parts.push(`Habit: ${ctx.habitName}`);
  if (ctx.category) parts.push(`Category: ${ctx.category}`);
  if (ctx.stakeAmount != null) parts.push(`Stake: ${ctx.stakeAmount} SOL`);
  if (ctx.daysLeft != null) parts.push(`Days left: ${ctx.daysLeft}`);
  if (ctx.witnesses != null) parts.push(`Witnesses: ${ctx.witnesses}`);
  if (ctx.progress != null) parts.push(`Progress: ${ctx.progress}%`);
  return parts.length ? `User pact context — ${parts.join(", ")}.` : "";
}

export async function askPaxAdvisor({
  question,
  pactContext,
}: AskPaxArgs): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_OPENROUTER_API_KEY || "";
  const model =
    (import.meta as any).env?.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini";

  if (!apiKey) {
    return mockResponse(question, pactContext);
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${contextLine(pactContext)}\n\nQuestion: ${question}`.trim(),
          },
        ],
        max_tokens: 220,
        temperature: 0.7,
      }),
    });
    if (!res.ok) return mockResponse(question, pactContext);
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return reply || mockResponse(question, pactContext);
  } catch (e) {
    console.error("Pax advisor error:", e);
    return mockResponse(question, pactContext);
  }
}