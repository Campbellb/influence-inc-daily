import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { VoiceError, VoiceEvent } from "realtime-ai";
import {
  useVoiceClient,
  useVoiceClientEvent,
  useVoiceClientTransportState,
} from "realtime-ai-react";

import { AppContext } from "@/context";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { CharacterEnum } from "@/rtvi.config";

import { Alert } from "./ui/alert";
import Footer from "./Footer";
import Gameover from "./Gameover";
import MissionComplete from "./MissionComplete";
import OSD from "./OSD";
import TitleScreen from "./TitleScreen";
import Transcript from "./Transcript";

export default function Session() {
  const voiceClient = useVoiceClient()!;
  const transportState = useVoiceClientTransportState();

  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<
    "idle" | "connecting" | "connected" | "gameover"
  >("idle");
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const { checkForPromotion, isCalling, userLevel, localCharacter, character } =
    useContext(AppContext);
  const [showPhonebook, setShowPhonebook] = useState<boolean | undefined>(
    undefined
  );
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setShowPhonebook(false);
  }, [isCalling]);

  useIdleTimer();

  useVoiceClientEvent(
    VoiceEvent.BotTranscript,
    useCallback(
      (transcript: string) => {
        checkForPromotion(transcript);
        if (
          character === CharacterEnum.Executive &&
          transcript.includes("Anchors aweigh!")
        ) {
          setGameComplete(true);
        }
      },
      [checkForPromotion, character]
    )
  );

  useVoiceClientEvent(VoiceEvent.BotStoppedSpeaking, () => {
    if (gameComplete) {
      setTimeout(() => {
        disconnect();
      }, 1000);
    }
  });

  useEffect(() => {
    switch (transportState) {
      case "authenticating":
      case "connecting":
      case "connected":
        setAppState("connecting");
        break;
      case "ready":
        setAppState("connected");
        break;
      case "disconnected":
        setAppState("gameover");
        break;
      default:
        setAppState("idle");
    }
  }, [transportState]);

  async function start() {
    if (!voiceClient) return;

    try {
      await voiceClient.start();
    } catch (e) {
      setError((e as VoiceError).message || "Unknown error occurred");
      voiceClient.disconnect();
    }
  }

  async function disconnect() {
    await voiceClient.disconnect();
  }

  if (error) {
    return <Alert>{error}</Alert>;
  }

  if (gameComplete) {
    return (
      <MissionComplete
        onContinue={() => {
          setAppState("idle");
          setGameComplete(false);
        }}
      />
    );
  }

  if (appState === "gameover") {
    return (
      <Gameover
        onContinue={() => {
          setAppState("idle");
          setGameComplete(false);
          disconnect();
        }}
      />
    );
  }

  if (appState === "idle") {
    return <TitleScreen handleStart={() => start()} />;
  }

  if (appState === "connecting") {
    return <></>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow">
        <OSD />
        <Transcript active={!showPhonebook} />
      </div>
      <div className="mt-auto">
        <Footer handleDisconnect={() => disconnect()} />
      </div>
    </div>
  );
}
