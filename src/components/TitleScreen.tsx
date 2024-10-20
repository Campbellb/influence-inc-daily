import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useVoiceClient } from "realtime-ai-react";

import Logo from "@/assets/logo.svg";
import { AppContext } from "@/context";
import { usePlayCodecSound } from "@/hooks/usePlayCodecSound";

import { Button } from "./ui/button";
import DeviceSelect from "./DeviceSelect";

interface TitleScreenProps {
  handleStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ handleStart }) => {
  const [started, setStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const voiceClient = useVoiceClient()!;
  const { resetUserLevel, setPlayerName: setContextPlayerName } =
    useContext(AppContext);

  useEffect(() => {
    if (!voiceClient) return;
    voiceClient.initDevices();
  }, [voiceClient]);

  if (started) {
    return null;
  }

  return (
    <div className="relative bg-black w-full h-full flex flex-col justify-between items-center p-8">
      <div className="animate-fadeIn absolute inset-0 z-0 opacity-0">
        <div className="bg-[url(/bg.jpg)] bg-cover absolute inset-0 z-0" />
      </div>
      <header className="text-center relative z-1 ">
        <h1
          className="text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-lg"
          style={{
            fontFamily: "'Arial Black', Helvetica, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Influence Inc.
        </h1>
      </header>
      <div className="animate-appear relative p-8 w-full max-w-lg z-2 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome to Influence Inc.
          </h2>
          <p className="text-lg text-gray-600">
            For the best experience, please use headphones in a quiet
            environment.
          </p>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="border border-gray-300 rounded px-3 py-2"
          />

          <DeviceSelect hideMeter={false} />

          <Button
            variant="primary"
            className="self-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            onClick={async () => {
              if (playerName.trim() === "") {
                alert("Please enter your name before starting.");
                return;
              }
              setStarted(true);
              await resetUserLevel();
              setContextPlayerName(playerName);
              setTimeout(() => {
                handleStart();
              }, 2000);
            }}
          >
            Start Your Career
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
