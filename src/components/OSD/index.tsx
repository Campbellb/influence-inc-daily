import React, { useContext, useEffect, useState } from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

import { AppContext } from "@/context";
import { CHARACTERS } from "@/rtvi.config";
import { getPlayerImage } from "@/utils/getPlayerImage";

import styles from "./styles.module.css";

const characterImageMap: { [key: string]: string } = {
  employee: "/character1.png",
  manager: "/character2.png",
  executive: "/character3.png",
};

const OSD: React.FC = () => {
  const { character, localCharacter, userLevel } = useContext(AppContext);
  const [botIsSpeaking, setBotIsSpeaking] = useState<boolean>(false);
  const [localIsSpeaking, setLocalIsSpeaking] = useState<boolean>(false);
  const [currentTasks, setCurrentTasks] = useState<string[]>([]);

  useEffect(() => {
    const currentCharacter = CHARACTERS.find((c) => c.name === character);
    if (currentCharacter) {
      setCurrentTasks(currentCharacter.tasks);
      console.log("Character changed:", character);
      console.log("New tasks:", currentCharacter.tasks);
    }
  }, [character]);

  useVoiceClientEvent(VoiceEvent.RemoteAudioLevel, (vol: number) => {
    setBotIsSpeaking(vol > 0.005);
  });

  useVoiceClientEvent(VoiceEvent.LocalAudioLevel, (vol: number) => {
    setLocalIsSpeaking(vol > 0.02);
  });

  const playerImage = getPlayerImage(userLevel);

  return (
    <div className={`${styles.container} w-full mx-auto p-4 md:p-6 lg:p-8`}>
      <div className={`${styles.inner} flex flex-col lg:flex-row`}>
        <div className={`${styles.characterPortrait} mb-4 lg:mb-0`}>
          <img
            src={characterImageMap[character?.toLowerCase() || "employee"]}
            alt={character}
            className="w-full h-full object-cover"
          />
          <div
            className={botIsSpeaking ? styles.speaking : styles.notSpeaking}
          ></div>
        </div>
        <div className={`${styles.infoPanel} my-4 lg:my-0 lg:mx-6 flex-grow`}>
          <h2 className={styles.infoTitle}>Office Objectives</h2>
          <div className={styles.infoContent}>
            <p className={styles.level}>
              {localCharacter} <span>(Level {userLevel})</span>
            </p>
            <ul className={styles.tasks}>
              {currentTasks.map((task, index) => (
                <li key={`${character}-${index}`} className={styles.task}>
                  <span className={styles.bullet}>•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`${styles.playerPortrait} mt-4 lg:mt-0`}>
          <img
            src={playerImage}
            alt={`Level ${userLevel} - ${localCharacter}`}
            className="w-full h-full object-contain"
          />
          <div
            className={localIsSpeaking ? styles.speaking : styles.notSpeaking}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OSD;
