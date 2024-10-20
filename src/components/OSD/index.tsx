import React, { useContext, useEffect, useRef, useState } from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

import { AppContext } from "@/context";
import { CharacterEnum } from "@/rtvi.config";

import Portrait from "./Portrait";

import styles from "./styles.module.css";

type OSDProps = {};

const OSD: React.FC<OSDProps> = ({}) => {
  // const { character, localCharacter, isCalling } = useContext(AppContext);
  const [botIsSpeaking, setBotIsSpeaking] = useState<boolean>(false);
  const [localIsSpeaking, setLocalIsSpeaking] = useState<boolean>(false);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useVoiceClientEvent(VoiceEvent.RemoteAudioLevel, (vol: number) => {
    setBotIsSpeaking(vol > 0.005);
  });

  useVoiceClientEvent(VoiceEvent.LocalAudioLevel, (vol: number) => {
    setLocalIsSpeaking(vol > 0.02);
  });

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div>
          <img src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" />
          <p>{botIsSpeaking ? "Talking" : "Not talking"}</p>
        </div>

        <div>
          {/* <img src="https://cdn.pixabay.com/photo/2016/03/26/20/35/young-man-1281282_640.jpg" /> */}
          <p>{localIsSpeaking ? "Talking" : "Not talking"}</p>
        </div>
      </div>
    </div>
  );
};

export default OSD;
