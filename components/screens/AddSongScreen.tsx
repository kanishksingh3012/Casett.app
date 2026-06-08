"use client";

import { useState } from "react";
import type { Tape, Song } from "@/lib/types";
import { SONGS } from "@/lib/data";
import StatusBar from "@/components/ui/StatusBar";
import TopBar from "@/components/ui/TopBar";
import Stepper from "@/components/ui/Stepper";
import { ICON } from "@/components/ui/icons";

interface AddSongScreenProps {
  tape: Tape;
  set: (patch: Partial<Tape>) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function AddSongScreen({ tape, set, onBack, onNext }: AddSongScreenProps) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Song | null>(tape.song || null);
  const [playing, setPlaying] = useState<number | null>(null);

  const list = SONGS.filter((s) =>
    (s.title + s.artist).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="screen">
      <StatusBar />
      <TopBar onBack={onBack} title="Side B · One Song" step="3 / 5" />
      <div className="screen-body">
        <Stepper step={1} />
        <div className="field search">
          <input
            value={q}
            placeholder="Search a song…"
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="song-list">
          {list.map((s, i) => {
            const on = sel && sel.title === s.title;
            return (
              <div
                key={i}
                className={`song-row${on ? " on" : ""}`}
                onClick={() => setSel(s)}
              >
                <button
                  className="song-art"
                  style={{
                    background: `linear-gradient(135deg,${s.a},${s.b})`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaying(playing === i ? null : i);
                  }}
                >
                  {playing === i ? ICON.pause : ICON.play}
                </button>
                <div className="song-info">
                  <div className="t">{s.title}</div>
                  <div className="a">{s.artist} · 0:30 preview</div>
                  {playing === i && (
                    <div className="mini-bar">
                      <i />
                    </div>
                  )}
                </div>
                <span className={`song-pick${on ? " on" : ""}`}>
                  {on ? ICON.check : ICON.plus}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="screen-foot">
        <button
          className="cta"
          disabled={!sel}
          onClick={() => {
            set({ song: sel });
            onNext();
          }}
        >
          Next · Customize
        </button>
      </div>
    </div>
  );
}
