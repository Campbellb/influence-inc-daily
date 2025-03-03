import React, { createContext, ReactNode, useCallback, useState } from "react";
import { LLMContext, LLMContextMessage, LLMHelper } from "realtime-ai";
import { useVoiceClient } from "realtime-ai-react";

import { usePlayCodecSound } from "./hooks/usePlayCodecSound";
import {
  CharacterEnum,
  CHARACTERS,
  CharacterValue,
  IDLE_PROMPT,
  PlayerLevelEnum,
  PlayerLevelValue,
  RETURN_PROMPT,
} from "./rtvi.config";

type CharacterMessageHistory = {
  [character: string]: LLMContextMessage[];
};

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AppContextType {
  character: CharacterEnum | null;
  setCharacter: (newCharacter: CharacterEnum) => void;
  localCharacter: PlayerLevelEnum;
  setLocalCharacter: (newCharacter: PlayerLevelEnum) => void;
  messageHistory: CharacterMessageHistory;
  setMessageHistory: (messageHistory: CharacterMessageHistory) => void;
  getCurrentContext: () => Promise<LLMContext>;
  switchCharacter: (newCharacter: CharacterEnum) => Promise<CharacterEnum>;
  runIdleCheck: () => void;
  isCalling: boolean;
  setIsCalling: (isCalling: boolean) => void;
  userLevel: number;
  setUserLevel: (level: number) => void;
  checkForPromotion: (transcript: string) => void;
  resetUserLevel: () => void;
  secretValue: number;
  setSecretValue: (value: number) => void;
  playerName: string;
  setPlayerName: (playerName: string) => void;
  resetGameState: () => void;
}

export const AppContext = createContext<AppContextType>({
  character: CharacterEnum.Employee,
  setCharacter: () => {
    throw new Error("setCharacter function must be overridden");
  },
  localCharacter: PlayerLevelEnum.Intern,
  setLocalCharacter: () => {
    throw new Error("setLocalCharacter function must be overridden");
  },
  messageHistory: {},
  setMessageHistory: () => {
    throw new Error("setMessageHistory function must be overridden");
  },
  getCurrentContext: () => {
    throw new Error("getCurrentContext function must be overridden");
  },
  switchCharacter: () => {
    throw new Error("switchCharacter function must be overridden");
  },
  runIdleCheck: () => {
    throw new Error("runIdleCheck function must be overridden");
  },
  isCalling: false,
  setIsCalling: () => {
    throw new Error("setIsCalling function must be overridden");
  },
  userLevel: 1,
  setUserLevel: () => {
    throw new Error("setUserLevel function must be overridden");
  },
  checkForPromotion: () => {
    throw new Error("checkForPromotion function must be overridden");
  },
  resetUserLevel: () => {
    throw new Error("resetUserLevel function must be overridden");
  },
  secretValue: 0,
  setSecretValue: () => {
    throw new Error("setSecretValue function must be overridden");
  },
  playerName: "",
  setPlayerName: () => {
    throw new Error("setPlayerName function must be overridden");
  },
  resetGameState: () => {
    throw new Error("resetGameState function must be overridden");
  },
});
AppContext.displayName = "AppContext";

type AppContextProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<
  React.PropsWithChildren<AppContextProps>
