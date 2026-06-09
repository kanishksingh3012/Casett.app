"use client";

import { useState, useEffect, useRef } from "react";
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
  `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, "0")}`;

export default function WebPlayerScreen({ tape, onClose }: WebPlayerScreenProps) {
  const [flipped, setFlipped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const side = flipped ? "B" : "A";
  const sideUrl = side === "A" ? (tape.voiceUrl ?? null) : (tape.song?.previewUrl ?? null);
  const total = side === "A" ? (tape.voiceLen || 90) : 30;

  const tapeId =
    "casett.app/t/" +
    (tape.title
      ? tape.title.toLowerCase().replace(/[^a-z]/g, "").slice(0, 4)
      : "9x4k");

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    audioRef.current?.pause();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioRef.current = null;
    setElapsed(0);
    setPlaying(false);
  }, [flipped]);

  const tick = () => {
    const a = audioRef.current;
    if (!a) return;
    setElapsed(a.currentTime);
    if (!a.paused) rafRef.current = requestAnimationFrame(tick);
  };

  const togglePlay = () => {
    if (!sideUrl) return;
    if (playing) {
      audioRef.current?.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setPlaying(false);
    } else {
      if (audioRef.current?.paused && audioRef.current.src) {
        audioRef.current.play();
        rafRef.current = requestAnimationFrame(tick);
        setPlaying(true);
      } else {
        const a = new Audio(sideUrl);
        audioRef.current = a;
        a.onended = () => { setPlaying(false); setElapsed(0); };
        a.play();
        rafRef.current = requestAnimationFrame(tick);
        setPlaying(true);
      }
    }
  };

  const handleFlip = () => {
    setFlipped((f) => !f);
  };

  const handleRew = () => {
    audioRef.current?.pause();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioRef.current = null;
    setElapsed(0);
    setPlaying(false);
    setFlipped(false);
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
          <button className="ab-x" onClick={() => setBannerVisible(false)}>✕</button>
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
          {side === "B" && tape.song && (
            <div style={{ fontSize: 13, opacity: 0.6, marginTop: 6, textAlign: "center" }}>
              {tape.song.title} · {tape.song.artist}
            </div>
          )}
        </div>
        <div className="player-transport">
          <button className="tbtn" onClick={handleRew}>{ICON.rew}</button>
          <button
            className="tbtn play"
            onClick={togglePlay}
            style={{ opacity: sideUrl ? 1 : 0.35 }}
          >
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
