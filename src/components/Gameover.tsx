import React, { useEffect, useRef } from "react";

import { usePlayCodecSound } from "@/hooks/usePlayCodecSound";

import { Button } from "./ui/button";

export type GameoverProps = {
  onContinue: () => void;
};

const Gameover: React.FC<GameoverProps> = ({ onContinue }) => {
  return (
    <div className="w-full h-full flex items-center">
      <div className="animate-fadeIn relative max-w-2xl mx-auto flex flex-col items-center gap-8 p-8">
        Game Over
        <Button
          variant="ghost"
          onClick={() => {
            onContinue();
          }}
          className="animate-pulse"
        >
          Retry
        </Button>
      </div>
    </div>
  );
};

export default Gameover;
