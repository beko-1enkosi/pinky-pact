import { Play, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Waveform } from "./Waveform";
import { speakPaxMessage, type SpeechHandle } from "@/lib/paxVoice";

export function VoiceCoachCard({
  title = "Meet Pax, your voice coach.",
  message = "Day one. Your pact is locked. Your witnesses are watching. Let's go.",
  dark = false,
}: {
  title?: string;
  message?: string;
  dark?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const handleRef = useRef<SpeechHandle | null>(null);

  useEffect(() => {
    return () => {
      handleRef.current?.stop();
    };
  }, []);

  const toggle = async () => {
    if (playing) {
      handleRef.current?.stop();
      handleRef.current = null;
      setPlaying(false);
      return;
    }
    setPlaying(true);
    try {
      const handle = await speakPaxMessage(message);
      handleRef.current = handle;
      handle.done.then(() => {
        if (handleRef.current === handle) {
          handleRef.current = null;
          setPlaying(false);
        }
      });
    } catch {
      setPlaying(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-3xl p-6 ${
        dark ? "glass-dark text-dark-fg" : "glass"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-pink-lavender text-white">
          🎙️
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className={`text-xs ${dark ? "text-dark-fg/60" : "text-muted-foreground"}`}>
            Powered by ElevenLabs
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={toggle}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-pink-lavender text-white shadow-pink-glow transition hover:scale-105"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
        </button>
        <div className={`flex-1 ${dark ? "text-rose" : "text-primary"}`}>
          <Waveform playing={playing} />
        </div>
      </div>
      <p className={`mt-4 text-sm italic ${dark ? "text-dark-fg/80" : "text-muted-foreground"}`}>
        "{message}"
      </p>
    </motion.div>
  );
}
