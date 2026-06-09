"use client";

import { useEffect, useState, useRef } from "react";
import type { Tape } from "@/lib/types";
import Waveform from "@/components/ui/Waveform";
import { FlipCassette } from "@/components/cassette";
import { ICON } from "@/components/ui/icons";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, "0")}`;

export default function StandalonePlayer() {
  const [tape, setTape] = useState<Tape | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cz_share_tape");
      if (raw) setTape(JSON.parse(raw));
    } catch {}
  }, []);

  const side = flipped ? "B" : "A";
  const sideUrl = side === "A" ? (tape?.voiceUrl ?? null) : (tape?.song?.previewUrl ?? null);
  const total = side === "A" ? (tape?.voiceLen || 90) : 30;

  useEffect(() => {
    audioRef.current?.pause();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioRef.current = null;
    setElapsed(0);
    setPlaying(false);
  }, [flipped]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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

  const handleRew = () => {
    audioRef.current?.pause();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioRef.current = null;
    setElapsed(0);
    setPlaying(false);
    setFlipped(false);
  };

  if (!tape) {
    return (
      <div style={{
        minHeight: "100dvh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#08080a", color: "#9A9AA0", gap: 12,
        fontFamily: "system-ui",
      }}>
        <div style={{ fontSize: 32 }}>📼</div>
        <div style={{ fontSize: 15 }}>No tape found.</div>
        <a href="/" style={{ fontSize: 13, color: "#E8A030", textDecoration: "none" }}>
          ← Make your own
        </a>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background:
        "radial-gradient(120% 80% at 82% -5%, rgba(232,160,48,.07), transparent 52%), " +
        "radial-gradient(90% 60% at 8% 108%, rgba(127,224,168,.05), transparent 60%), " +
        "#08080a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
      fontFamily: "system-ui, sans-serif",
      color: "#F4F4F2",
    }}>
      {/* from label */}
      <div style={{ fontSize: 14, color: "#9A9AA0", marginBottom: 20 }}>
        A tape from <strong style={{ color: "#F4F4F2" }}>{tape.from || "someone"}</strong>
      </div>

      {/* cassette */}
      <div style={{ width: "100%", maxWidth: 360, marginBottom: 24 }}>
        <FlipCassette tape={tape} flipped={flipped} spin={playing} />
      </div>

      {/* side indicator */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        {["A", "B"].map((s) => (
          <span key={s} style={{
            fontSize: 13, fontWeight: 600, letterSpacing: "0.04em",
            color: side === s ? "#E8A030" : "#3A3A42",
          }}>
            ● {s === "A" ? "Voice" : "Song"}
          </span>
        ))}
      </div>

      {/* waveform + time */}
      <div style={{ width: "100%", maxWidth: 300, marginBottom: 20 }}>
        <Waveform active={playing} />
        <div style={{ textAlign: "center", fontSize: 13, color: "#65656B", marginTop: 6 }}>
          {fmt(elapsed)} — {fmt(total)}
        </div>
        {side === "B" && tape.song && (
          <div style={{ textAlign: "center", fontSize: 13, color: "#9A9AA0", marginTop: 4 }}>
            {tape.song.title} · {tape.song.artist}
          </div>
        )}
      </div>

      {/* transport */}
      <div className="player-transport">
        <button className="tbtn" onClick={handleRew}>{ICON.rew}</button>
        <button
          className="tbtn play"
          onClick={togglePlay}
          style={{ opacity: sideUrl ? 1 : 0.35 }}
        >
          {playing ? ICON.pause : ICON.play}
        </button>
        <button className="tbtn flip-btn" onClick={() => setFlipped(f => !f)}>
          {ICON.flip}
          <span className="flip-hint">flip</span>
        </button>
      </div>

      {/* back link */}
      <a href="/" style={{
        marginTop: 32, fontSize: 13, color: "#E8A030",
        textDecoration: "none", opacity: 0.7,
      }}>
        Make your own ↗
      </a>
    </div>
  );
}
