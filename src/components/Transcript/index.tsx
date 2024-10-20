import React, { useCallback, useContext, useEffect, useRef } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

import { AppContext } from "@/context";

import styles from "./styles.module.css";

type Props = {
  active: boolean;
};

const TRANSCRIPT_REPLACE = [
  ["Snayk", "Snake"],
  ["Fahks-Hownd", "Fox Hound"],
  ["ota-kon", "Otacon"],
];

const Transcript: React.FC<Props> = ({ active }) => {
  const { isCalling, character } = useContext(AppContext);
  const [compiledTranscript, setCompiledTranscript] =
    React.useState<string>("");
  const debouncedTranscript = useDebounce(compiledTranscript, 800);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  useEffect(() => {
    setCompiledTranscript("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [isCalling, character]);

  useVoiceClientEvent(
    VoiceEvent.BotStartedSpeaking,
    useCallback(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.BotStoppedSpeaking,
    useCallback(() => {
      timeoutRef.current = setTimeout(() => {
        setCompiledTranscript("");
      }, 2000);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.BotTranscript,
    useCallback((transcript: string) => {
      setCompiledTranscript((t) => t + " " + replaceWords(transcript));
    }, [])
  );

  const replaceWords = (transcript: string) => {
    let newTranscript = transcript;
    TRANSCRIPT_REPLACE.forEach(([from, to]) => {
      newTranscript = newTranscript.replace(new RegExp(from, "g"), to);
    });
    return newTranscript;
  };

  if (!active) return null;

  return (
    <div className={styles.transcriptContainer}>
      <p className={styles.transcriptText}>{debouncedTranscript}</p>
    </div>
  );
};

export default Transcript;
