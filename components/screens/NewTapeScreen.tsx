"use client";

import type { Tape } from "@/lib/types";
import StatusBar from "@/components/ui/StatusBar";
import TopBar from "@/components/ui/TopBar";
import Cassette from "@/components/cassette";

interface NewTapeScreenProps {
  tape: Tape;
  set: (patch: Partial<Tape>) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function NewTapeScreen({ tape, set, onBack, onNext }: NewTapeScreenProps) {
  return (
    <div className="screen">
      <StatusBar />
      <TopBar onBack={onBack} title="New Tape" step="1 / 5" />
      <div className="screen-body">
        <div className="cass-stage">
          <Cassette tape={tape} side="A" showStickers={false} />
        </div>
        <div className="field">
          <label>Tape title · 4–5 words</label>
          <input
            value={tape.title}
            maxLength={28}
            placeholder="thinking of you lately"
            onChange={(e) => set({ title: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Who&apos;s it from?</label>
          <input
            value={tape.from}
            maxLength={16}
            placeholder="Alex"
            onChange={(e) => set({ from: e.target.value })}
          />
        </div>
      </div>
      <div className="screen-foot">
        <button className="cta" disabled={!tape.title.trim()} onClick={onNext}>
          Next · Record Side A
        </button>
      </div>
    </div>
  );
}
