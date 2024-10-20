import React from "react";
import { useContext } from "react";

import { AppContext } from "@/context";

const VoiceInteractionPanel: React.FC = () => {
  const { isCalling } = useContext(AppContext);

  return (
    <div className="flex items-center justify-center p-4 bg-office-primary">
      <div className="flex items-center space-x-4">
        <div
          className={`w-6 h-6 rounded-full border-2 border-white ${
            isCalling ? "bg-office-accent animate-pulse" : "bg-office-secondary"
          }`}
        ></div>
        <span className="text-lg font-mono text-white">
          {isCalling ? "Listening..." : "Awaiting your command"}
        </span>
      </div>
    </div>
  );
};

export default VoiceInteractionPanel;
