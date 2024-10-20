import React, { useEffect, useRef } from "react";
import { useVoiceClientEvent } from "realtime-ai-react";

import { usePlayCodecSound } from "@/hooks/usePlayCodecSound";

import { Button } from "./ui/button";

export type MissionCompleteProps = {
  onContinue: () => void;
};

const MissionComplete: React.FC<MissionCompleteProps> = ({ onContinue }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-fadeIn relative max-w-2xl mx-auto flex flex-col items-center gap-8 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800">Congratulations!</h1>
        <p className="text-xl text-gray-600 text-center">
          You've successfully climbed the corporate ladder and impressed the
          Executive! You're now ready for even greater challenges in the world
          of Influence Inc.
        </p>
        <Button
          variant="primary"
          onClick={onContinue}
          className="animate-pulse bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Start a New Game
        </Button>
      </div>
    </div>
  );
};

export default MissionComplete;
