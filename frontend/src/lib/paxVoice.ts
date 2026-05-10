// Pax Voice — hackathon demo only.
// VITE_ELEVENLABS_API_KEY in the browser is acceptable for demos.
// In production, proxy this through a serverless route (e.g. Vercel API)
// so the key is never exposed to the client.

const VOICE_ID =
  (import.meta as any).env?.VITE_ELEVENLABS_VOICE_ID ||
  "21m00Tcm4TlvDq8ikWAM";
const API_KEY = (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || "";

export interface SpeechHandle {
  stop: () => void;
  done: Promise<void>;
}

function speakBrowser(text: string): SpeechHandle {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return { stop: () => {}, done: Promise.resolve() };
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  u.pitch = 1;
  const done = new Promise<void>((resolve) => {
    u.onend = () => resolve();
    u.onerror = () => resolve();
  });
  try {
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.error("SpeechSynthesis error:", e);
    return { stop: () => {}, done: Promise.resolve() };
  }
  return {
    stop: () => {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    },
    done,
  };
}

export async function speakPaxMessage(text: string): Promise<SpeechHandle> {
  if (!text) return { stop: () => {}, done: Promise.resolve() };
  if (!API_KEY) return speakBrowser(text);
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );
    if (!res.ok) return speakBrowser(text);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    const done = new Promise<void>((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
    });
    await audio.play();
    return {
      stop: () => {
        try {
          audio.pause();
          audio.currentTime = 0;
          URL.revokeObjectURL(url);
        } catch {}
      },
      done,
    };
  } catch (e) {
    console.error("ElevenLabs error:", e);
    return speakBrowser(text);
  }
}

export async function readPaxMessage(text: string): Promise<void> {
  await speakPaxMessage(text);
}