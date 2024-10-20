import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
//@ts-expect-error - Preload is not typed
import Preload from "preload-it";
import { LLMHelper } from "realtime-ai";
import { DailyVoiceClient } from "realtime-ai-daily";
import { VoiceClientAudio, VoiceClientProvider } from "realtime-ai-react";

import { AppProvider } from "@/context";
import { config, services, timeout } from "@/rtvi.config";

import Session from "./Session";

const assets = [
  "/codeccall.wav",
  "/codecfreq.wav",
  "/codecopen.wav",
  "/codecover.wav",
  "/codecphonebook.wav",
  "/codecphoneentry.wav",
  "/zip.wav",
  "/gunshot.wav",
  "/music.mp3",
  "/gameover.mp3",
  "/agent_base.png",
  "/hal_base.png",
  "/meiling_base.png",
  "/meryl_base.png",
  "/naomi_base.png",
  "/roy_base.png",
  "/snake_base.png",
  "/bg.jpg",
];

export default function App() {
  const mountedRef = useRef(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [voiceClient, setVoiceClient] = useState<DailyVoiceClient | null>(null);

  useEffect(() => {
    if (voiceClient || mountedRef.current) {
      return;
    }

    mountedRef.current = true;

    const vc = new DailyVoiceClient({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "/api",
      services,
      config,
      timeout,
    });

    vc.registerHelper("llm", new LLMHelper({}));

    setVoiceClient(vc);
  }, [voiceClient]);

  useEffect(() => {
    const preloader = Preload();

    preloader.fetch(assets).then(() => {
      setAssetsLoaded(true);
    });
  }, []);

  if (!voiceClient) {
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <VoiceClientProvider voiceClient={voiceClient}>
      <AppProvider>
        <Session />
      </AppProvider>
      <VoiceClientAudio />
    </VoiceClientProvider>
  );
}
