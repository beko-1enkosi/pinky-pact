// This frontend ElevenLabs setup is for hackathon demo only.
// Production should proxy this through a backend API route.

const VOICE_ID =
  (import.meta as any).env?.VITE_ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
const API_KEY = (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || "";

export function getCoachingScript(
  habitName: string,
  day: number,
  total: number,
): string {
  if (day === 1) {
    return `Day one of your ${habitName} pact. This is where champions are made. Your SOL is locked. Let us go.`;
  }
  if (day >= 3 && day <= 4) {
    return `The dip hits around now. Push through it. Your ${habitName} goal is worth it.`;
  }
  if (day === Math.floor(total / 2)) {
    return `Halfway there. You have already proved something to yourself.`;
  }
  if (day === total) {
    return `Last day. Do not throw away everything you have built.`;
  }
  return `Stay focused on your ${habitName} goal. Your witnesses are watching.`;
}

export async function generateAudio(
  habitName: string,
  day: number,
  total: number,
): Promise<string | null> {
  if (!API_KEY) return null;

  const text = getCoachingScript(habitName, day, total);

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
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("ElevenLabs error:", error);
    return null;
  }
}