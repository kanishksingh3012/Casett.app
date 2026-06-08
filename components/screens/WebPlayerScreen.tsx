"use client";

import { useState } from "react";
import { useEffect } from "react";
import type { Tape } from "@/lib/types";
import Waveform from "@/components/ui/Waveform";
import { FlipCassette } from "@/components/cassette";
import { ICON } from "@/components/ui/icons";
import { STICKER_SVG } from "@/lib/data";

interface WebPlayerScreenProps {
  tape: Tape;
  onClose: () => void;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function WebPlayerScreen({ tape, onClose }: WebPlayerScreenProps) {
  const [flipped, setFlipped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true);

  const side = flipped ? "B" : "A";
  const total = side === "A" ? (tape.voiceLen || 90) : 30;

  const tapeId =
    "casett.app/t/" +
    (tape.title
      ? tape.title
          .toLowerCase()
          .replace(/[^a-z]/g, "")
          .slice(0, 4)
      : "9x4k");

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
    <div className="screen browser">
      <div className="browserbar">
        <span className="bb-lock">🔒</span>
        <span className="bb-url">{tapeId}</span>
        <span className="bb-dots">⋯</span>
      </div>
      {bannerVisible && (
        <div className="app-banner">
          <div className="ab-icon">
            <span
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 24 24" width="18" height="18">${STICKER_SVG.note ?? ""}</svg>`,
              }}
            />
          </div>
          <div className="ab-txt">
            <b>Casett</b>
            <span>Open in the app</span>
          </div>
          <button className="ab-get">Get</button>
          <button className="ab-x" onClick={() => setBannerVisible(false)}>
            ✕
          </button>
        </div>
      )}
      <div className="player-body">
        <div className="player-from">
          A tape from <b>{tape.from || "Alex"}</b>
        </div>
        <FlipCassette tape={tape} flipped={flipped} spin={playing} />
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
        <button className="save-received" onClick={onClose}>
          ♥ Save to your Library
        </button>
      </div>
    </div>
  );
}
