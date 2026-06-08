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
  const [done, setDone] = useState(tape.hasVoice || false);
  const [t, setT] = useState(tape.voiceLen || 0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (rec) {
      ref.current = setInterval(() => {
        setT((x) => {
          if (x >= 90) {
            if (ref.current) clearInterval(ref.current);
            setRec(false);
            setDone(true);
            return 90;
          }
          return x + 1;
        });
      }, 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [rec]);

  const toggle = () => {
    if (done) return;
    if (rec) {
      setRec(false);
      setDone(true);
    } else {
      setRec(true);
    }
  };

  const proceed = () => {
    set({ hasVoice: true, voiceLen: t });
    onNext();
  };

  const status = rec ? "REC" : done ? "DONE" : "READY";

  return (
    <div className="screen">
      <StatusBar />
      <TopBar onBack={onBack} title="Side A · Your Voice" step="2 / 5" />
      <div className="screen-body">
        <Stepper step={0} />
        <div className="cass-stage sm">
          <Cassette tape={tape} side="A" spin={rec} showStickers={false} />
        </div>
        <LCD
          status={status}
          time={mmss(t)}
          totalTime="1:30"
          side="A"
          recording={rec}
        />
        <Waveform active={rec} />
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
                <button
                  className="tbtn"
                  onClick={() => {
                    setDone(false);
                    setRec(false);
                    setT(0);
                  }}
                >
                  {ICON.rew}
                </button>
                <button className="tbtn play">{ICON.play}</button>
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
