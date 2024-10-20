import React, { useContext } from "react";

import { AppContext } from "@/context";
import { CHARACTERS } from "@/rtvi.config";

import styles from "./styles.module.css";

const QuestLog: React.FC = () => {
  const { character, userLevel, localCharacter } = useContext(AppContext);
  const currentCharacter = CHARACTERS.find((c) => c.name === character);

  if (!currentCharacter) return null;

  return (
    <div className={styles.questLog}>
      <div className={styles.header}>
        <h3>Mission Objectives</h3>
        <p className={styles.level}>
          {localCharacter} <span>(Level {userLevel})</span>
        </p>
      </div>
      <ul className={styles.tasks}>
        {currentCharacter.tasks.map((task, index) => (
          <li key={index} className={styles.task}>
            <span className={styles.bullet}>•</span>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestLog;
