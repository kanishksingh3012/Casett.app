"use client";

import { useState, useEffect } from "react";
import type { Tape } from "@/lib/types";
import StatusBar from "@/components/ui/StatusBar";
import TopBar from "@/components/ui/TopBar";
import Waveform from "@/components/ui/Waveform";
import { FlipCassette } from "@/components/cassette";
import { ICON } from "@/components/ui/icons";

interface AppPlayerScreenProps {
  tape: Tape;
  onBack: () => void;
  onShare: () => void;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function AppPlayerScreen({ tape, onBack, onShare }: AppPlayerScreenProps) {
  const [flipped, setFlipped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const side = flipped ? "B" : "A";
  const total = side === "A" ? (tape.voiceLen || 90) : 30;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setElapsed((e) => {
        if (e >= total - 1) {
          clearInterval(id);
          setPlaying(false);
          return total;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, side, total]);

  const handleFlip = () => {
    setFlipped((f) => !f);
    setElapsed(0);
    setPlaying(false);
  };

  const handleRew = () => {
    setFlipped(false);
    setElapsed(0);
    setPlaying(false);
  };

  return (
    <div className="screen">
      <StatusBar />
      <TopBar
        onBack={onBack}
        title={tape.title || "Tape"}
        action={
          <button className="share-glass" onClick={onShare}>
            <span className="dot" />
            Share
          </button>
        }
      />
      <div className="player-body" style={{ paddingTop: "10px" }}>
        <div style={{ width: "100%", margin: "0 auto 14px" }}>
          <FlipCassette tape={tape} flipped={flipped} spin={playing} />
        </div>
        <div className="side-ind">
          <span className={side === "A" ? "on" : ""}>● Voice</span>
          <span className={side === "B" ? "on" : ""}>● Song</span>
        </div>
        <div className="player-now">
          <div className="now voice">
            <Waveform active={playing} />
            <div className="now-cap">
              {fmt(elapsed)} — {fmt(total)}
            </div>
          </div>
        </div>
        <div className="player-transport">
          <button className="tbtn" onClick={handleRew}>
            {ICON.rew}
          </button>
          <button className="tbtn play" onClick={() => setPlaying((p) => !p)}>
            {playing ? ICON.pause : ICON.play}
          </button>
          <button className="tbtn flip-btn" onClick={handleFlip}>
            {ICON.flip}
            <span className="flip-hint">flip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
