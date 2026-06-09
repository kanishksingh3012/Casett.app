"use client";

import { useState, useEffect, useRef } from "react";
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
  `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, "0")}`;

export default function AppPlayerScreen({ tape, onBack, onShare }: AppPlayerScreenProps) {
  const [flipped, setFlipped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const side = flipped ? "B" : "A";
  const sideUrl = side === "A" ? (tape.voiceUrl ?? null) : (tape.song?.previewUrl ?? null);
  const total = side === "A" ? (tape.voiceLen || 90) : 30;

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
    if (audioRef.current) audioRef.current.currentTime = 0;
    audioRef.current = null;
    setElapsed(0);
    setPlaying(false);
    setFlipped(false);
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
      </div>
    </div>
  );
}