> = ({ children }) => {
  const voiceClient = useVoiceClient()!;

  const [character, setCharacter] = useState<CharacterEnum | null>(
    CharacterEnum.Employee
  );
  const [localCharacter, setLocalCharacter] = useState<PlayerLevelEnum>(
    PlayerLevelEnum.Intern
  );
  const [messageHistory, setMessageHistory] = useState<CharacterMessageHistory>(
    {}
  );
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [secretValue, setSecretValue] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>("");

  const playCodecSound = usePlayCodecSound();

  const getCurrentContext = useCallback(async (): Promise<LLMContext> => {
    const llmHelper = voiceClient.getHelper("llm") as LLMHelper;
    const ctx = await llmHelper.getContext();
    return ctx;
  }, [voiceClient]);

  const switchCharacter = useCallback(
    async (newCharacter: CharacterEnum): Promise<CharacterEnum> => {
      if (newCharacter === character || !voiceClient) {
        return newCharacter;
      }

      setIsCalling(true);

      if (voiceClient.state !== "ready") {
        setTimeout(() => setIsCalling(false), 1000);
        return newCharacter;
      }

      // Get and store the current context for this character
      const llmHelper = voiceClient.getHelper("llm") as LLMHelper;
      const ctx = await llmHelper.getContext();

      if (character) {
        setMessageHistory((prev) => ({
          ...prev,
          [character]: ctx.messages as LLMContextMessage[],
        }));
      }

      // Get from history or create LLM context for character if it doesn't exist
      const newCtx: LLMContextMessage[] = messageHistory[newCharacter] || [
        {
          role: "system",
          content:
            `You are a key member of Influence Inc., engaging in a conversation with a new ambitious coworker named ${playerName}. ` +
            CHARACTERS.find((c) => c.name === newCharacter)?.prompt +
            `  If the player demonstrates exceptional skills related to your role, use the exact phrase: "${
              CHARACTERS.find((c) => c.name === character)?.promotionCriteria
            }"`,
        },
      ];

      if (newCharacter === CharacterEnum.Employee) {
        const newSecretValue = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        setSecretValue(newSecretValue);

        // Update the prompt with the secret value
        const updatedPrompt = CHARACTERS.find(
          (c) => c.name === CharacterEnum.Employee
        )?.prompt.replace("{SECRET_VALUE}", newSecretValue.toString());

        newCtx[0].content = updatedPrompt || newCtx[0].content;
      }

      // Create new config object for character
      const newConfig = voiceClient.setConfigOptions([
        {
          service: "tts",
          options: [
            {
              name: "voice",
              value: CHARACTERS.find((c) => c.name === newCharacter)?.voice_id,
            },
          ],
        },
        {
          service: "llm",
          options: [
            {
              name: "initial_messages",
              value: [...newCtx, ...(newCtx.length > 1 ? [RETURN_PROMPT] : [])],
            },
          ],
        },
      ]);

      // Update voice client config with the new character config
      try {
        await voiceClient.updateConfig(newConfig, true);
      } catch (e) {
        throw new Error("Error updating voice client config");
      }
      setCharacter(newCharacter);
      return newCharacter;
    },
    [character, voiceClient, messageHistory, playerName]
  );

  const runIdleCheck = useCallback(() => {
    if (!voiceClient || !character) {
      return;
    }

    console.debug("Running idle check for " + character);

    const llmHelper = voiceClient.getHelper("llm") as LLMHelper;
    llmHelper.appendToMessages(IDLE_PROMPT, true);
  }, [voiceClient, character]);

  const checkForPromotion = useCallback(
    (transcript: string) => {
      const currentCharacter = CHARACTERS.find((c) => c.name === character);
      if (
        currentCharacter &&
        transcript.includes(currentCharacter.promotionCriteria)
      ) {
        const newLevel = userLevel + 1;
        setUserLevel(newLevel);
        setLocalCharacter(PlayerLevelValue[newLevel]);
        console.log("level up!");
        playCodecSound("levelup");
        setTimeout(() => {
          switchCharacter(CharacterValue[newLevel]);
        }, 10000);
      }
    },
    [character, userLevel, playCodecSound, switchCharacter]
  );

  const resetUserLevel = useCallback(async () => {
    setUserLevel(1);
    setLocalCharacter(PlayerLevelEnum.Intern);
    setCharacter(CharacterEnum.Employee);
    setMessageHistory({});

    // Reset the voice client state
    if (voiceClient) {
      // Disconnect the current session
      await voiceClient.disconnect();

      // Set up a new configuration for the initial character
      const newConfig = voiceClient.setConfigOptions([
        {
          service: "tts",
          options: [
            {
              name: "voice",
              value: CHARACTERS.find((c) => c.name === CharacterEnum.Employee)
                ?.voice_id,
            },
          ],
        },
        {
          service: "llm",
          options: [
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content:
                    CHARACTERS.find((c) => c.name === CharacterEnum.Employee)
                      ?.prompt || "",
                },
              ],
            },
          ],
        },
      ]);

      // Update the voice client with the new configuration
      await voiceClient.updateConfig(newConfig, true);
    }
  }, [voiceClient]);

  const resetGameState = useCallback(async () => {
    setUserLevel(1);
    setLocalCharacter(PlayerLevelEnum.Intern);
    setCharacter(CharacterEnum.Employee);
    setMessageHistory({});

    // Reset the voice client state
    if (voiceClient) {
      // Disconnect the current session
      await voiceClient.disconnect();

      // Set up a new configuration for the initial character
      const newConfig = voiceClient.setConfigOptions([
        {
          service: "tts",
          options: [
            {
              name: "voice",
              value: CHARACTERS.find((c) => c.name === CharacterEnum.Employee)
                ?.voice_id,
            },
          ],
        },
        {
          service: "llm",
          options: [
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content:
                    CHARACTERS.find((c) => c.name === CharacterEnum.Employee)
                      ?.prompt || "",
                },
              ],
            },
          ],
        },
      ]);

      // Update the voice client with the new configuration
      await voiceClient.updateConfig(newConfig, true);
    }
  }, [voiceClient]);

  return (
    <AppContext.Provider
      value={{
        character,
        setCharacter,
        localCharacter,
        setLocalCharacter,
        messageHistory,
        setMessageHistory,
        getCurrentContext,
        switchCharacter,
        runIdleCheck,
        isCalling,
        setIsCalling,
        userLevel,
        setUserLevel,
        checkForPromotion,
        resetUserLevel,
        secretValue,
        setSecretValue,
        playerName,
        setPlayerName,
        resetGameState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
