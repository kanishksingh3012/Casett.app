"use client";

import { useState, useRef, useEffect } from "react";
import type { Tape } from "@/lib/types";
import StatusBar from "@/components/ui/StatusBar";
import TopBar from "@/components/ui/TopBar";
import Stepper from "@/components/ui/Stepper";
import LCD from "@/components/ui/LCD";
import Waveform from "@/components/ui/Waveform";
import Cassette from "@/components/cassette";
import { ICON } from "@/components/ui/icons";
import { uploadVoiceBlob } from "@/lib/tapeStore";

interface RecordScreenProps {
  tape: Tape;
  set: (patch: Partial<Tape>) => void;
  onBack: () => void;
  onNext: () => void;
}

const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function RecordScreen({ tape, set, onBack, onNext }: RecordScreenProps) {
  const [rec, setRec] = useState(false);
  const [done, setDone] = useState(tape.hasVoice && !!tape.voiceUrl);
  const [t, setT] = useState(tape.voiceLen || 0);
  const [playing, setPlaying] = useState(false);
  const [err, setErr] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string>(tape.voiceUrl || "");
  const publicUrlRef = useRef<string>(tape.voiceUrl?.startsWith("http") ? tape.voiceUrl : "");

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mrRef.current && mrRef.current.state !== "inactive") mrRef.current.stop();
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const startRec = async () => {
    setErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mrRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const mimeType = chunksRef.current[0]?.type || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blobUrlRef.current.startsWith("blob:")) URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = URL.createObjectURL(blob);
        publicUrlRef.current = "";
        audioRef.current = null;
        setDone(true);
        setRec(false);
        // Upload blob directly — avoids iOS Safari blob: re-fetch restriction
        uploadVoiceBlob(blob)
          .then((url) => { publicUrlRef.current = url; })
          .catch(() => { /* will fall back to blobUrlRef at proceed() */ });
      };

      mr.start();
      setT(0);
      setRec(true);

      timerRef.current = setInterval(() => {
        setT((x) => {
          if (x >= 90) {
            if (mrRef.current && mrRef.current.state !== "inactive") mrRef.current.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            return 90;
          }
          return x + 1;
        });
      }, 1000);
    } catch {
      setErr("Microphone access denied — please allow mic in your browser.");
    }
  };

  const stopRec = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mrRef.current && mrRef.current.state !== "inactive") mrRef.current.stop();
  };

  const toggle = () => {
    if (rec) {
      stopRec();
    } else {
      startRec();
    }
  };

  const reRecord = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    publicUrlRef.current = "";
    setDone(false);
    setRec(false);
    setT(0);
    setPlaying(false);
    setErr("");
  };

  const playback = () => {
    if (!blobUrlRef.current) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(blobUrlRef.current);
        audioRef.current.onended = () => setPlaying(false);
      }
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const proceed = () => {
    const voiceUrl = publicUrlRef.current || blobUrlRef.current || undefined;
    set({ hasVoice: done, voiceLen: t, voiceUrl });
    onNext();
  };

  const status = rec ? "REC" : done ? "DONE" : "READY";

  return (
    <div className="screen">
      <StatusBar />
      <TopBar onBack={onBack} title="Side A · Your Voice" step="2 / 5" />
      <div className="screen-body">
        <Stepper step={0} />
        <div className="cass-stage">
          <Cassette tape={tape} side="A" spin={rec} showStickers={false} />
        </div>
        <LCD
          status={status}
          time={mmss(t)}
          totalTime="1:30"
          side="A"
          recording={rec}
        />
        <Waveform active={rec || playing} />
        {err && (
          <div style={{ color: "#FF453A", fontSize: 12, textAlign: "center", margin: "-4px 0 4px" }}>
            {err}
          </div>
        )}
        <div className="rec-controls">
          {!done ? (
            <div className="rec-center">
              <button
                className={`rec-btn${rec ? " on" : ""}`}
                onClick={toggle}
              >
                <span className="rdot" />
              </button>
              <span className="rec-cap">{rec ? "tap to stop" : "tap to record"}</span>
            </div>
          ) : (
            <div className="rec-done">
              <div className="rec-row">
                <button className="tbtn" onClick={reRecord}>{ICON.rew}</button>
                <button className={`tbtn play${playing ? " on" : ""}`} onClick={playback}>
                  {playing ? ICON.pause : ICON.play}
                </button>
              </div>
              <span className="rec-cap">re-record · play back</span>
            </div>
          )}
        </div>
      </div>
      <div className="screen-foot">
        <button className="cta" disabled={!done} onClick={proceed}>
          Next · Add a song
        </button>
        <button
          className="link-btn"
          onClick={proceed}
          style={{ opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}
        >
          skip voice — song only
        </button>
      </div>
    </div>
  );
}
