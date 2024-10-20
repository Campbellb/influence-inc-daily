import React, { useContext, useState } from "react";
import { useVoiceClient } from "realtime-ai-react";

import { AppContext } from "@/context";

import { Button } from "./ui/button";
import ExpiryTimer from "./ExpiryTimer";

interface FooterProps {
  // Define your component props here
  handleDisconnect: () => void;
}

const Footer: React.FC<FooterProps> = ({ handleDisconnect }) => {
  const [muted, setMuted] = useState(false);
  const voiceClient = useVoiceClient();

  return (
    <footer className="flex flex-row w-full items-end justify-between mt-auto">
      <div className="flex flex-row gap-6 items-end">
        <Button
          variant={muted ? "primary" : "outline"}
          size="sm"
          onClick={() => {
            if (muted) {
              voiceClient?.enableMic(true);
            } else {
              voiceClient?.enableMic(false);
            }
            setMuted(!muted);
          }}
          className="text-black"
        >
          {muted ? "Unmute" : "Mute"}
        </Button>
        <Button
          variant="disconnect"
          size="sm"
          onClick={() => handleDisconnect()}
        >
          Disconnect
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
